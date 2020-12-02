/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../lib/dispatcher').dispatcher;
const Tabs              = require('../../lib/components/Tabs').Tabs;
const DOMNode           = require('../../lib/dom').DOMNode;
const tabIndex          = require('../tabIndex');
const PropertiesToolbar = require('./PropertiesToolbar').PropertiesToolbar;
const BooleanProperty   = require('./types/BooleanProperty').BooleanProperty;
const DropdownProperty  = require('./types/DropdownProperty').DropdownProperty;
const TextProperty      = require('./types/TextProperty').TextProperty;
const TextAreaProperty  = require('./types/TextAreaProperty').TextAreaProperty;
const TextListProperty  = require('./types/TextListProperty').TextListProperty;
const HAlignProperty    = require('./types/HAlignProperty').HAlignProperty;
const ColorProperty     = require('./types/ColorProperty').ColorProperty;
const RgbProperty       = require('./types/RgbProperty').RgbProperty;
const IconProperty      = require('./types/IconProperty').IconProperty;
const Event             = require('./Event').Event;
const Form              = require('./Form').Form;
const Components        = require('./Components').Components;

exports.Properties = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._opts                    = opts;
        this._ui                      = opts.ui;
        this._settings                = opts.settings;
        this._value                   = opts.value;
        this._activeProperties        = null;
        this._properties              = [];
        this._propertyByName          = {};
        this._events                  = [];
        this._eventByName             = {};
        this._changeComponentDebounce = null;
        this.initDOM(opts.parentNode);
        dispatcher
            .on('Properties.Clear',             this, this.onClear)
            .on('Properties.Select.Properties', this, this.onSelectProperties)
            .on('Properties.Select.Events',     this, this.onSelectEvent)
            .on('Properties.ChangePosition',    this, this.onChangePosition)
            .on('Properties.ComponentList',     this, this.onChangeComponentList);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('property'),
                className: 'abs properties',
                children: [
                    {
                        type:      PropertiesToolbar,
                        ui:        this._ui,
                        ev3:       this._ev3,
                        settings:  this._settings,
                        simulator: this
                    },
                    {
                        type: Tabs,
                        ref:  this.setRef('tabs'),
                        ui:   this._ui,
                        uiId: 1,
                        tabs: [
                            {
                                title:   'Form',
                                onClick: this.onClickForm.bind(this)
                            },
                            {
                                title:   'Property',
                                onClick: this.onClickProperty.bind(this)
                            },
                            {
                                title:   'Event',
                                onClick: this.onClickEvents.bind(this)
                            },
                            {
                                title:   'Components',
                                onClick: this.onClickComponents.bind(this)
                            }
                        ]
                    },
                    {
                        ref:       this.setRef('componentUid'),
                        className: 'no-select abs max-w component-uid',
                        innerHTML: '0x00000000'
                    },
                    {
                        ref:       this.setRef('formContainer'),
                        type:      Form
                    },
                    {
                        ref:       this.setRef('propertyContainer'),
                        className: 'abs max-w property-container',
                        children:  [
                            {
                                className: 'abs max-h property-separator'
                            }
                        ]
                    },
                    {
                        ref:       this.setRef('eventContainer'),
                        className: 'abs max-w event-container',
                        children:  [
                            {
                                className: 'abs max-h event-separator'
                            }
                        ]
                    },
                    {
                        type: Components,
                        ref:  this.setRef('componentsContainer'),
                        ui:   this._ui,
                        uiId: this._uiId
                    }
                ]
            }
        );
        dispatcher.dispatch('Settings.UpdateViewSettings');
    }

    focusProperty(property) {
        this._properties.forEach((p) => {
            if ((p !== property) && p.setFocus) {
                p.setFocus(false);
            }
        });
    }

    focusEvent(event) {
        this._events.forEach((e) => {
            if ((e !== event) && e.setFocus) {
                e.setFocus(false);
            }
        });
    }

    clear(container) {
        let childNodes = container.childNodes;
        while (childNodes.length > 1) {
            let childNode = childNodes[childNodes.length - 1];
            childNode.parentNode.removeChild(childNode);
        }
        return this;
    }

    addProperty(property) {
        this._properties.push(property);
    }

    addEvent(event) {
        this._events.push(event);
    }

    onClickForm() {
        let refs = this._refs;
        refs.propertyContainer.style.display = 'none';
        refs.eventContainer.style.display    = 'none';
        refs.formContainer.setVisible(true);
        refs.componentsContainer.setVisible(false);
    }

    onClickProperty() {
        let refs = this._refs;
        refs.propertyContainer.style.display = 'block';
        refs.eventContainer.style.display    = 'none';
        refs.formContainer.setVisible(false);
        refs.componentsContainer.setVisible(false);
    }

    onClickEvents() {
        let refs = this._refs;
        refs.propertyContainer.style.display = 'none';
        refs.eventContainer.style.display    = 'block';
        refs.formContainer.setVisible(false);
        refs.componentsContainer.setVisible(false);
    }

    onClickComponents() {
        let refs = this._refs;
        refs.propertyContainer.style.display = 'none';
        refs.eventContainer.style.display    = 'none';
        refs.formContainer.setVisible(false);
        refs.componentsContainer.setVisible(true);
    }

    onSelectProperties(propertyList, formEditorState) {
        this.onClickProperty();
        if (this._activeProperties === propertyList.getComponentUid()) {
            return;
        }
        let propertyContainer = this._refs.propertyContainer;
        let id                = propertyList.getComponentId();
        let propertyByName    = {};
        let component         = formEditorState.getComponentById(id);
        let tab               = tabIndex.PROPERTIES_CONTAINER;
        this._refs.tabs.setActiveTab('Property');
        this._refs.componentUid.innerHTML = propertyList.getComponentUid() || '0x00000000';
        this._activeProperties            = propertyList.getComponentUid();
        this._properties.length           = 0;
        this.clear(propertyContainer);
        propertyList.getList().forEach((property) => {
            if (!property || (property.name === null)) {
                return;
            }
            let propertyConstructor = null;
            let opts                = {
                    parentNode:    propertyContainer,
                    properties:    this,
                    ui:            this._ui,
                    name:          property.name,
                    options:       property.options,
                    value:         propertyList.getProperty(property.name),
                    componentList: propertyList.getComponentList(),
                    component:     component,
                    onChange:      dispatcher.dispatch.bind(dispatcher, 'Properties.Property.Change', id, property.name),
                    tabIndex:      tab
                };
            switch (property.type) {
                case 'boolean':  propertyConstructor = BooleanProperty;  break;
                case 'text':     propertyConstructor = TextProperty;     break;
                case 'textarea': propertyConstructor = TextAreaProperty; break;
                case 'textList': propertyConstructor = TextListProperty; break;
                case 'halign':   propertyConstructor = HAlignProperty;   break;
                case 'color':    propertyConstructor = ColorProperty;    break;
                case 'rgb':      propertyConstructor = RgbProperty;      break;
                case 'dropdown': propertyConstructor = DropdownProperty; break;
                case 'icon':     propertyConstructor = IconProperty;     break;
            }
            if (propertyConstructor) {
                let propertyComponent = new propertyConstructor(opts);
                propertyByName[property.name] = propertyComponent;
                tab += propertyComponent.getTabCount();
            }
        });
        this._propertyByName = propertyByName;
    }

    onSelectEvent(eventList, formEditorState) {
        this._refs.componentUid.innerHTML = eventList.getComponentUid() || '0x00000000';
        this._events.length               = 0;
        let eventContainer = this._refs.eventContainer;
        let id             = eventList.getComponentId();
        let eventByName    = {};
        let component      = formEditorState.getComponentById(id);
        this.clear(eventContainer);
        eventList.getList().forEach(
            function(event) {
                if (!event) {
                    console.warn('Warning invalid event:', event, 'eventList:', eventList);
                    return;
                }
                eventByName[event.name] = new Event({
                    eventList:     eventList,
                    parentNode:    eventContainer,
                    properties:    this,
                    ui:            this._ui,
                    name:          event.name,
                    value:         component[event.name] || '',
                    onChange: function(value) {
                        dispatcher.dispatch('Properties.Event.Change', id, event.name, value);
                    }
                });
            },
            this
        );
        this._eventByName = eventByName;
    }

    onChangePosition(position) {
        if (this._propertyByName.x) {
            this._propertyByName.x.setValue(position.x);
        }
        if (this._propertyByName.y) {
            this._propertyByName.y.setValue(position.y);
        }
    }

    onChangeComponentList(opts) {
        if (this._changeComponentDebounce) {
            clearTimeout(this._changeComponentDebounce);
        }
        this._changeComponentDebounce = setTimeout(
            () => {
                this._changeComponentDebounce = null;
                if (opts.value === null) {
                    this.onClear();
                }
                if (this._settings.getAutoSelectProperties()) {
                    this.onClickProperty();
                    this._refs.tabs.setActiveTab('Property');
                }
                this._refs.formContainer.setItems(opts.items);
            },
            25
        );
    }

    onClear() {
        let refs = this._refs;
        refs.componentUid.innerHTML = '0x00000000';
        this
            .clear(refs.propertyContainer)
            .clear(refs.eventContainer);
    }
};
