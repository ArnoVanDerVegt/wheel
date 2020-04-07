/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher          = require('../../../../lib/dispatcher').dispatcher;
const Emitter             = require('../../../../lib/Emitter').Emitter;
const formEditorConstants = require('./formEditorConstants');
const ComponentBuilder    = require('./ComponentBuilder').ComponentBuilder;
const UndoStack           = require('./UndoStack').UndoStack;

let nextId = 0;

exports.FormEditorState = class extends Emitter {
    constructor(opts) {
        super(opts);
        this._clipboard          = null;
        this._getOwnerByParentId = opts.getOwnerByParentId;
        this._formId             = this.peekId();
        this._undoStack          = new UndoStack({formEditorState: this});
        this._componentBuilder   = new ComponentBuilder({formEditorState: this});
        this._component          = formEditorConstants.COMPONENT_TYPE_BUTTON;
        this._componentsById     = {};
        this._activeComponentId  = null;
        this._dispatch           = [
            dispatcher.on('Properties.Property.Change', this, this.onChangeProperty),
            dispatcher.on('Properties.Select',          this, this.onSelectProperties),
            dispatcher.on('Properties.SelectComponent', this, this.onSelectComponent)
        ];
        setTimeout(this.initForm.bind(this, opts), 50);
    }

    remove() {
        while (this._dispatch.length) {
            this._dispatch.pop()();
        }
    }

    initForm(opts) {
        let component;
        if (opts.data) {
            let form = opts.data[0];
            component = this._componentBuilder.addFormComponent({
                type:   'form',
                name:   form.name,
                title:  form.title,
                width:  form.width,
                height: form.height
            });
        } else {
            component = this._componentBuilder.addFormComponent({
                type:   'form',
                name:   opts.filename,
                title:  opts.filename,
                width:  opts.width,
                height: opts.height
            });
        }
        component.id = this._formId;
        this._componentsById[this._formId] = component;
        this
            .emit('AddForm', Object.assign({}, component))
            .updateComponents(component.id)
            .onSelectComponent(component.id);
        if (opts.data) {
            let data = opts.data;
            let ids  = {};
            ids[1] = this._formId;
            for (let i = 1; i < data.length; i++) {
                let component = data[i];
                ids[component.id]  = nextId;
                component.parentId = ids[component.parentId];
                component.owner    = this._getOwnerByParentId(component.parentId);
                if ('containerId' in component) {
                    let containerId = component.containerId;
                    for (let j = 0; j < containerId.length; j++) {
                        ids[containerId[j]] = nextId + j + 2;
                        containerId[j]      = nextId + j + 2;
                    }
                }
                this.addComponent(component);
            }
        }
        this._undoStack.setEnabled(true);
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
        return this._undoStack.getLength();
    }

    getFormComponent() {
        return this._componentsById[this._formId];
    }

    setComponentPositionById(id, position) {
        let component = this._componentsById[id] || {};
        this._undoStack.undoStackPush({
            action:   formEditorConstants.ACTION_CHANGE_POSITION,
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

    getActiveComponentParentId() {
        let activeComponent = this.getActiveComponent();
        if (activeComponent.type === formEditorConstants.COMPONENT_TYPE_TABS) {
            return activeComponent.containerId;
        }
        if (!activeComponent ||
            (activeComponent.type === formEditorConstants.COMPONENT_TYPE_FORM) ||
            (activeComponent.parentId === this._formId)) {
            return null;
        }
        return activeComponent.parentId;
    }

    getActiveComponent() {
        return this._componentsById[this._activeComponentId] || null;
    }

    getActiveComponentType() {
        let activeComponent = this.getActiveComponent();
        return activeComponent ? activeComponent.type : null;
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

    getCanCopy() {
        switch (this.getActiveComponentType()) {
            case formEditorConstants.COMPONENT_TYPE_BUTTON:        return true;
            case formEditorConstants.COMPONENT_TYPE_SELECT_BUTTON: return true;
            case formEditorConstants.COMPONENT_TYPE_LABEL:         return true;
            case formEditorConstants.COMPONENT_TYPE_CHECKBOX:      return true;
        }
        return false;
    }

    getCanPaste() {
        return !!this._clipboard;
    }

    getHasUndo() {
        return this._undoStack.getLength();
    }

    getData() {
        /* eslint-disable no-invalid-this */
        let toString       = function() { return ('00000000' + this.id).substr(-8); };
        let result         = [];
        let componentsById = this._componentsById;
        let ids            = {};
        let nextId         = 0;
        let getId = function(id) {
                if (id in ids) {
                    return ids[id];
                }
                nextId++;
                ids[id] = nextId;
                return nextId;
            };
        for (let id in componentsById) {
            let component = Object.assign({}, componentsById[id]);
            delete component.owner;
            delete component.properties;
            delete component.events;
            component.id = getId(id);
            if ('containerId' in component) {
                let containerId = component.containerId;
                for (let i = 0; i < containerId.length; i++) {
                    containerId[i] = getId(containerId[i]);
                }
            }
            if (component.type === 'form') {
                delete(component.parentId);
            } else {
                component.parentId = getId(component.parentId);
            }
            component.toString = toString;
            result.push(component);
        }
        result.sort();
        return result;
    }

    undo() {
        this._undoStack.undo();
    }

    findComponentText(type, property, prefix) {
        let componentsById = this._componentsById;
        let count          = 1;
        let found          = true;
        let result;
        while (found) {
            found  = false;
            result = prefix + count;
            for (let id in componentsById) {
                let component = componentsById[id];
                if ((component.type === type) && (component[property] === result)) {
                    found = true;
                    count++;
                    break;
                }
            }
        }
        return result;
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
        this._componentBuilder.addComponentForType(component, opts.type || this._component);
        this._activeComponentId = component.id;
        this._undoStack.undoStackPush({action: formEditorConstants.ACTION_ADD_COMPONENT, id: component.id});
        this
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
            this._undoStack.undoStackPush({action: formEditorConstants.ACTION_DELETE_COMPONENT, component: component});
        }
        this.emit('DeleteComponent', id);
        dispatcher.dispatch('Properties.ComponentList', {value: null, items: this.getItems()});
    }

    copy() {
        if (!this.getCanCopy()) {
            return false;
        }
        let component = this.getActiveComponent();
        if (component) {
            this._clipboard = Object.assign({}, component);
            delete this._clipboard.owner;
            return true;
        }
        return false;
    }

    paste(parentId, owner) {
        let clipboard = this._clipboard;
        if (!clipboard) {
            return;
        }
        clipboard.owner    = owner;
        clipboard.parentId = parentId;
        clipboard.x += 32;
        clipboard.y += 32;
        this.addComponent(clipboard);
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

    changeTabs(component, value) {
        let componentsById       = this._componentsById;
        let findNestedComponents = (function(children, parentId) {
                for (let id in componentsById) {
                    let component = componentsById[id];
                    if (component.parentId === parentId) {
                        let containerId = component.containerId || [];
                        for (let i = 0; i < containerId.length; i++) {
                            findNestedComponents(children, containerId[i]);
                        }
                        let child = Object.assign({}, component);
                        delete child.owner;
                        delete componentsById[id];
                        children.push(child);
                        this.emit('DeleteComponent', id);
                    }
                }
            }).bind(this);
        if (value.length > component.tabs.length) {
            component.containerId.push(nextId + 1);
            this._undoStack.undoStackPush({
                action: formEditorConstants.ACTION_TAB_ADD_TAB,
                id:     component.id
            });
        } else if (value.length < component.tabs.length) {
            let parentId = component.containerId.pop();
            let children = [];
            findNestedComponents(children, parentId);
            this._undoStack.undoStackPush({
                action:   formEditorConstants.ACTION_TAB_DELETE_TAB,
                id:       component.id,
                tab:      component.tabs[component.tabs.length - 1],
                children: children.reverse()
            });
        }
    }

    onChangeProperty(id, property, value) {
        let component = this._componentsById[id];
        if (!component) {
            return;
        }
        if ((component.type === 'tabs') && (property === 'tabs')) {
            // Todo: add undo...
            this.changeTabs(component, value);
        } else {
            this._undoStack.undoStackPush({
                action:   formEditorConstants.ACTION_CHANGE_PROPERTY,
                id:       id,
                property: property,
                value:    component[property]
            });
        }
        component[property] = value;
        if (component.type) {
            this.emit('ChangeForm');
        }
    }

    onSelectProperties(properties) {
        this.selectComponentById(properties.id);
    }

    onSelectComponent(id) {
        let component = this.selectComponentById(id);
        if (component) {
            let properties = [].concat(formEditorConstants.PROPERTIES_BY_TYPE[component.type.toUpperCase()]);
            let events     = [].concat(formEditorConstants.EVENTS_BY_TYPE[component.type.toUpperCase()]);
            properties.id = id;
            events.id     = id;
            dispatcher.dispatch('Properties.Select', properties, events, this);
        }
        return this;
    }

    updateComponents(id) {
        dispatcher.dispatch('Properties.ComponentList', {value: id, items: this.getItems()});
        return this;
    }
};
