/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const poweredUpModuleConstants = require('../../../../../shared/vm/modules/poweredUpModuleConstants');
const sensorModuleConstants    = require('../../../../../shared/vm/modules/sensorModuleConstants');
const formEditorConstants      = require('./formEditorConstants');
const EventList                = require('./state/EventList').EventList;
const PropertyList             = require('./state/PropertyList').PropertyList;

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

    /* ================================= INPUT COMPONENTS ================================= */

    addButtonComponent(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_BUTTON)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'Button'))
            .addProperty(component, 'zIndex',       0)
            .addProperty(component, 'value',        component.name)
            .addProperty(component, 'title',        component.name)
            .addProperty(component, 'color',        'green');
        return component;
    }

    addSelectButton(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_SELECT_BUTTON)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'SelectButton'))
            .addProperty(component, 'zIndex',       0)
            .addProperty(component, 'options',      ['A', 'B'])
            .addProperty(component, 'color',        'green');
        return component;
    }

    addCheckBox(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_CHECKBOX)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'Checkbox'))
            .addProperty(component, 'zIndex',       0)
            .addProperty(component, 'text',         component.text || component.name)
            .addProperty(component, 'checked',      false);
        return component;
    }

    addRadio(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_RADIO)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'Radio'))
            .addProperty(component, 'zIndex',       0)
            .addProperty(component, 'horizontal',   false)
            .addProperty(component, 'options',      ['Red', 'Blue', 'Lime']);
        return component;
    }

    addDropdown(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_DROPDOWN)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'Dropdown'))
            .addProperty(component, 'zIndex',       0)
            .addProperty(component, 'items',        ['Red', 'Blue', 'Lime']);
        return component;
    }

    addTextInput(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_TEXT_INPUT)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'TextInput'))
            .addProperty(component, 'zIndex',       0)
            .addProperty(component, 'width',        48);
        return component;
    }

    addSlider(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_SLIDER)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'Slider'))
            .addProperty(component, 'zIndex',       0)
            .addProperty(component, 'maxValue',     100)
            .addProperty(component, 'value',        0)
            .addProperty(component, 'width',        128);
        return component;
    }

    /* ================================= TEXT COMPONENTS ================================= */

    addLabel(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_LABEL)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'Label'))
            .addProperty(component, 'zIndex',       0)
            .addProperty(component, 'text',         component.text || component.name)
            .addProperty(component, 'halign',       'left');
        return component;
    }

    addTitle(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_TITLE)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'Title'))
            .addProperty(component, 'zIndex',       0)
            .addProperty(component, 'text',         component.text || component.name)
            .addProperty(component, 'halign',       'left');
        return component;
    }

    addText(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_TEXT)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'Text'))
            .addProperty(component, 'zIndex',       0)
            .addProperty(component, 'text',         component.text  || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam fermentum, felis et aliquam malesuada, nisl ligula fringilla arcu, ac finibus augue arcu in justo. Sed convallis id sapien nec dictum. Sed metus elit, malesuada sit amet molestie in, sagittis in neque. Proin ultricies velit vitae interdum fringilla. Vivamus purus nibh, lacinia ut auctor id, auctor at est.')
            .addProperty(component, 'width',        component.width || 300)
            .addProperty(component, 'halign',       'left');
        return component;
    }

    addListItems(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_LIST_ITEMS)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'ListItems'))
            .addProperty(component, 'zIndex',       0)
            .addProperty(component, 'items',        ['Left', 'Right', 'Down']);
        return component;
    }

    /* ================================= PANEL COMPONENTS ================================= */

    addPanel(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_PANEL)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'Panel'))
            .addProperty(component, 'zIndex',       0)
            .addProperty(component, 'width',        200)
            .addProperty(component, 'height',       128);
        if (!('containerIds' in component)) {
            this.addProperty(component, 'containerIds', [this._formEditorState.peekId()]);
        }
        return component;
    }

    addTabs(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_TABS)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'Tabs'))
            .addProperty(component, 'zIndex',       0)
            .addProperty(component, 'tabs',         ['Tab(1)', 'Tab(2)'])
            .addProperty(component, 'width',        200)
            .addProperty(component, 'height',       128);
        if (!('containerIds' in component)) {
            this.addProperty(component, 'containerIds', [this._formEditorState.peekId(), this._formEditorState.peekId() + 1]);
        }
        return component;
    }

    /* ================================= GRAPHICS COMPONENTS ================================= */

    addRectangle(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_RECTANGLE)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'Rectangle'))
            .addProperty(component, 'zIndex',       0)
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
            .addProperty(component, 'zIndex',       0)
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
            .addProperty(component, 'zIndex',       0)
            .addProperty(component, 'width',        64)
            .addProperty(component, 'height',       64);
        return component;
    }

    addIcon(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_ICON)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'Icon'))
            .addProperty(component, 'zIndex',       0);
        return component;
    }

    /* ================================= STATUS COMPONENTS ================================= */

    addStatusLight(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_STATUS_LIGHT)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'StatusLight'))
            .addProperty(component, 'zIndex',       0)
            .addProperty(component, 'text',         component.text  || component.name)
            .addProperty(component, 'color',        component.color || 'gray');
        return component;
    }

    addProgressBar(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_PROGRESS_BAR)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'ProgressBar'))
            .addProperty(component, 'zIndex',       0)
            .addProperty(component, 'text',         component.text  || component.name)
            .addProperty(component, 'width',        100)
            .addProperty(component, 'value',        50);
        return component;
    }

    addLoadingDots(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_LOADING_DOTS)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'LoadingDots'))
            .addProperty(component, 'zIndex',       0)
            .addProperty(component, 'text',         component.text  || component.name)
            .addProperty(component, 'color',        component.color || 'gray');
        return component;
    }

    /* ================================= DEVICE DISPLAY COMPONENTS ================================= */

    addPuDevice(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_PU_DEVICE)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'PuDevice'))
            .addProperty(component, 'zIndex',       0)
            .addProperty(component, 'port',         1)
            .addProperty(component, 'device',       poweredUpModuleConstants.POWERED_UP_DEVICE_BASIC_MOTOR);
        return component;
    }

    addEV3Motor(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_EV3_MOTOR)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'EV3Motor'))
            .addProperty(component, 'zIndex',       0)
            .addProperty(component, 'port',         0)
            .addProperty(component, 'device',       7); // Todo: use constant for Medium motor...
        return component;
    }

    addEV3Sensor(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_EV3_SENSOR)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'EV3Sensor'))
            .addProperty(component, 'zIndex',       0)
            .addProperty(component, 'port',         0)
            .addProperty(component, 'device',       sensorModuleConstants.SENSOR_TYPE_TOUCH);
        return component;
    }

    addInterval(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_INTERVAL)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'Interval'))
            .addProperty(component, 'time',         500);
        return component;
    }

    addTimeout(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_TIMEOUT)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'Timeout'))
            .addProperty(component, 'time',         500);
        return component;
    }

    addAlertDialog(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_ALERT_DIALOG)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'AlertDialog'))
            .addProperty(component, 'title',        'Alert title')
            .addProperty(component, 'text',         'Alert text');
        return component;
    }

    addConfirmDialog(component) {
        this
            .addInfoToComponent(component, formEditorConstants.COMPONENT_TYPE_CONFIRM_DIALOG)
            .addProperty(component, 'name',         this._componentList.findComponentText(component.type, 'name', 'ConfirmDialog'))
            .addProperty(component, 'title',        'Confirm title')
            .addProperty(component, 'text',         'Confirm text')
            .addProperty(component, 'okTitle',      'Ok')
            .addProperty(component, 'cancelTitle',  'Cancel');
        return component;
    }

    addComponentForType(component, type) {
        this
            .addProperty(component, 'tabIndex', 0)
            .addProperty(component, 'hidden',   false)
            .addProperty(component, 'disabled', false);
        switch (type) {
            // Input components...
            case formEditorConstants.COMPONENT_TYPE_BUTTON:         return this.addButtonComponent(component);
            case formEditorConstants.COMPONENT_TYPE_SELECT_BUTTON:  return this.addSelectButton   (component);
            case formEditorConstants.COMPONENT_TYPE_CHECKBOX:       return this.addCheckBox       (component);
            case formEditorConstants.COMPONENT_TYPE_RADIO:          return this.addRadio          (component);
            case formEditorConstants.COMPONENT_TYPE_DROPDOWN:       return this.addDropdown       (component);
            case formEditorConstants.COMPONENT_TYPE_TEXT_INPUT:     return this.addTextInput      (component);
            case formEditorConstants.COMPONENT_TYPE_SLIDER:         return this.addSlider         (component);
            // Text components...
            case formEditorConstants.COMPONENT_TYPE_LABEL:          return this.addLabel          (component);
            case formEditorConstants.COMPONENT_TYPE_TITLE:          return this.addTitle          (component);
            case formEditorConstants.COMPONENT_TYPE_TEXT:           return this.addText           (component);
            case formEditorConstants.COMPONENT_TYPE_LIST_ITEMS:     return this.addListItems      (component);
            // Status components...
            case formEditorConstants.COMPONENT_TYPE_STATUS_LIGHT:   return this.addStatusLight    (component);
            case formEditorConstants.COMPONENT_TYPE_PROGRESS_BAR:   return this.addProgressBar    (component);
            case formEditorConstants.COMPONENT_TYPE_LOADING_DOTS:   return this.addLoadingDots    (component);
            // Panel components...
            case formEditorConstants.COMPONENT_TYPE_PANEL:          return this.addPanel          (component);
            case formEditorConstants.COMPONENT_TYPE_TABS:           return this.addTabs           (component);
            // Graphics components...
            case formEditorConstants.COMPONENT_TYPE_RECTANGLE:      return this.addRectangle      (component);
            case formEditorConstants.COMPONENT_TYPE_CIRCLE:         return this.addCircle         (component);
            case formEditorConstants.COMPONENT_TYPE_IMAGE:          return this.addImage          (component);
            case formEditorConstants.COMPONENT_TYPE_ICON:           return this.addIcon           (component);
            // Device display components...
            case formEditorConstants.COMPONENT_TYPE_PU_DEVICE:      return this.addPuDevice       (component);
            case formEditorConstants.COMPONENT_TYPE_EV3_MOTOR:      return this.addEV3Motor       (component);
            case formEditorConstants.COMPONENT_TYPE_EV3_SENSOR:     return this.addEV3Sensor      (component);
            // Dialog components...
            case formEditorConstants.COMPONENT_TYPE_ALERT_DIALOG:   return this.addAlertDialog    (component);
            case formEditorConstants.COMPONENT_TYPE_CONFIRM_DIALOG: return this.addConfirmDialog  (component);
            // Non visual components...
            case formEditorConstants.COMPONENT_TYPE_INTERVAL:       return this.addInterval       (component);
            case formEditorConstants.COMPONENT_TYPE_TIMEOUT:        return this.addTimeout        (component);
        }
        return null;
    }
};
