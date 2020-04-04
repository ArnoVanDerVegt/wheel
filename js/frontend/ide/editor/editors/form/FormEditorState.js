/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher          = require('../../../../lib/dispatcher').dispatcher;
const Emitter             = require('../../../../lib/Emitter').Emitter;
const formEditorConstants = require('./formEditorConstants');

let nextId = 0;

exports.FormEditorState = class extends Emitter {
    constructor(opts) {
        super(opts);
        this._getOwnerByParentId = opts.getOwnerByParentId;
        this._data               = opts.data || [];
        this._width              = opts.width;
        this._height             = opts.height;
        this._undoStack          = [];
        this._component          = formEditorConstants.COMPONENT_BUTTON;
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
        return this;
    }

    undo() {
        let item           = this.undoStackPop();
        let componentsById = this._componentsById;
        let component;
        let addComponent = (function(component) {
                component.owner              = this._getOwnerByParentId(component.parentId);
                componentsById[component.id] = component;
                switch (component.type) {
                    case 'button':       this.addButtonComponent(component); break;
                    case 'selectButton': this.addSelectButton   (component); break;
                    case 'label':        this.addLabel          (component); break;
                    case 'checkbox':     this.addCheckBox       (component); break;
                    case 'tabs':         this.addTabs           (component); break;
                }
                return component;
            }).bind(this);
        switch (item.action) {
            case formEditorConstants.ACTION_ADD_COMPONENT:
                this.deleteComponentById(item.id, false);
                break;
            case formEditorConstants.ACTION_DELETE_COMPONENT:
                component = addComponent(item.component);
                this._activeComponentId = component.id;
                this
                    .emit('AddComponent', Object.assign({}, component))
                    .updateComponents(component.id);
                break;
            case formEditorConstants.ACTION_CHANGE_POSITION:
                component   = componentsById[item.id];
                component.x = item.position.x;
                component.y = item.position.y;
                this.onSelectComponent(item.id);
                this.emit('ChangePosition', item.id, item.position);
                break;
            case formEditorConstants.ACTION_CHANGE_PROPERTY:
                component                = componentsById[item.id];
                component[item.property] = item.value;
                this.onSelectComponent(item.id);
                this.emit('ChangeProperty', item.id, item.property, item.value);
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
                        this.emit('AddComponent', Object.assign({}, component));
                    },
                    this
                );
                this.updateComponents(item.id);
                break;
        }
        this.emit('Undo');
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

    addProperty(component, property, value) {
        if (property in component) {
            return this;
        }
        component[property] = value;
        return this;
    }

    addButtonComponent(component) {
        component.type       = 'button';
        component.properties = [].concat(formEditorConstants.PROPERTIES_BY_TYPE.BUTTON);
        component.events     = [].concat(formEditorConstants.EVENTS_BY_TYPE.BUTTON);
        this
            .addProperty(component, 'name',  this.findComponentText('button', 'name', 'Button'))
            .addProperty(component, 'value', component.name)
            .addProperty(component, 'title', component.name)
            .addProperty(component, 'color', 'green');
    }

    addSelectButton(component) {
        component.type       = 'selectButton';
        component.properties = [].concat(formEditorConstants.PROPERTIES_BY_TYPE.SELECT_BUTTON);
        component.events     = [].concat(formEditorConstants.EVENTS_BY_TYPE.SELECT_BUTTON);
        this
            .addProperty(component, 'name',    this.findComponentText('selectButton', 'name', 'SelectButton'))
            .addProperty(component, 'options', ['A', 'B'])
            .addProperty(component, 'color',   'green');
    }

    addLabel(component) {
        component.type       = 'label';
        component.properties = [].concat(formEditorConstants.PROPERTIES_BY_TYPE.LABEL);
        component.events     = [].concat(formEditorConstants.EVENTS_BY_TYPE.LABEL);
        this
            .addProperty(component, 'name', findComponentText('label', 'name', 'Label'))
            .addProperty(component, 'text', component.name);
    }

    addCheckBox(component) {
        component.type       = 'checkbox';
        component.properties = [].concat(formEditorConstants.PROPERTIES_BY_TYPE.CHECKBOX);
        component.events     = [].concat(formEditorConstants.EVENTS_BY_TYPE.CHECKBOX);
        this
            .addProperty(component, 'name',    this.findComponentText('checkbox', 'name', 'Checkbox'))
            .addProperty(component, 'text',    component.name)
            .addProperty(component, 'checked', false);
    }

    addTabs(component) {
        component.type       = 'tabs';
        component.properties = [].concat(formEditorConstants.PROPERTIES_BY_TYPE.TABS);
        component.events     = [].concat(formEditorConstants.EVENTS_BY_TYPE.TABS);
        this
            .addProperty(component, 'name',        this.findComponentText('tabs', 'name', 'Tabs'))
            .addProperty(component, 'tabs',        ['Tab(1)', 'Tab(2)'])
            .addProperty(component, 'width',       200)
            .addProperty(component, 'height',      128)
            .addProperty(component, 'containerId', [this.peekId(), this.peekId() + 1]);
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
            case formEditorConstants.COMPONENT_BUTTON:        this.addButtonComponent(component); break;
            case formEditorConstants.COMPONENT_SELECT_BUTTON: this.addSelectButton   (component); break;
            case formEditorConstants.COMPONENT_LABEL:         this.addLabel          (component); break;
            case formEditorConstants.COMPONENT_CHECKBOX:      this.addCheckBox       (component); break;
            case formEditorConstants.COMPONENT_TABS:          this.addTabs           (component); break;
        }
        this._activeComponentId = component.id;
        this
            .undoStackPush({action: formEditorConstants.ACTION_ADD_COMPONENT, id: component.id})
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
            this.undoStackPush({action: formEditorConstants.ACTION_DELETE_COMPONENT, component: component});
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
            this.undoStackPush({
                action: formEditorConstants.ACTION_TAB_ADD_TAB,
                id:     component.id
            });
        } else if (value.length < component.tabs.length) {
            let parentId = component.containerId.pop();
            let children = [];
            findNestedComponents(children, parentId);
            this.undoStackPush({
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
            this.changeTabs(component, value);
        } else {
            this.undoStackPush({
                action:   formEditorConstants.ACTION_CHANGE_PROPERTY,
                id:       id,
                property: property,
                value:    component[property]
            });
        }
        component[property] = value;
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
    }

    updateComponents(id) {
        dispatcher.dispatch('Properties.ComponentList', {value: id, items: this.getItems()});
    }
};
