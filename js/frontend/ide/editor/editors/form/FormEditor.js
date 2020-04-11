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
            this._refs.wrapper,
            {
                className: 'resource-content',
                children: [
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
                ]
            }
        );
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
            this._formEditorState.paste(parentId, owner);
        }
    }

    onDelete() {
        this._formEditorState.deleteActiveComponent();
    }

    onSelectTool(tool) {
        this._formEditorState.setTool(tool);
    }

    onSelectComponent(component) {
        const components = [
                formEditorConstants.COMPONENT_TYPE_BUTTON,
                formEditorConstants.COMPONENT_TYPE_SELECT_BUTTON,
                formEditorConstants.COMPONENT_TYPE_LABEL,
                formEditorConstants.COMPONENT_TYPE_CHECKBOX,
                formEditorConstants.COMPONENT_TYPE_TABS
            ];
        if (component in components) {
            this._formEditorState.setComponent(components[component]);
        }
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
        this.setSize();
    }

    getValue() {
        return this._formEditorState.getData();
    }

    clearSelection() {
        return this;
    }

    render() {
        return this;
    }

    updateSource() {
        let formEditorState = this._formEditorState;
        if (formEditorState.getLoading()) {
            return;
        }
        let filename = path.replaceExtension(formEditorState.getFilename(), '.whl');
        let editor   = this._editors.findEditor(formEditorState.getPath(), filename);
        if (!editor) {
            return;
        }
        editor.setValue(this._sourceBuilder.addComponent({
            source:    editor.getValue(),
            data:      this._formEditorState.getData()
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
