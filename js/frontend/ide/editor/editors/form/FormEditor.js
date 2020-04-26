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
        this._sourceBuilder   = new SourceBuilder({});
        this._formEditorState = new FormEditorState(opts);
        this._formEditorState
            .on('ChangeForm',      this, this.onChangeForm)
            .on('ChangeEvent',     this, this.onChangeEvent)
            .on('AddForm',         this, this.onAddForm)
            .on('AddComponent',    this, this.onAddComponent)
            .on('AddUndo',         this, this.onAddUndo)
            .on('RenameForm',      this, this.onRenameForm)
            .on('RenameEvents',    this, this.onRenameEvents)
            .on('ChangeForm',      this, this.updateElements)
            .on('AddForm',         this, this.updateElements)
            .on('AddComponent',    this, this.updateElements)
            .on('DeleteComponent', this, this.updateElements)
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
                        type:            FormComponent,
                        ui:              this._ui,
                        id:              this.setFormComponent.bind(this),
                        formEditorState: this._formEditorState,
                        className:       'resource with-shadow form'
                    }
                ]
            }
        );
        let formEditorState = this._formEditorState;
        let editor          = this.getEditor();
        if (editor && !formEditorState.getLoading()) {
            editor.setValue(this._sourceBuilder.addComponent({
                source:    editor.getValue(),
                data:      formEditorState.getData()
            }));
        }
    }

    onAddComponent(component) {
        this.updateSource();
    }

    onChangeForm() {
        this.setSize();
        this.updateSource();
    }

    onChangeEvent() {
        this.updateSource();
    }

    onUndo() {
        this._formEditorState.undo();
        dispatcher.dispatch('Editor.Changed', this._editors.getDispatchInfo(this));
    }

    onAddUndo() {
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

    onRenameForm(oldName, newName) {
        let editor = this.getEditor();
        if (!editor) {
            return;
        }
        editor.setValue(this._sourceBuilder.updateFormName({
            source:  editor.getValue(),
            oldName: oldName,
            newName: newName
        }));
    }

    onRenameEvents(renameEvents) {
        let editor = this.getEditor();
        if (!editor) {
            return;
        }
        editor.setValue(this._sourceBuilder.updateEventNames({
            source:       editor.getValue(),
            renameEvents: renameEvents
        }));
    }

    onSelectComponent(component) {
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
            this._formEditorState.setComponent(components[component]);
        }
    }

    onMouseMove(event) {
        this._refs.cursorPosition.innerHTML = event.offsetX + ',' + event.offsetY;
    }

    onMouseOut(event) {
        this._refs.cursorPosition.innerHTML = '';
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
        let height          = Math.max(parseInt(formComponent.height || '128', 10), 128);
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
        this.setSize();
    }

    getValue() {
        return this._formEditorState.getData();
    }

    getEditor() {
        let filename = path.replaceExtension(this._formEditorState.getFilename(), '.whl');
        let editor   = this._editors.findEditor(this._formEditorState.getPath(), filename);
        return editor;
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
        editor.setValue(this._sourceBuilder.addComponent({
            source:    editor.getValue(),
            data:      formEditorState.getData()
        }));
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
