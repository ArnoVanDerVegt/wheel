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

    getComponentClone(id) {
        let component = Object.assign({}, this._componentsById[id]);
        delete component.componentList;
        delete component.owner;
        delete component.propertyList;
        delete component.eventList;
        delete component.children;
        if ('containerIds' in component) {
            // Make a new copy of the containerIds array:
            component.containerIds = [].concat(component.containerIds);
        }
        return component;
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

    getComponentByUid(uid) {
        let componentsById = this._componentsById;
        for (let id in componentsById) {
            if (componentsById[id].uid === uid) {
                return componentsById[id];
            }
        }
        return null;
    }

    getList() {
        let result = [];
        for (let id in this._componentsById) {
            result.push(this.getComponentClone(id));
        }
        return result;
    }

    getItems() {
        let componentsById = this._componentsById;
        let items          = [];
        for (let id in componentsById) {
            let component = this.getComponentClone(id);
            component.toString = function() {
                return ('0000000' + (this.parentId || '0')).substr(-7) + component.name;
            };
            items.push({
                toString:    function() { return this.nameAndType; },
                value:       component.id,
                title:       component.name + '&nbsp;<i>' + component.type + '</i>',
                nameAndType: component.name + '_' + component.type,
                component:   component
            });
        }
        items.sort();
        return items;
    }

    getItemsByParentId(parentId) {
        let componentsById = this._componentsById;
        let items          = [];
        for (let id in componentsById) {
            let component = this.getComponentClone(id);
            if (component.parentId === parentId) {
                items.push(component);
            }
        }
        return items;
    }

    getChildComponents(component) {
        let children = [];
        const getChildren = (component) => {
                if (!component.containerIds) {
                    return children;
                }
                component.containerIds.forEach((containerId) => {
                    let items = this.getItemsByParentId(containerId);
                    children.push.apply(children, items);
                    items.forEach((component) => {
                        getChildren(component);
                    });
                });
                return children;
            };
        return getChildren(component);
    }

    getData(renumIds) {
        /* eslint-disable no-invalid-this */
        let toString       = function() { return ('00000000' + this.id).substr(-8); };
        let result         = [];
        let componentsById = {};
        let ids            = {};
        let nextId         = 0;
        const getId = (id) => {
                if (id in ids) {
                    return ids[id];
                }
                nextId++;
                ids[id] = nextId;
                return nextId;
            };
        const updateParentId = (oldParentId, newParentId) => {
                for (let id in componentsById) {
                    if (componentsById[id].parentId === oldParentId) {
                        componentsById[id].parentId = newParentId;
                    }
                }
            };
        for (let id in this._componentsById) {
            componentsById[id] = this.getComponentClone(id);
        }
        for (let id in componentsById) {
            let component = componentsById[id];
            if (renumIds) {
                component.id = getId(id);
                if ('containerIds' in component) {
                    let containerIds = component.containerIds;
                    for (let i = 0; i < containerIds.length; i++) {
                        let oldParentId = containerIds[i];
                        let newParentId = getId(oldParentId);
                        if (newParentId !== oldParentId) {
                            updateParentId(oldParentId, newParentId);
                        }
                        containerIds[i] = newParentId;
                    }
                }
            }
            if (component.type === 'form') {
                delete(component.parentId);
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
        let parentId  = componentsById[id].owner ? componentsById[id].owner.getContainerId() : 0;
        let component = this.getComponentClone(id);
        component.parentId      = parentId;
        this._activeComponentId = null;
        delete this._componentsById[id];
        return component;
    }

    deleteActiveComponent() {
        return this.deleteComponentById(this._activeComponentId);
    }

    selectComponentById(id) {
        if (this._componentsById[id]) {
            this._activeComponentId = id;
            return this.getComponentClone(id);
        }
        return false;
    }

    changeTabs(component, value) {
        let componentsById       = this._componentsById;
        let findNestedComponents = (children, parentId) => {
                for (let id in componentsById) {
                    let component = componentsById[id];
                    if (component.parentId === parentId) {
                        let containerIds = component.containerIds || [];
                        for (let i = 0; i < containerIds.length; i++) {
                            findNestedComponents(children, containerIds[i]);
                        }
                        children.push(this.getComponentClone(id));
                        delete this._componentsById[id];
                        this._formEditorState.emit('DeleteComponent', component);
                    }
                }
            };
        if (value.length > component.tabs.length) {
            let nextId = this._formEditorState.getNextId();
            component.containerIds.push(nextId);
            this._undoStack.undoStackPush({
                action: formEditorConstants.ACTION_TAB_ADD_TAB,
                id:     component.id,
                tabs:   [].concat(component.tabs)
            });
            this._formEditorState.emit('AddUndo');
        } else if (value.length < component.tabs.length) {
            let parentId = component.containerIds.pop();
            let children = [];
            findNestedComponents(children, parentId);
            this._undoStack.undoStackPush({
                action:   formEditorConstants.ACTION_TAB_DELETE_TAB,
                id:       component.id,
                tabs:     [].concat(component.tabs),
                children: children.reverse()
            });
            this._formEditorState.emit('AddUndo');
        }
    }
};
