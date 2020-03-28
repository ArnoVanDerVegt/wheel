/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher      = require('../../../../lib/dispatcher').dispatcher;
const path            = require('../../../../lib/path');
const Button          = require('../../../../lib/components/Button').Button;
const Editor          = require('../Editor').Editor;
const Clipboard       = require('../Clipboard');
const ToolbarTop      = require('./toolbar/ToolbarTop').ToolbarTop;
const FormEditorState = require('./FormEditorState').FormEditorState;

exports.FormEditor = class extends Editor {
    constructor(opts) {
        super(opts);
        this._formEditorState = new FormEditorState(opts);
        this._elementById     = {};
        this
            .initFormEditor()
            .initDOM(opts.parentNode);
        dispatcher.on('Properties.Property.Change', this, this.onChangeProperty);
    }

    initFormEditor() {
        this._formEditorState.on('AddButton', this, this.onAddButton);
        return this;
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

    onClickForm(event) {
        this.onCancelEvent(event);
        this._formEditorState.addComponent({x: event.offsetX, y: event.offsetY});
    }

    onSelectComponent(component) {
        this._formEditorState.setComponent(component);
    }

    onChangeProperty(componentType, id, property, value) {
        let element = this._elementById[id];
        if (!element) {
            return;
        }
        let opts = {};
        opts[property] = value;
        element.onEvent(opts);
    }

    onAddButton(opts) {
        let properties = [
                {type: 'id',         name: null,         value: opts.id},
                {type: 'string',     name: 'name',       value: opts.name},
                {type: 'integer',    name: 'tabIndex',   value: opts.id},
                {type: 'integer',    name: 'x',          value: opts.x},
                {type: 'integer',    name: 'y',          value: opts.y},
                {type: 'colorStyle', name: 'colorStyle', value: opts.colorStyle},
                {type: 'string',     name: 'value',      value: opts.value},
                {type: 'string',     name: 'title',      value: opts.title}
            ];
        this._elementById[opts.id] = new Button({
            parentNode: this._formElement,
            ui:         this._ui,
            style: {
                position: 'absolute',
                left:     opts.x + 'px',
                top:      opts.y + 'px'
            },
            value: opts.title,
            onClick: function(event) {
                event.stopPropagation();
                dispatcher.dispatch('Properties.Select', 'button', properties);
            }
        });
        dispatcher.dispatch('Properties.Select', 'button', properties);
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
        element.addEventListener('click', this.onClickForm.bind(this));
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
