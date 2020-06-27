/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const formEditorConstants = require('./formEditorConstants');
const EventList           = require('./state/EventList').EventList;
const PropertyList        = require('./state/PropertyList').PropertyList;

exports.ComponentBuilder = class {
    constructor(opts) {
        this._componentList   = opts.componentList;
        this._formEditorState = opts.formEditorState;
    }

    addInfoToComponent(component, type) {
        let opts = {
                component:       component,
                componentList:   this._componentList,
                formEditorState: this._formEditorState
            };
        component.type         = type;
        component.propertyList = new PropertyList(opts);
        component.eventList    = new EventList(opts);
        return this;
    }

    addProperty(component, property, value) {
        if (property in component) {
            return this;
        }
        component[property] = value;
        return this;
    }

    addFormComponent(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_FORM)
            .addProperty(component, 'name',   component.name)
            .addProperty(component, 'title',  component.title || component.name)
            .addProperty(component, 'width',  component.width)
            .addProperty(component, 'height', component.height);
        return component;
    }

    addButtonComponent(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_BUTTON)
            .addProperty(component, 'name',  this._componentList.findComponentText(component.type, 'name', 'Button'))
            .addProperty(component, 'value', component.name)
            .addProperty(component, 'title', component.name)
            .addProperty(component, 'color', 'green');
        return component;
    }

    addSelectButton(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_SELECT_BUTTON)
            .addProperty(component, 'name',    this._componentList.findComponentText(component.type, 'name', 'SelectButton'))
            .addProperty(component, 'options', ['A', 'B'])
            .addProperty(component, 'color',   'green');
        return component;
    }

    addLabel(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_LABEL)
            .addProperty(component, 'name',   this._componentList.findComponentText(component.type, 'name', 'Label'))
            .addProperty(component, 'text',   component.text || component.name)
            .addProperty(component, 'halign', 'left');
        return component;
    }

    addCheckBox(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_CHECKBOX)
            .addProperty(component, 'name',    this._componentList.findComponentText(component.type, 'name', 'Checkbox'))
            .addProperty(component, 'text',    component.text || component.name)
            .addProperty(component, 'checked', false);
        return component;
    }

    addStatusLight(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_STATUS_LIGHT)
            .addProperty(component, 'name',  this._componentList.findComponentText(component.type, 'name', 'StatusLight'))
            .addProperty(component, 'text',  component.text  || component.name)
            .addProperty(component, 'color', component.color || 'gray');
        return component;
    }

    addPanel(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_PANEL)
            .addProperty(component, 'name',        this._componentList.findComponentText(component.type, 'name', 'Panel'))
            .addProperty(component, 'width',       200)
            .addProperty(component, 'height',      128)
            .addProperty(component, 'containerId', [this._formEditorState.peekId()]);
        return component;
    }

    addTabs(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_TABS)
            .addProperty(component, 'name',        this._componentList.findComponentText(component.type, 'name', 'Tabs'))
            .addProperty(component, 'tabs',        ['Tab(1)', 'Tab(2)'])
            .addProperty(component, 'width',       200)
            .addProperty(component, 'height',      128);
        if (!('containerId' in component)) {
            this.addProperty(component, 'containerId', [this._formEditorState.peekId(), this._formEditorState.peekId() + 1]);
        }
        return component;
    }

    addComponentForType(component, type) {
        this
            .addProperty(component, 'tabIndex', 0)
            .addProperty(component, 'hidden',   false)
            .addProperty(component, 'disabled', false);
        switch (type) {
            case formEditorConstants.COMPONENT_TYPE_BUTTON:        return this.addButtonComponent(component);
            case formEditorConstants.COMPONENT_TYPE_SELECT_BUTTON: return this.addSelectButton   (component);
            case formEditorConstants.COMPONENT_TYPE_LABEL:         return this.addLabel          (component);
            case formEditorConstants.COMPONENT_TYPE_CHECKBOX:      return this.addCheckBox       (component);
            case formEditorConstants.COMPONENT_TYPE_STATUS_LIGHT:  return this.addStatusLight    (component);
            case formEditorConstants.COMPONENT_TYPE_PANEL:         return this.addPanel          (component);
            case formEditorConstants.COMPONENT_TYPE_TABS:          return this.addTabs           (component);
        }
        return null;
    }
};
