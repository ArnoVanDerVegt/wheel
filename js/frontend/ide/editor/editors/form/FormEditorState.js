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

const ACTION_ADD_COMPONENT    = 0;
const ACTION_DELETE_COMPONENT = 1;
const ACTION_CHANGE_POSITION  = 2;
const ACTION_CHANGE_PROPERTY  = 3;

const PROPERTIES_BY_TYPE      = {
        BUTTON: [
            {type: 'type',        name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'string',      name: 'name'},
            {type: 'integer',     name: 'tabIndex'},
            {type: 'boolean',     name: 'hidden'},
            {type: 'boolean',     name: 'disabled'},
            {type: 'integer',     name: 'x'},
            {type: 'integer',     name: 'y'},
            {type: 'color',       name: 'color'},
            {type: 'string',      name: 'value'},
            {type: 'string',      name: 'title'}
        ],
        SELECT_BUTTON: [
            {type: 'type',        name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'string',      name: 'name'},
            {type: 'integer',     name: 'tabIndex'},
            {type: 'boolean',     name: 'hidden'},
            {type: 'boolean',     name: 'disabled'},
            {type: 'integer',     name: 'x'},
            {type: 'integer',     name: 'y'},
            {type: 'color',       name: 'color'},
            {type: 'stringList',  name: 'options'}
        ],
        LABEL: [
            {type: 'type',        name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'string',      name: 'name'},
            {type: 'integer',     name: 'tabIndex'},
            {type: 'boolean',     name: 'hidden'},
            {type: 'integer',     name: 'x'},
            {type: 'integer',     name: 'y'},
            {type: 'string',      name: 'text'}
        ],
        CHECKBOX: [
            {type: 'type',        name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'string',      name: 'name'},
            {type: 'integer',     name: 'tabIndex'},
            {type: 'boolean',     name: 'hidden'},
            {type: 'boolean',     name: 'disabled'},
            {type: 'integer',     name: 'x'},
            {type: 'integer',     name: 'y'},
            {type: 'string',      name: 'text'},
            {type: 'boolean',     name: 'checked'}
        ],
        TABS: [
            {type: 'type',        name: null},
            {type: 'id',          name: null},
            {type: 'parentId',    name: null},
            {type: 'containerId', name: null},
            {type: 'string',      name: 'name'},
            {type: 'integer',     name: 'tabIndex'},
            {type: 'boolean',     name: 'hidden'},
            {type: 'integer',     name: 'x'},
            {type: 'integer',     name: 'y'},
            {type: 'integer',     name: 'width'},
            {type: 'integer',     name: 'height'},
            {type: 'stringList',  name: 'tabs'}
        ]
    };

let nextId = 0;

