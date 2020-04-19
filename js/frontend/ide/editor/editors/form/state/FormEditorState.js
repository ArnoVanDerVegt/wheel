/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher          = require('../../../../../lib/dispatcher').dispatcher;
const Emitter             = require('../../../../../lib/Emitter').Emitter;
const path                = require('../../../../../lib/path');
const formEditorConstants = require('../formEditorConstants');
const ComponentBuilder    = require('../ComponentBuilder').ComponentBuilder;
const ComponentList       = require('./ComponentList').ComponentList;
const EventList           = require('./EventList').EventList;
const PropertyList        = require('./PropertyList').PropertyList;
const UndoStack           = require('./UndoStack').UndoStack;

let nextId = 0;

exports.FormEditorState = class extends Emitter {
    constructor(opts) {
        super(opts);
        this._loading            = !!opts.data;
        this._clipboard          = null;
        this._path               = opts.path;
        this._filename           = opts.filename;
        this._getOwnerByParentId = opts.getOwnerByParentId;
        this._formId             = this.peekId();
        this._componentList      = new ComponentList({
            formEditorState:    this
        });
        this._componentBuilder   = new ComponentBuilder({
            formEditorState:    this,
            componentList:      this._componentList
        });
        this._undoStack          = new UndoStack({
            formEditorState:    this,
            componentBuilder:   this._componentBuilder,
            componentList:      this._componentList,
            getOwnerByParentId: this._getOwnerByParentId
        });
        this._component          = formEditorConstants.COMPONENT_TYPE_BUTTON;
        this._dispatch           = [
            dispatcher.on('Properties.Property.Change',   this, this.onChangeProperty),
            dispatcher.on('Properties.Event.Change',      this, this.onChangeEvent),
            dispatcher.on('Properties.Select.Properties', this, this.onSelectProperties),
            dispatcher.on('Properties.SelectComponent',   this, this.onSelectComponent)
        ];
        setTimeout(this.initForm.bind(this, opts), 50);
    }

    remove() {
        while (this._dispatch.length) {
            this._dispatch.pop()();
        }
    }

    initForm(opts) {
        let formName  = path.replaceExtension(opts.filename, '');
        let form      = opts.data ? opts.data[0] : null;
        let component = this._componentBuilder.addFormComponent({
            type:   'form',
            uid:    form ? form.uid    : this._componentList.getNewComponentUid(),
            name:   form ? form.name   : formName,
            title:  form ? form.title  : formName,
            width:  form ? form.width  : opts.width,
            height: form ? form.height : opts.height
        });
        component.id = this._formId;
        this._componentList.setComponentById(component, this._formId);
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
        this._loading = false;
    }

    peekId() {
        return nextId + 1;
    }

    getNextId() {
        nextId++;
        return nextId;
    }

    getLoading() {
        return this._loading;
    }

    getPath() {
        return this._path;
    }

    getFilename() {
        return this._filename;
    }

    setComponent(component) {
        this._component = component;
    }

    getUndoStackLength() {
        return this._undoStack.getLength();
    }

    getFormComponent() {
        return this._componentList.getComponentById(this._formId);
    }

    setComponentPositionById(id, position) {
        let component = this._componentList.getComponentById(id) || {};
        this._undoStack.undoStackPush({
            action:   formEditorConstants.ACTION_CHANGE_POSITION,
            id:       id,
            position: {x: component.x, y: component.y}
        });
        component.x = position.x;
        component.y = position.y;
    }

    getComponentById(id) {
        return this._componentList.getComponentById(id);
    }

    getFormName() {
        return this.getComponentById(this._formId).name;
    }

    getActiveComponentId() {
        return this._componentList.getActiveComponentId();
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
        return this._componentList.getComponentById(this.getActiveComponentId()) || null;
    }

    getActiveComponentType() {
        let activeComponent = this.getActiveComponent();
        return activeComponent ? activeComponent.type : null;
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
        return this._componentList.getData();
    }

    getComponentList() {
        return this._componentList;
    }

    propertiesFromComponentToOpts(componentId, propertyList, opts) {
        let component = this.getComponentById(componentId);
        propertyList.getList().forEach(function(property) {
            if (property.name && (property.name in component)) {
                opts[property.name] = component[property.name];
            }
        });
        return component;
    }

    undo() {
        this._undoStack.undo();
    }

    addComponent(opts) {
        let component = Object.assign({}, opts);
        component.id  = this.getNextId();
        component.uid = component.uid || this._componentList.getNewComponentUid();
        this._componentList
            .setComponentById(component, component.id)
            .setActiveComponentId(component.id);
        this._componentBuilder.addComponentForType(component, opts.type || this._component);
        this._undoStack.undoStackPush({action: formEditorConstants.ACTION_ADD_COMPONENT, id: component.id});
        this
            .emit('AddComponent', Object.assign({}, component))
            .updateComponents(component.id);
    }

    deleteActiveComponent() {
        let activeComponentId = this._componentList.getActiveComponentId();
        if (!activeComponentId) {
            return;
        }
        this.deleteComponentById(activeComponentId, true);
    }

    deleteComponentById(id, saveUndo) {
        let component = this._componentList.deleteComponentById(id);
        if (saveUndo) {
            this._undoStack.undoStackPush({action: formEditorConstants.ACTION_DELETE_COMPONENT, component: component});
        }
        this.emit('DeleteComponent', id);
        dispatcher.dispatch('Properties.ComponentList', {value: null, items: this._componentList.getItems()});
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
        let component = this._componentList.selectComponentById(id);
        component && this.emit('SelectComponent', id);
        return component;
    }

    changeTabs(component, value) {
        this._componentList.changeTabs(component, value);
    }

    onChangeProperty(id, property, value) {
        let component = this._componentList.getComponentById(id);
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
        if ((component.type === 'form') && (property === 'name')) {
            this.emit('RenameForm', component[property], value);
        }
        component[property] = value;
        if (component.type === 'form') {
            this.emit('ChangeForm');
        }
        if (property === 'name') {
            let renameEvents = [];
            if (id === this._formId) {
                this._componentList.getList().forEach(
                    function(component) {
                        this.updateEventsForComponent(renameEvents, component);
                    },
                    this
                );
            } else {
                this.updateEventsForComponent(renameEvents, component);
            }
            this.emit('RenameEvents', renameEvents);
        }
    }

    onChangeEvent(id, event, value) {
        let component = this._componentList.getComponentById(id);
        if (!component) {
            return;
        }
        let newValue = !component[event];
        if (value) {
            component[event] = value;
        } else {
            delete component[event];
            newValue = false;
        }
        if (newValue) {
            this.emit('ChangeEvent');
        }
    }

    onSelectProperties(propertyList) {
        this.selectComponentById(propertyList.getComponentId());
    }

    onSelectComponent(id) {
        let component = this.selectComponentById(id);
        if (component) {
            let formId        = this._formId;
            let componentList = this._componentList;
            let propertyList  = new PropertyList({
                    component:       component,
                    componentList:   this._componentList,
                    formEditorState: this
                });
            let eventList     = new EventList({
                    component:       component,
                    formEditorState: this
                });
            dispatcher
                .dispatch('Properties.Select.Properties', propertyList, this)
                .dispatch('Properties.Select.Events', eventList, this);
        }
        return this;
    }

    updateEventsForComponent(renameEvents, component) {
        let events = component.eventList.getUpdatedEvents();
        for (let event in events) {
            if (event in component) {
                renameEvents.push({
                    name:    event,
                    newName: events[event],
                    oldName: component[event]
                });
                component[event] = events[event];
            }
        }
    }

    updateComponents(id) {
        dispatcher.dispatch('Properties.ComponentList', {value: id, items: this._componentList.getItems()});
        return this;
    }
};
