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

exports.FormEditorState = class extends Emitter {
    constructor(opts) {
        super(opts);
        this._nextId             = 0;
        this._nextParentId       = opts.nextParentId;
        this._settings           = opts.settings;
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
        this._componentList.setUndoStack(this._undoStack);
        this._componentTypes     = formEditorConstants.COMPONENT_TYPES_STANDARD;
        this._standardComponent  = formEditorConstants.COMPONENT_TYPE_BUTTON;
        this._panelComponent     = formEditorConstants.COMPONENT_TYPE_TABS;
        this._graphicsComponent  = formEditorConstants.COMPONENT_TYPE_RECTANGLE;
        this._ioComponent        = formEditorConstants.COMPONENT_TYPE_PU_DEVICE;
        this._dispatch           = [
            dispatcher.on('Properties.Property.Change',   this, this.onChangeProperty),
            dispatcher.on('Properties.Event.Change',      this, this.onChangeEvent),
            dispatcher.on('Properties.Select.Properties', this, this.onSelectProperties),
            dispatcher.on('Properties.SelectComponent',   this, this.onSelectComponent)
        ];
        this.initData(opts.data || []);
        setTimeout(this.initForm.bind(this, opts), 50);
    }

    remove() {
        while (this._dispatch.length) {
            this._dispatch.pop()();
        }
    }

    initData(data) {
        let nextParentId = this._nextParentId;
        let minId        = 10240;
        data.forEach((item) => {
            minId = Math.min(minId, item.id, item.parentId || 10240);
            if ('containerId' in item) {
                for (let i = 0; i < item.containerId.length; i++) {
                    minId = Math.min(minId, item.containerId[i]);
                }
            }
        });
        nextParentId -= minId;
        data.forEach((item) => {
            item.id       += nextParentId;
            item.parentId += nextParentId;
            if ('containerId' in item) {
                for (let i = 0; i < item.containerId.length; i++) {
                    item.containerId[i] += nextParentId;
                }
            }
        });
    }

    initForm(opts) {
        let formName  = path.replaceExtension(opts.filename, '');
        let form      = opts.data ? opts.data[0] : null;
        let component = this._componentBuilder.addFormComponent({
            type:   'form',
            uid:    form ? form.uid    : this._componentList.getNewComponentUid(),
            name:   form ? form.name   : (formName.substr(0, 1).toUpperCase() + formName.substr(1 - formName.length)),
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
            this._nextId = 0;
            let data = opts.data;
            for (let i = 1; i < data.length; i++) {
                let component = data[i];
                component.owner = this._getOwnerByParentId(component.parentId);
                this._nextId    = Math.max(this._nextId, component.parentId);
                this.addComponent(component);
            }
        }
        this._undoStack.setEnabled(true);
        this._loading = false;
    }

    peekId() {
        return this._nextId + 1;
    }

    getNextId() {
        this._nextId++;
        return this._nextId;
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

    /**
     * Select the types of component: COMPONENT_TYPES_STANDARD, COMPONENT_TYPES_GRAPHICS
    **/
    setComponentTypes(componentTypes) {
        this._componentTypes = componentTypes;
    }

    getActiveAddComponentType() {
        switch (this._componentTypes) {
            case formEditorConstants.COMPONENT_TYPES_STANDARD: return this._standardComponent;
            case formEditorConstants.COMPONENT_TYPES_PANEL:    return this._panelComponent;
            case formEditorConstants.COMPONENT_TYPES_GRAPHICS: return this._graphicsComponent;
            case formEditorConstants.COMPONENT_TYPES_IO:       return this._ioComponent;
        }
        return formEditorConstants.COMPONENT_TYPE_BUTTON;
    }

    setStandardComponent(standardComponent) {
        this._standardComponent = standardComponent;
    }

    setPanelComponent(panelComponent) {
        this._panelComponent = panelComponent;
    }

    setGraphicsComponent(graphicsComponent) {
        this._graphicsComponent = graphicsComponent;
    }

    setIOComponent(ioComponent) {
        this._ioComponent = ioComponent;
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
        let formGridSize = this._settings.getFormGridSize();
        if (formGridSize) {
            position.x = Math.round(position.x / formGridSize) * formGridSize;
            position.y = Math.round(position.y / formGridSize) * formGridSize;
        }
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
        if (activeComponent.type === formEditorConstants.COMPONENT_TYPE_PANEL) {
            return activeComponent.containerId;
        }
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
            case formEditorConstants.COMPONENT_TYPE_STATUS_LIGHT:  return true;
        }
        return false;
    }

    getCanPaste() {
        return !!this._clipboard;
    }

    getHasUndo() {
        return this._undoStack.getLength();
    }

    getData(renumIds) {
        return this._componentList.getData(renumIds);
    }

    getComponentList() {
        return this._componentList;
    }

    propertiesFromComponentToOpts(componentId, propertyList, opts) {
        let component = this.getComponentById(componentId);
        propertyList.getList().forEach((property) => {
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
        this._componentBuilder.addComponentForType(component, opts.type || this.getActiveAddComponentType());
        this._undoStack.undoStackPush({action: formEditorConstants.ACTION_ADD_COMPONENT, id: component.id});
        this
            .emit('AddComponent', Object.assign({}, component))
            .updateComponents(component.id);
    }

    addTab(opts) {
        this._componentList.addTab(opts);
    }

    deleteActiveComponent() {
        let activeComponentId = this._componentList.getActiveComponentId();
        if (!activeComponentId) {
            return;
        }
        this.deleteComponentById(activeComponentId, true);
    }

    deleteComponentById(id, saveUndo) {
        let componentList = this._componentList;
        let component     = componentList.deleteComponentById(id);
        let components    = [];
        let children      = componentList.getChildComponents(component);
        if (saveUndo) {
            if (children.length) {
                component.children = children;
                children.forEach((component) => {
                    components.push({name: component.name, id: component.id});
                    componentList.deleteComponentById(component.id);
                });
            }
            this._undoStack.undoStackPush({action: formEditorConstants.ACTION_DELETE_COMPONENT, component: component});
        }
        components.push({id: id, name: component.name});
        this.emit(
            'DeleteComponent',
            {
                components: components, // For source builder to remove defines...
                id:         id,
                name:       component.name,
                formName:   this.getFormName()
            }
        );
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
        if ((component.type === formEditorConstants.COMPONENT_TYPE_TABS) && (property === 'tabs')) {
            this.changeTabs(component, value);
        } else {
            this._undoStack.undoStackPush({
                action:   formEditorConstants.ACTION_CHANGE_PROPERTY,
                id:       id,
                property: property,
                value:    component[property]
            });
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
            this.emit(
                (component.type === 'form') ? 'RenameForm' : 'RenameComponent',
                {
                    components:   this._componentList.getList(),
                    oldName:      component[property],
                    newName:      value,
                    renameEvents: renameEvents
                }
            );
        }
        component[property] = value;
        if (component.type === 'form') {
            this.emit('ChangeForm');
        }
        dispatcher.dispatch('Properties.ComponentList', {items: this._componentList.getItems()});
    }

    onChangeEvent(id, event, value) {
        let component = this._componentList.getComponentById(id);
        if (!component) {
            console.error('Component not found:', id);
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
                .dispatch('Properties.Select.Events',     eventList,    this);
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
