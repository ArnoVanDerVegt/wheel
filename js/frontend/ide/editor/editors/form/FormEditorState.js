/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher              = require('../../../../lib/dispatcher').dispatcher;
const Emitter                 = require('../../../../lib/Emitter').Emitter;

const COMPONENT_BUTTON        = 0;
const COMPONENT_SELECT_BUTTON = 1;
const COMPONENT_LABEL         = 2;
const COMPONENT_CHECKBOX      = 3;
const COMPONENT_TABS          = 4;

exports.FormEditorState = class extends Emitter {
    constructor(opts) {
        super(opts);
        this._data           = opts.data || [];
        this._width          = opts.width;
        this._height         = opts.height;
        this._undoStack      = [];
        this._component      = COMPONENT_BUTTON;
        this._componentsById = {};
        this._nextId         = 0;
        dispatcher.on('Properties.Property.Change', this, this.onChangeProperty);
    }

    peekId() {
        return this._nextId + 1;
    }

    getNextId() {
        this._nextId++;
        return this._nextId;
    }

    setComponent(component) {
        this._component = component;
    }

    getUndoStackLength() {
        return this._undoStack.length;
    }

    getWidth() {
        return this._width;
    }

    getHeight() {
        return this._height;
    }

    getMouseDown() {
        return this._mouseDown;
    }

    setMouseDown(mouseDown) {
        this._mouseDown = mouseDown;
    }

    getComponentById(id) {
        return this._componentsById[id];
    }

    undoStackPop() {
        return this._undoStack.pop();
    }

    undoStackPush(item) {
        this._undoStack.push(item);
    }

    addComponent(opts) {
        let component = {
                tabIndex: 0,
                id:       this.getNextId(),
                x:        opts.x,
                y:        opts.y,
                owner:    opts.owner,
                parentId: opts.parentId
            };
        this._componentsById[component.id] = component;
        switch (this._component) {
            case COMPONENT_BUTTON:
                component.name    = 'Button' + component.id;
                component.value   = 'Button' + component.id;
                component.title   = 'Button' + component.id;
                component.color   = 'green';
                this.emit('AddButton', component);
                break;
            case COMPONENT_SELECT_BUTTON:
                component.name    = 'SelectButton' + component.id;
                component.options = ['A', 'B'];
                component.color   = 'green';
                this.emit('AddSelectButton', component);
                break;
            case COMPONENT_LABEL:
                component.name    = 'Label' + component.id;
                component.text    = 'Label' + component.id;
                this.emit('AddLabel', component);
                break;
            case COMPONENT_CHECKBOX:
                component.name    = 'Checkbox' + component.id;
                component.text    = 'Checkbox' + component.id;
                component.checked = false;
                this.emit('AddCheckbox', component);
                break;
            case COMPONENT_TABS:
                component.name    = 'Tabs' + component.id;
                component.tabs    = ['A', 'B'];
                component.width   = 200;
                component.height  = 128;
                this.emit('AddTabs', component);
                break;
        }
    }

    onChangeProperty(id, property, value) {
        let component = this._componentsById[id];
        if (!component) {
            return;
        }
        component[property] = value;
    }
};
