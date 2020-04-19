/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const formEditorConstants = require('../formEditorConstants');

exports.UndoStack = class {
    constructor(opts) {
        this._getOwnerByParentId = opts.getOwnerByParentId;
        this._componentBuilder   = opts.componentBuilder;
        this._componentList      = opts.componentList;
        this._formEditorState    = opts.formEditorState;
        this._undoStack          = [];
        this._enabled            = false;
    }

    setEnabled(enabled) {
        this._enabled = enabled;
    }

    getLength() {
        return this._undoStack.length;
    }

    undoStackPop() {
        return this._undoStack.pop();
    }

    undoStackPush(item) {
        if (!this._enabled) {
            return this;
        }
        let undoStack = this._undoStack;
        let lastItem  = undoStack.length ? undoStack[undoStack.length - 1] : null;
        if (lastItem) {
            switch (lastItem.action) {
                case formEditorConstants.ACTION_CHANGE_POSITION:
                    if (lastItem.id === item.id) {
                        return this;
                    }
                    break;
                case formEditorConstants.ACTION_CHANGE_PROPERTY:
                    if ((lastItem.id === item.id) && (lastItem.property === item.property)) {
                        return this;
                    }
                    break;
            }
        }
        this._undoStack.push(item);
        this._formEditorState.emit('AddUndo');
        return this;
    }

    undo() {
        let item             = this.undoStackPop();
        let componentList    = this._componentList;
        let componentBuilder = this._componentBuilder;
        let component;
        let addComponent = (function(component) {
                component.owner = this._getOwnerByParentId(component.parentId);
                componentList.setComponentById(component, component.id);
                componentBuilder.addComponentForType(component, component.type);
                return component;
            }).bind(this);
        switch (item.action) {
            case formEditorConstants.ACTION_ADD_COMPONENT:
                this._formEditorState.deleteComponentById(item.id, false);
                break;
            case formEditorConstants.ACTION_DELETE_COMPONENT:
                component = addComponent(item.component);
                this._activeComponentId = component.id;
                this._formEditorState
                    .emit('AddComponent', Object.assign({}, component))
                    .updateComponents(component.id);
                break;
            case formEditorConstants.ACTION_CHANGE_POSITION:
                component   = componentList.getComponentById(item.id);
                component.x = item.position.x;
                component.y = item.position.y;
                this._formEditorState
                    .onSelectComponent(item.id)
                    .emit('ChangePosition', item.id, item.position);
                break;
            case formEditorConstants.ACTION_CHANGE_PROPERTY:
                component                = componentList.getComponentById(item.id);
                component[item.property] = item.value;
                this._formEditorState
                    .onSelectComponent(item.id)
                    .emit('ChangeProperty', item.id, item.property, item.value);
                if (component.type === 'form') {
                    this._formEditorState.emit('ChangeForm');
                }
                break;
            case formEditorConstants.ACTION_TAB_DELETE_TAB:
                let parentMap = {};
                let id        = nextId + 1;
                item.children.forEach(
                    function(component) {
                        if (!(component.parentId in parentMap)) {
                            parentMap[component.parentId] = id;
                            id++;
                        }
                        let containerId = component.containerId;
                        if (containerId) {
                            for (let i = 0; i < containerId.length; i++) {
                                if (!(containerId[i] in parentMap)) {
                                    parentMap[containerId[i]] = id;
                                    id++;
                                }
                            }
                        }
                    }
                );
                dispatcher.dispatch('AddTabComponent', item);
                item.children.forEach(
                    function(component) {
                        component.parentId = parentMap[component.parentId];
                        if (component.type === 'tabs') {
                            let containerId = component.containerId;
                            for (let i = 0; i < containerId.length; i++) {
                                containerId[i] = parentMap[containerId[i]];
                            }
                        }
                        addComponent(component);
                        this._formEditorState.emit('AddComponent', Object.assign({}, component));
                    },
                    this
                );
                this._formEditorState.updateComponents(item.id);
                break;
        }
        this._formEditorState.emit('Undo');
    }
};
