/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const formEditorConstants = require('../formEditorConstants');

exports.ComponentList = class {
    constructor(opts) {
        this._formEditorState   = opts.formEditorState;
        this._componentsById    = {};
        this._activeComponentId = null;
    }

    generateComponentUid() {
        return '0x' + ('00000000' + (Math.floor(Math.random() * 0xFFFFFFFF + 1)).toString(16)).substr(-8).toUpperCase();
    }

    setUndoStack(undoStack) {
        this._undoStack = undoStack;
    }

    getNewComponentUid() {
        let componentsById = this._componentsById;
        let result         = this.generateComponentUid();
        let found          = true;
        while (found) {
            found = false;
            for (let id in componentsById) {
                if (componentsById[id].uid === result) {
                    result = this.generateComponentUid();
                    found  = true;
                    break;
                }
            }
        }
        return result;
    }

    getNameExists(component, name) {
        let componentsById = this._componentsById;
        for (let id in componentsById) {
            let c = componentsById[id];
            if ((c !== component) && (c.name === name)) {
                return true;
            }
        }
        return false;
    }

    getActiveComponentId() {
        return this._activeComponentId;
    }

    setActiveComponentId(id) {
        this._activeComponentId = id;
        return this;
    }

    getComponentById(id) {
        return this._componentsById[id];
    }

    getList() {
        let result = [];
        for (let id in this._componentsById) {
            result.push(this._componentsById[id]);
        }
        return result;
    }

    getItems() {
        let componentsById = this._componentsById;
        let items          = [];
        for (let id in componentsById) {
            let component = componentsById[id];
            items.push({
                toString:    function() { return this.nameAndType; },
                value:       component.id,
                title:       component.name + ' <i>' + component.type + '</i>',
                nameAndType: component.name + '_' + component.type
            });
        }
        items.sort();
        return items;
    }

    getItemsByParentId(parentId) {
        let componentsById = this._componentsById;
        let items          = [];
        for (let id in componentsById) {
            let component = componentsById[id];
            if (component.parentId === parentId) {
                items.push(component);
            }
        }
        return items;
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
            delete component.componentList;
            delete component.owner;
            delete component.propertyList;
            delete component.eventList;
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

    setComponentById(component, id) {
        this._componentsById[id] = component;
        return this;
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

    deleteComponentById(id) {
        let componentsById = this._componentsById;
        if ((id === null) || !componentsById[id]) {
            return null;
        }
        let component = Object.assign({}, componentsById[id]);
        component.parentId = component.owner.getParentId();
        delete component.owner;
        delete componentsById[id];
        this._activeComponentId = null;
        return component;
    }

    deleteActiveComponent() {
        return this.deleteComponentById(this._activeComponentId);
    }

    selectComponentById(id) {
        let component = this._componentsById[id];
        if (component) {
            this._activeComponentId = id;
            return component;
        }
        return false;
    }

    changeTabs(component, value) {
        let componentsById       = this._componentsById;
        let findNestedComponents = (children, parentId) => {
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
            };
        if (value.length > component.tabs.length) {
            component.containerId.push(this._formEditorState.getNextId() + 1);
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
};
