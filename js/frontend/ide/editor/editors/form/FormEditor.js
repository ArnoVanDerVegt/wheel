/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher      = require('../../../../lib/dispatcher').dispatcher;
const path            = require('../../../../lib/path');
const Editor          = require('../Editor').Editor;
const Clipboard       = require('../Clipboard');
const ToolbarTop      = require('./toolbar/ToolbarTop').ToolbarTop;
const FormEditorState = require('./FormEditorState').FormEditorState;
const FormComponent   = require('./FormComponent').FormComponent;

exports.FormEditor = class extends Editor {
    constructor(opts) {
        super(opts);
        this._formEditorState = new FormEditorState(opts);
        this._formEditorState
            .on('AddComponent',    this, this.updateElements)
            .on('DeleteComponent', this, this.updateElements)
            .on('SelectComponent', this, this.updateElements);
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
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
                ]
            }
        );
        return this;
    }

    remove() {
        while (this._dispatch.length) {
            this._dispatch.pop()();
        }
        super.remove();
    }

    show() {
        super.show();
        this.updateElements();
    }

    onUndo() {
    }

    onCopy() {
    }

    onPaste() {
    }

    onDelete() {
        this._formEditorState.deleteActiveComponent();
    }

    onSelectTool(tool) {
        this._formEditorState.setTool(tool);
    }

    onSelectComponent(component) {
        this._formEditorState.setComponent(component);
    }

    getCanUndo() {
        return false;
    }

    getCanCopy() {
        return false;
    }

    getCanPaste() {
        return false;
    }

    setSize() {
        let formEditorState = this._formEditorState;
        let width           = formEditorState.getWidth();
        let height          = formEditorState.getHeight();
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
        return null;
    }

    clearSelection() {
        return this;
    }

    render() {
        return this;
    }

    updateElements() {
        let refs            = this._refs;
        let formEditorState = this._formEditorState;
        refs.delete.setDisabled(formEditorState.getActiveComponentId() === null);
        return this;
    }

    addUndo(undo) {
        return this;
    }
};
