/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher              = require('../../../../lib/dispatcher').dispatcher;
const Emitter                 = require('../../../../lib/Emitter').Emitter;

const COMPONENT_BUTTON        = 0;
const COMPONENT_SELECT_BUTTON = 1;
const COMPONENT_LABEL         = 2;
const COMPENENT_CHECKBOX      = 3;
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
                id: this.getNextId(),
                x:  opts.x,
                y:  opts.y
            };
        this._componentsById[component.id] = component;
        switch (this._component) {
            case COMPONENT_BUTTON:
                component.name       = 'Button' + component.id;
                component.value      = 'Button' + component.id;
                component.title      = 'Button' + component.id;
                component.colorStyle = 'green';
                this.emit('AddButton', component);
                break;
            case COMPONENT_SELECT_BUTTON:
                component.name       = 'SelectButton' + component.id;
                component.options    = ['A', 'B'];
                component.colorStyle = 'green';
                this.emit('AddSelectButton', component);
                break;
        }
    }

    onChangeProperty(componentType, id, property, value) {
        let component = this._componentsById[id];
        if (!component) {
            return;
        }
        component[property] = value;
    }
};
