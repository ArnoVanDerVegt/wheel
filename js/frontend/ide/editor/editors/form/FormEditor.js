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

exports.FormEditor = class extends Editor {
    constructor(opts) {
        super(opts);
        this._formEditorState = new FormEditorState(opts);
        this
            .initDOM(opts.parentNode)
            .initDispatcher();
    }

    initDispatcher() {
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
                                        id:              this.setFormElement.bind(this),
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
    }

    onMouseMove(event) {
        this.onCancelEvent(event);
    }

    onMouseOut(event) {
        this.onCancelEvent(event);
    }

    onMouseDown(event) {
        this.onCancelEvent(event);
    }

    onMouseUp(event) {
        this.onCancelEvent(event);
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
        let elements = [
                {element: this._refs.resourceContentWrapper, margin: 64},
                {element: this._formElement,                 margin:  0}
            ];
        let formEditorState = this._formEditorState;
        let width           = formEditorState.getWidth();
        let height          = formEditorState.getHeight();
        elements.forEach(function(e) {
            let element = e.element;
            element.style.width  = (width  + e.margin)  + 'px';
            element.style.height = (height + e.margin)  + 'px';
        });
        return this;
    }

    setFormElement(element) {
        this._formElement = element;
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

    updateAfterResize() {
        return this;
    }

    updateElements() {
        return this;
    }

    addUndo(undo) {
        return this;
    }
};
