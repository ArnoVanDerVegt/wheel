/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher                             = require('../../../../lib/dispatcher').dispatcher;
const path                                   = require('../../../../lib/path');
const TabPanel                               = require('../../../../lib/components/TabPanel').TabPanel;
const getDataProvider                        = require('../../../../lib/dataprovider/dataProvider').getDataProvider;
const SourceBuilder                          = require('../../../source/SourceBuilder').SourceBuilder;
const Editor                                 = require('../Editor').Editor;
const Clipboard                              = require('../Clipboard');
const ToolbarTop                             = require('./toolbar/ToolbarTop').ToolbarTop;
const ToolbarBottom                          = require('./toolbar/ToolbarBottom').ToolbarBottom;
const FormEditorState                        = require('./state/FormEditorState').FormEditorState;
const formEditorConstants                    = require('./formEditorConstants');
const FormComponent                          = require('./FormComponent').FormComponent;
const ContainerIdsForForm                    = require('./ContainerIdsForForm').ContainerIdsForForm;

exports.FormEditor = class extends Editor {
    constructor(opts) {
        super(opts);
        opts.containerIdsForForm  = new ContainerIdsForForm();
        this._containerIdsForForm = opts.containerIdsForForm;
        this._settings            = opts.settings;
        this._sourceBuilder       = new SourceBuilder({settings: opts.settings});
        this._formEditorState     = new FormEditorState(opts);
        this._formEditorState
            .on('ChangeForm',      this, this.onChangeForm)
            .on('ChangeEvent',     this, this.onChangeEvent)
            .on('AddForm',         this, this.onAddForm)
            .on('AddComponent',    this, this.onAddComponent)
            .on('AddUndo',         this, this.onAddUndo)
            .on('RenameForm',      this, this.onRenameForm)
            .on('RenameComponent', this, this.onRenameComponent)
            .on('DeleteComponent', this, this.onDeleteComponent)
            .on('ChangeForm',      this, this.updateElements)
            .on('AddForm',         this, this.updateElements)
            .on('AddComponent',    this, this.updateElements)
            .on('SelectComponent', this, this.updateElements)
            .on('Undo',            this, this.updateElements);
        this._events = [
            dispatcher.on('FormEditor.Select.Tool', this, this.onSelectFormEditorTool)
        ];
        this.initDom(opts.parentNode);
    }

    initDom(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('wrapper'),
                className: 'max-w resource-wrapper',
                children: [
                    {
                        type:       ToolbarTop,
                        ui:         this._ui,
                        formEditor: this
                    },
                    {
                        className: 'resource-content',
                        ref:       this.setRef('resourceContent')
                    },
                    {
                        type:       ToolbarBottom,
                        ui:         this._ui,
                        formEditor: this
                    }
                ]
            }
        );
        return this;
    }

    remove() {
        while (this._events.length) {
            this._events.pop()();
        }
        this._refs.grid.remove();
        this._formEditorState.remove();
        this._sourceBuilder.remove();
        super.remove();
    }

    show() {
        super.show();
        this.updateElements();
    }

    onAddForm() {
        this.create(
            this._refs.resourceContent,
            {
                ref:       this.setRef('resourceContentWrapper'),
                className: 'resource-content-wrapper',
                children: [
                    {
                        type:                FormComponent,
                        ref:                 this.setRef('grid'),
                        containerIdsForForm: this._containerIdsForForm,
                        settings:            this._settings,
                        ui:                  this._ui,
                        id:                  this.setFormComponent.bind(this),
                        formEditorState:     this._formEditorState,
                        containerId:         1,
                        form:                true,
                        design:              true,
                        className:           'resource with-shadow form grid' + this._settings.getFormGridSize(),
                        getDataProvider:     getDataProvider
                    }
                ]
            }
        );
        let formEditorState = this._formEditorState;
        let editor          = this.getEditor();
        if (editor && !formEditorState.getLoading()) {
            editor.setValue(this._sourceBuilder
                .setSource(editor.getValue())
                .updateComponents({components: formEditorState.getData()})
                .getSource()
            );
        }
    }

    onAddComponent(component) {
        this.updateSource();
    }

    onChangeForm() {
        this
            .setSize()
            .updateSource();
    }

    onChangeEvent() {
        this.updateSource();
    }

    onUndo() {
        this._formEditorState.undo();
        dispatcher.dispatch('Editor.Changed', this._editors.getDispatchInfo(this));
    }

    onAddUndo() {
        this.updateElements();
        dispatcher.dispatch('Editor.Changed', this._editors.getDispatchInfo(this));
    }

    onCopy() {
        if (this._formEditorState.copy()) {
            dispatcher.dispatch('Editor.Changed', this._editors.getDispatchInfo(this));
            this.updateElements();
        }
    }

    onPaste() {
        let formEditorState = this._formEditorState;
        let parentId        = formEditorState.getActiveComponentParentId();
        let owner           = null;
        if (parentId === null) {
            parentId = formEditorState.getFormId();
            owner    = this._formComponent;
        } else if (Array.isArray(parentId)) {
            let activeComponentId = formEditorState.getActiveComponentId();
            let element           = this._formComponent.getElementById(activeComponentId);
            if (element && (element instanceof TabPanel)) {
                parentId = parentId[element.getActive()];
                owner    = this._containerIdsForForm.getFormComponentContainerByContainerId(parentId);
            }
        } else {
            owner = this._containerIdsForForm.getFormComponentContainerByContainerId(parentId);
            // Todo: show active tab panel!
        }
        if (owner) {
            formEditorState.paste(parentId, owner);
        }
    }

    onDelete() {
        this._formEditorState.deleteActiveComponent();
    }

    onSelectTool(tool) {
        let formEditorState = this._formEditorState;
        formEditorState.setTool(tool);
    }

    onSelectFormEditorTool(opts) {
        let refs = this._refs;
        refs.toolType.onSelectTool(opts.toolGroup);
        refs[opts.toolType].onSelectTool(opts.toolIndex);
    }

    onRenameForm(opts) {
        let editor = this.getEditor();
        if (!editor) {
            return;
        }
        editor.setValue(this._sourceBuilder
            .setSource(editor.getValue())
            .updateFormNameAndRemoveDefines(opts)
            .updateEventNames(opts)
            .getSource()
        );
    }

    onRenameComponent(opts) {
        let editor = this.getEditor();
        if (!editor) {
            return;
        }
        opts.formName = this._formEditorState.getFormComponent().name;
        editor.setValue(this._sourceBuilder
            .setSource(editor.getValue())
            .updateComponentName(opts)
            .updateEventNames(opts)
            .getSource()
        );
    }

    onDeleteComponent(opts) {
        let editor = this.getEditor();
        if (!editor) {
            return;
        }
        opts.formName = this._formEditorState.getFormComponent().name;
        editor.setValue(this._sourceBuilder
            .setSource(editor.getValue())
            .deleteComponent(opts)
            .getSource()
        );
        this.updateElements();
    }

    onSelectComponentTypes(component) {
        const components = [
                formEditorConstants.COMPONENT_TYPES_INPUT,
                formEditorConstants.COMPONENT_TYPES_TEXT,
                formEditorConstants.COMPONENT_TYPES_PANEL,
                formEditorConstants.COMPONENT_TYPES_GRAPHICS,
                formEditorConstants.COMPONENT_TYPES_STATUS,
                formEditorConstants.COMPONENT_TYPES_IO,
                formEditorConstants.COMPONENT_TYPES_DIALOG,
                formEditorConstants.COMPONENT_TYPES_NON_VISUAL
            ];
        if (component in components) {
            let formEditorState = this._formEditorState;
            let refs            = this._refs;
            refs.inputTools.getElement().style.display     = (component === 0) ? 'block' : 'none';
            refs.textTools.getElement().style.display      = (component === 1) ? 'block' : 'none';
            refs.panelTools.getElement().style.display     = (component === 2) ? 'block' : 'none';
            refs.graphicsTools.getElement().style.display  = (component === 3) ? 'block' : 'none';
            refs.statusTools.getElement().style.display    = (component === 4) ? 'block' : 'none';
            refs.ioTools.getElement().style.display        = (component === 5) ? 'block' : 'none';
            refs.dialogTools.getElement().style.display    = (component === 6) ? 'block' : 'none';
            refs.nonVisualTools.getElement().style.display = (component === 7) ? 'block' : 'none';
            formEditorState.setComponentTypes(components[component]);
            dispatcher.dispatch('FormEditor.Select.ToolbarTool', formEditorState.getActiveComponentIndices());
        }
    }

    onSelectInputComponent(component) {
        const components = formEditorConstants.INPUT_COMPONENTS;
        if (component in components) {
            this._formEditorState.setInputComponent(components[component]);
            this.updateComponentPanel(0, component);
        }
    }

    onSelectTextComponent(component) {
        const components = formEditorConstants.TEXT_COMPONENTS;
        if (component in components) {
            this._formEditorState.setTextComponent(components[component]);
            this.updateComponentPanel(1, component);
        }
    }

    onSelectPanelComponent(component) {
        const components = formEditorConstants.PANEL_COMPONENTS;
        if (component in components) {
            this._formEditorState.setPanelComponent(components[component]);
            this.updateComponentPanel(2, component);
        }
    }

    onSelectGraphicsComponent(component) {
        const components = formEditorConstants.GRAPHICS_COMPONENTS;
        if (component in components) {
            this._formEditorState.setGraphicsComponent(components[component]);
            this.updateComponentPanel(3, component);
        }
    }

    onSelectStatusComponent(component) {
        const components = formEditorConstants.STATUS_COMPONENTS;
        if (component in components) {
            this._formEditorState.setStatusComponent(components[component]);
            this.updateComponentPanel(4, component);
        }
    }

    onSelectIOComponent(component) {
        const components = formEditorConstants.IO_DISPLAY_COMPONENTS;
        if (component in components) {
            this._formEditorState.setIOComponent(components[component]);
            this.updateComponentPanel(5, component);
        }
    }

    onSelectDialogComponent(component) {
        const components = formEditorConstants.DIALOG_COMPONENTS;
        if (component in components) {
            this._formEditorState.setDialogComponent(components[component]);
            this.updateComponentPanel(6, component);
        }
    }

    onSelectNonVisualComponent(component) {
        const components = formEditorConstants.NON_VISUAL_COMPONENTS;
        if (component in components) {
            this._formEditorState.setNonVisualComponent(components[component]);
            this.updateComponentPanel(7, component);
        }
    }

    onMouseMove(event) {
        this._refs.cursorPosition.innerHTML = event.offsetX + ',' + event.offsetY;
    }

    onMouseOut(event) {
        this._refs.cursorPosition.innerHTML = '';
    }

    onSelectGrid() {
        let refs = this._refs;
        dispatcher.dispatch(
            'Dialog.SelectGridSize.Show',
            this._settings.getFormGridSize(),
            function(formGridSize) {
                refs.grid.setClassName('resource with-shadow form grid' + formGridSize);
            }
        );
    }

    getCanUndo() {
        return this._formEditorState.getHasUndo();
    }

    getCanCopy() {
        return this._formEditorState.getCanCopy();
    }

    getCanPaste() {
        return this._formEditorState.getCanPaste();
    }

    setSize() {
        let formEditorState = this._formEditorState;
        let formComponent   = formEditorState.getFormComponent();
        let width           = Math.max(parseInt(formComponent.width  || '128', 10), 128);
        let height          = Math.max(parseInt(formComponent.height || '128', 10), 64);
        let element         = this._refs.resourceContentWrapper;
        element.style.width  = (width  + 64)  + 'px';
        element.style.height = (height + 64)  + 'px';
        this._formComponent.setSize(width, height);
        return this;
    }

    setFormComponent(component) {
        this._formComponent = component;
        let element = component.getFormElement();
        element.addEventListener('mousemove', this.onMouseMove.bind(this));
        element.addEventListener('mouseout',  this.onMouseOut.bind(this));
        return this.setSize();
    }

    getValue() {
        return this._formEditorState.getData(true);
    }

    getEditor() {
        let whlFilename  = path.replaceExtension(this._formEditorState.getFilename(), '.whl');
        let whlpFilename = path.replaceExtension(this._formEditorState.getFilename(), '.whlp');
        return this._editors.findEditor(this._formEditorState.getPath(), whlFilename) ||
            this._editors.findEditor(this._formEditorState.getPath(), whlpFilename);
    }

    clearSelection() {
        return this;
    }

    render() {
        return this;
    }

    updateComponentPanel(toolGroup, toolIndex) {
        dispatcher.dispatch(
            'FormEditor.Select.ToolbarTool',
            {
                toolGroup: toolGroup,
                toolIndex: toolIndex
            }
        );
    }

    updateSource() {
        let formEditorState = this._formEditorState;
        let editor          = this.getEditor();
        if (!editor || formEditorState.getLoading()) {
            return;
        }
        editor.setValue(this._sourceBuilder
            .setSource(editor.getValue())
            .updateComponents({components: formEditorState.getData()})
            .getSource()
        );
    }

    updateElements() {
        let refs            = this._refs;
        let formEditorState = this._formEditorState;
        refs.delete.setDisabled(
            (formEditorState.getActiveComponentId() === null) ||
            (formEditorState.getActiveComponentType() === 'form')
        );
        refs.undo.setDisabled(!formEditorState.getHasUndo());
        refs.copy.setDisabled(!this.getCanCopy());
        refs.paste.setDisabled(!this.getCanPaste());
        dispatcher.dispatch('Editor.Changed', this._editors.getDispatchInfo(this));
        return this;
    }

    saveAs(filename) {
        super.saveAs(filename);
        this._formEditorState.setPath(path.getPathAndFilename(filename).path);
        dispatcher.dispatch('Editor.Changed.Filename', filename);
    }
};