exports.FormEditorState = class extends Emitter {
    constructor(opts) {
        super(opts);
        this._getOwnerByParentId = opts.getOwnerByParentId;
        this._data               = opts.data || [];
        this._width              = opts.width;
        this._height             = opts.height;
        this._undoStack          = [];
        this._component          = COMPONENT_BUTTON;
        this._componentsById     = {};
        this._activeComponentId  = null;
        dispatcher
            .on('Properties.Property.Change', this, this.onChangeProperty)
            .on('Properties.Select',          this, this.onSelectProperties)
            .on('Properties.SelectComponent', this, this.onSelectComponent);
    }

    peekId() {
        return nextId + 1;
    }

    getNextId() {
        nextId++;
        return nextId;
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

    setComponentPositionById(id, position) {
        let component = this._componentsById[id] || {};
        this.undoStackPush({
            action:   ACTION_CHANGE_POSITION,
            id:       id,
            position: {x: component.x, y: component.y}
        });
        component.x = position.x;
        component.y = position.y;
    }

    getComponentById(id) {
        return this._componentsById[id];
    }

    getActiveComponentId() {
        return this._activeComponentId;
    }

    getItems() {
        let componentsById = this._componentsById;
        let items          = [];
        for (let id in componentsById) {
            let component = componentsById[id];
            items.push({
                value: component.id,
                title: component.name + ' <i>' + component.type + '</i>'
            });
        }
        return items;
    }

    getHasUndo() {
        return this._undoStack.length;
    }

    undoStackPop() {
        return this._undoStack.pop();
    }

    undoStackPush(item) {
        let undoStack = this._undoStack;
        let lastItem  = undoStack.length ? undoStack[undoStack.length - 1] : null;
        if (lastItem) {
            switch (lastItem.action) {
                case ACTION_CHANGE_POSITION:
                    if (lastItem.id === item.id) {
                        return this;
                    }
                    break;
                case ACTION_CHANGE_PROPERTY:
                    if ((lastItem.id === item.id) && (lastItem.property === item.property)) {
                        return this;
                    }
                    break;
            }
        }
        this._undoStack.push(item);
        return this;
    }

    undo() {
        let item = this.undoStackPop();
        let component;
        switch (item.action) {
            case ACTION_ADD_COMPONENT:
                this.deleteComponentById(item.id, false);
                break;
            case ACTION_DELETE_COMPONENT:
                component                          = item.component;
                component.owner                    = this._getOwnerByParentId(component.parentId);
                this._componentsById[component.id] = component;
                this._activeComponentId            = component.id;
                switch (component.type) {
                    case 'button':       this.addButtonComponent(component); break;
                    case 'selectButton': this.addSelectButton   (component); break;
                    case 'label':        this.addLabel          (component); break;
                    case 'checkbox':     this.addCheckBox       (component); break;
                    case 'tabs':         this.addTabs           (component); break;
                }
                this
                    .emit('AddComponent', Object.assign({}, component))
                    .updateComponents(component.id);
                break;
            case ACTION_CHANGE_POSITION:
                component   = this._componentsById[item.id];
                component.x = item.position.x;
                component.y = item.position.y;
                this.onSelectComponent(item.id);
                this.emit('ChangePosition', item.id, item.position);
                break;
        }
        this.emit('Undo');
    }

    addButtonComponent(component) {
        component.type       = 'button';
        component.name       = 'Button' + component.id;
        component.value      = 'Button' + component.id;
        component.title      = 'Button' + component.id;
        component.color      = 'green';
        component.properties = [].concat(PROPERTIES_BY_TYPE.BUTTON);
    }

    addSelectButton(component) {
        component.type       = 'selectButton';
        component.name       = 'SelectButton' + component.id;
        component.options    = ['A', 'B'];
        component.color      = 'green';
        component.properties = [].concat(PROPERTIES_BY_TYPE.SELECT_BUTTON);
    }

    addLabel(component) {
        component.type       = 'label';
        component.name       = 'Label' + component.id;
        component.text       = 'Label' + component.id;
        component.properties = [].concat(PROPERTIES_BY_TYPE.LABEL);
    }

    addCheckBox(component) {
        component.type       = 'checkbox';
        component.name       = 'Checkbox' + component.id;
        component.text       = 'Checkbox' + component.id;
        component.checked    = false;
        component.properties = [].concat(PROPERTIES_BY_TYPE.CHECKBOX);
    }

    addTabs(component) {
        component.type        = 'tabs';
        component.name        = 'Tabs' + component.id;
        component.tabs        = ['A', 'B'];
        component.width       = 200;
        component.height      = 128;
        component.containerId = [this.peekId(), this.peekId() + 1];
        component.properties  = [].concat(PROPERTIES_BY_TYPE.TABS);
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
            case COMPONENT_BUTTON:        this.addButtonComponent(component); break;
            case COMPONENT_SELECT_BUTTON: this.addSelectButton   (component); break;
            case COMPONENT_LABEL:         this.addLabel          (component); break;
            case COMPONENT_CHECKBOX:      this.addCheckBox       (component); break;
            case COMPONENT_TABS:          this.addTabs           (component); break;
        }
        this._activeComponentId = component.id;
        this
            .undoStackPush({action: ACTION_ADD_COMPONENT, id: component.id})
            .emit('AddComponent', Object.assign({}, component))
            .updateComponents(component.id);
    }

    deleteActiveComponent() {
        this.deleteComponentById(this._activeComponentId, true);
    }

    deleteComponentById(id, saveUndo) {
        let componentsById = this._componentsById;
        if ((id === null) || !componentsById[id]) {
            return;
        }
        let component = Object.assign({}, componentsById[id]);
        component.parentId = component.owner.getParentId();
        delete component.owner;
        delete componentsById[id];
        this._activeComponentId = null;
        if (saveUndo) {
            this.undoStackPush({action: ACTION_DELETE_COMPONENT, component: component});
        }
        this.emit('DeleteComponent', id);
        dispatcher.dispatch('Properties.ComponentList', {value: null, items: this.getItems()});
    }

    selectComponentById(id) {
        let component = this._componentsById[id];
        if (component) {
            this._activeComponentId = id;
            this.emit('SelectComponent', id);
            return component;
        }
        return false;
    }

    onChangeProperty(id, property, value) {
        let component = this._componentsById[id];
        if (!component) {
            return;
        }
        component[property] = value;
    }

    onSelectProperties(properties) {
        this.selectComponentById(properties.id);
    }

    onSelectComponent(id) {
        let component = this.selectComponentById(id);
        if (component) {
            let properties = [].concat(PROPERTIES_BY_TYPE[component.type.toUpperCase()]);
            properties.id = id;
            dispatcher.dispatch('Properties.Select', properties, this);
        }
    }

    updateComponents(id) {
        dispatcher.dispatch('Properties.ComponentList', {value: id, items: this.getItems()});
    }
};
