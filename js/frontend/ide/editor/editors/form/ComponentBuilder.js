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
            .addProperty(component, 'name',         component.name)
            .addProperty(component, 'title',        component.title || component.name)
            .addProperty(component, 'width',        component.width)
            .addProperty(component, 'height',       component.height);
        return component;
    }

    addButtonComponent(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_BUTTON)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'Button'))
            .addProperty(component, 'value',        component.name)
            .addProperty(component, 'title',        component.name)
            .addProperty(component, 'color',        'green');
        return component;
    }

    addSelectButton(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_SELECT_BUTTON)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'SelectButton'))
            .addProperty(component, 'options',      ['A', 'B'])
            .addProperty(component, 'color',        'green');
        return component;
    }

    addLabel(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_LABEL)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'Label'))
            .addProperty(component, 'text',         component.text || component.name)
            .addProperty(component, 'halign',       'left');
        return component;
    }

    addCheckBox(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_CHECKBOX)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'Checkbox'))
            .addProperty(component, 'text',         component.text || component.name)
            .addProperty(component, 'checked',      false);
        return component;
    }

    addStatusLight(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_STATUS_LIGHT)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'StatusLight'))
            .addProperty(component, 'text',         component.text  || component.name)
            .addProperty(component, 'color',        component.color || 'gray');
        return component;
    }

    addPanel(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_PANEL)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'Panel'))
            .addProperty(component, 'width',        200)
            .addProperty(component, 'height',       128)
            .addProperty(component, 'containerId',  [this._formEditorState.peekId()]);
        return component;
    }

    addTabs(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_TABS)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'Tabs'))
            .addProperty(component, 'tabs',         ['Tab(1)', 'Tab(2)'])
            .addProperty(component, 'width',        200)
            .addProperty(component, 'height',       128);
        if (!('containerId' in component)) {
            this.addProperty(component, 'containerId', [this._formEditorState.peekId(), this._formEditorState.peekId() + 1]);
        }
        return component;
    }

    addRectangle(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_RECTANGLE)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'Rectangle'))
            .addProperty(component, 'width',        64)
            .addProperty(component, 'height',       64)
            .addProperty(component, 'borderWidth',  2)
            .addProperty(component, 'borderRadius', 0)
            .addProperty(component, 'borderColor',  {red:   0, grn:   0, blu:   0})
            .addProperty(component, 'fillColor',    {red: 255, grn: 255, blu: 255});
        return component;
    }

    addCircle(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_CIRCLE)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'Circle'))
            .addProperty(component, 'radius',       32)
            .addProperty(component, 'borderWidth',  2)
            .addProperty(component, 'borderColor',  {red:   0, grn:   0, blu:   0})
            .addProperty(component, 'fillColor',    {red: 255, grn: 255, blu: 255});
        return component;
    }

    addImage(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_IMAGE)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'Image'))
            .addProperty(component, 'width',        64)
            .addProperty(component, 'height',       64);
        return component;
    }

    addPuDevice(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_PU_DEVICE)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'PuDevice'));
        return component;
    }

    addEV3Motor(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_EV3_MOTOR)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'EV3Motor'));
        return component;
    }

    addEV3Sensor(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_EV3_SENSOR)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'EV3Sensor'));
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
            case formEditorConstants.COMPONENT_TYPE_RECTANGLE:     return this.addRectangle      (component);
            case formEditorConstants.COMPONENT_TYPE_CIRCLE:        return this.addCircle         (component);
            case formEditorConstants.COMPONENT_TYPE_IMAGE:         return this.addImage          (component);
            case formEditorConstants.COMPONENT_TYPE_PU_DEVICE:     return this.addPuDevice       (component);
            case formEditorConstants.COMPONENT_TYPE_EV3_MOTOR:     return this.addEV3Motor       (component);
            case formEditorConstants.COMPONENT_TYPE_EV3_SENSOR:    return this.addEV3Sensor      (component);
        }
        return null;
    }
};
