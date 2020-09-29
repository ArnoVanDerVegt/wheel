/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const formEditorConstants = require('../formEditorConstants');

exports.UndoStack = class {
    constructor(opts) {
        this._containerIdsForForm = opts.containerIdsForForm;
        this._componentBuilder    = opts.componentBuilder;
        this._componentList       = opts.componentList;
        this._formEditorState     = opts.formEditorState;
        this._undoStack           = [];
        this._enabled             = false;
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
        if (lastItem && (lastItem.action === item.action)) {
            switch (lastItem.action) {
                case formEditorConstants.ACTION_CHANGE_POSITION:
                    if (lastItem.id === item.id) {
                        return this;
                    }
                    break;
                case formEditorConstants.ACTION_CHANGE_PROPERTY:
                    if (lastItem.property === item.property) {
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
        let formEditorState  = this._formEditorState;
        let componentList    = this._componentList;
        let componentBuilder = this._componentBuilder;
        let component;
        let addComponent = (component) => {
                component.owner = this._containerIdsForForm.getFormComponentContainerByContainerId(component.parentId);
                componentList.setComponentById(component, component.id);
                componentBuilder.addComponentForType(component, component.type);
                return component;
            };
        switch (item.action) {
            case formEditorConstants.ACTION_ADD_COMPONENT:
                formEditorState.deleteComponentById(item.id, false);
                break;
            case formEditorConstants.ACTION_DELETE_COMPONENT:
                component = addComponent(item.component);
                this._activeComponentId = component.id;
                formEditorState
                    .emit('AddComponent', Object.assign({}, component))
                    .updateComponents(component.id);
                if (component.children) {
                    component.children.forEach(
                        function(component) {
                            component = addComponent(component);
                            formEditorState
                                .emit('AddComponent', Object.assign({}, component))
                                .updateComponents(component.id);
                        },
                        this
                    );
                }
                break;
            case formEditorConstants.ACTION_CHANGE_POSITION:
                component   = componentList.getComponentById(item.id);
                component.x = item.position.x;
                component.y = item.position.y;
                formEditorState
                    .onSelectComponent(item.id)
                    .emit('ChangePosition', item.id, item.position);
                break;
            case formEditorConstants.ACTION_CHANGE_PROPERTY:
                component                = componentList.getComponentById(item.id);
                component[item.property] = item.value;
                item.renameEvents.forEach((renameEvent) => {
                    let component = componentList.getComponentByUid(renameEvent.uid);
                    if (component) {
                        component[renameEvent.name] = renameEvent.oldValue;
                    }
                });
                formEditorState
                    .onSelectComponent(item.id)
                    .emit('ChangeProperty', item.id, item.property, item.value);
                if (component.type === 'form') {
                    formEditorState.emit('ChangeForm');
                }
                break;
            case formEditorConstants.ACTION_TAB_ADD_TAB:
                component      = this._componentList.getComponentById(item.id);
                component.tabs = item.tabs;
                component.containerIds.pop();
                formEditorState.emit('ChangeProperty', item.id, 'tab', item);
                break;
            case formEditorConstants.ACTION_TAB_DELETE_TAB:
                let parentMap = {};
                let parentId  = formEditorState.getNextId() + 1;
                let id        = parentId;
                item.children.forEach(
                    function(component) {
                        if (!(component.parentId in parentMap)) {
                            parentMap[component.parentId] = id;
                            id++;
                        }
                        let containerIds = component.containerIds;
                        if (containerIds) {
                            for (let i = 0; i < containerIds.length; i++) {
                                if (!(containerIds[i] in parentMap)) {
                                    parentMap[containerIds[i]] = id;
                                    id++;
                                }
                            }
                        }
                    }
                );
                component      = this._componentList.getComponentById(item.id);
                component.tabs = item.tabs;
                component.containerIds.push(parentId);
                formEditorState.emit('ChangeProperty', item.id, 'tab', item);
                item.children.forEach(
                    function(component) {
                        component.parentId = parentMap[component.parentId];
                        let containerIds;
                        if (component.type === formEditorConstants.COMPONENT_TYPE_PANEL) {
                            containerIds = component.containerIds;
                            containerIds[i] = parentMap[containerIds[0]];
                        } else if (component.type === formEditorConstants.COMPONENT_TYPE_TABS) {
                            containerIds = component.containerIds;
                            for (let i = 0; i < containerIds.length; i++) {
                                containerIds[i] = parentMap[containerIds[i]];
                            }
                        }
                        addComponent(component);
                        formEditorState.emit('AddComponent', Object.assign({}, component));
                    },
                    this
                );
                formEditorState.updateComponents(item.id);
                break;
        }
        formEditorState.emit('Undo');
    }
};
