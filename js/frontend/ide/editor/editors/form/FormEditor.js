/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher                          = require('../../../../lib/dispatcher').dispatcher;
const path                                = require('../../../../lib/path');
const TabPanel                            = require('../../../../lib/components/TabPanel').TabPanel;
const Editor                              = require('../Editor').Editor;
const Clipboard                           = require('../Clipboard');
const ToolbarTop                          = require('./toolbar/ToolbarTop').ToolbarTop;
const ToolbarBottom                       = require('./toolbar/ToolbarBottom').ToolbarBottom;
const FormEditorState                     = require('./state/FormEditorState').FormEditorState;
const formEditorConstants                 = require('./formEditorConstants');
const FormComponent                       = require('./FormComponent').FormComponent;
const getFormComponentContainerByParentId = require('./FormComponentContainer').getFormComponentContainerByParentId;
const SourceBuilder                       = require('./SourceBuilder').SourceBuilder;

exports.FormEditor = class extends Editor {
    constructor(opts) {
        super(opts);
        opts.getOwnerByParentId = getFormComponentContainerByParentId;
        this._settings        = opts.settings;
        this._sourceBuilder   = new SourceBuilder({settings: opts.settings});
        this._formEditorState = new FormEditorState(opts);
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
        this.initDom(opts.parentNode);
    }

    initDom(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('wrapper'),
                className: 'resource-wrapper',
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
        this._formEditorState.remove();
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
                        ref:             this.setRef('grid'),
                        type:            FormComponent,
                        ui:              this._ui,
                        id:              this.setFormComponent.bind(this),
                        formEditorState: this._formEditorState,
                        design:          true,
                        className:       'resource with-shadow form grid' + this._settings.getFormGridSize()
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
                owner    = getFormComponentContainerByParentId(parentId);
            }
        } else {
            owner = getFormComponentContainerByParentId(parentId);
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
        this._formEditorState.setTool(tool);
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
                formEditorConstants.COMPONENT_TYPES_STANDARD,
                formEditorConstants.COMPONENT_TYPES_GRAPHICS
            ];
        if (component in components) {
            let refs = this._refs;
            refs.standardTools.getElement().style.display = (component === 0) ? 'block' : 'none';
            refs.graphicsTools.getElement().style.display = (component === 1) ? 'block' : 'none';
            this._formEditorState.setComponentTypes(components[component]);
        }
    }

    onSelectStandardComponent(component) {
        const components = [
                formEditorConstants.COMPONENT_TYPE_BUTTON,
                formEditorConstants.COMPONENT_TYPE_SELECT_BUTTON,
                formEditorConstants.COMPONENT_TYPE_LABEL,
                formEditorConstants.COMPONENT_TYPE_CHECKBOX,
                formEditorConstants.COMPONENT_TYPE_STATUS_LIGHT,
                formEditorConstants.COMPONENT_TYPE_PANEL,
                formEditorConstants.COMPONENT_TYPE_TABS
            ];
        if (component in components) {
            this._formEditorState.setStandardComponent(components[component]);
        }
    }

    onSelectGraphicsComponent(component) {
        const components = [
                formEditorConstants.COMPONENT_TYPE_RECTANGLE,
                formEditorConstants.COMPONENT_TYPE_CIRCLE,
                formEditorConstants.COMPONENT_TYPE_IMAGE
            ];
        if (component in components) {
            this._formEditorState.setGraphicsComponent(components[component]);
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
};
