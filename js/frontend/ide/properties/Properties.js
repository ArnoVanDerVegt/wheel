/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher         = require('../../lib/dispatcher').dispatcher;
const DOMNode            = require('../../lib/dom').DOMNode;
const tabIndex           = require('../tabIndex');
const PropertiesToolbar  = require('./PropertiesToolbar').PropertiesToolbar;
const BooleanProperty    = require('./types/BooleanProperty').BooleanProperty;
const StringProperty     = require('./types/StringProperty').StringProperty;
const StringListProperty = require('./types/StringListProperty').StringListProperty;
const ColorProperty      = require('./types/ColorProperty').ColorProperty;

exports.Properties = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._opts           = opts;
        this._ui             = opts.ui;
        this._settings       = opts.settings;
        this._value          = opts.value;
        this._properties     = [];
        this._propertyByName = {};
        this.initDOM(opts.parentNode || document.body);
        dispatcher
            .on('Properties.Select',         this, this.onSelectProperties)
            .on('Properties.ChangePosition', this, this.onChangePosition)
            .on('Properties.ComponentList',  this, this.onChangeComponentList);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('property'),
                className: 'properties',
                children: [
                    {
                        type:      PropertiesToolbar,
                        ui:        this._ui,
                        ev3:       this._ev3,
                        settings:  this._settings,
                        simulator: this
                    },
                    {
                        ref:       this.setRef('propertiesContainer'),
                        className: 'properties-container',
                        children:  [
                            {
                                className: 'property-separator'
                            }
                        ]
                    }
                ]
            }
        );
        dispatcher.dispatch('Settings.UpdateViewSettings');
    }

    focusProperty(property) {
        this._properties.forEach(function(p) {
            if ((p !== property) && p.setFocus) {
                p.setFocus(false);
            }
        });
    }

    clear() {
        let propertiesContainer = this._refs.propertiesContainer;
        let childNodes          = propertiesContainer.childNodes;
        while (childNodes.length > 1) {
            let childNode = childNodes[childNodes.length - 1];
            childNode.parentNode.removeChild(childNode);
        }
        this._propertyByName = {};
    }

    addProperty(property) {
        this._properties.push(property);
    }

    onSelectProperties(properties, formEditorState) {
        this.clear();
        let propertiesContainer = this._refs.propertiesContainer;
        let id                  = properties.id;
        let propertyByName      = {};
        let component           = formEditorState.getComponentById(id);
        properties.forEach(
            function(property) {
                if (!property || (property.name === null)) {
                    return;
                }
                let onChange = function(value) {
                        dispatcher.dispatch('Properties.Property.Change', id, property.name, value);
                    };
                let propertyConstructor = null;
                let opts                = {
                        parentNode: propertiesContainer,
                        properties: this,
                        ui:         this._ui,
                        name:       property.name,
                        options:    property.options,
                        value:      component[property.name],
                        onChange:   onChange
                    };
                switch (property.type) {
                    case 'boolean':    propertyConstructor = BooleanProperty;    break;
                    case 'string':     propertyConstructor = StringProperty;     break;
                    case 'stringList': propertyConstructor = StringListProperty; break;
                    case 'integer':    propertyConstructor = StringProperty;     break;
                    case 'color':      propertyConstructor = ColorProperty;      break;
                }
                if (propertyConstructor) {
                    propertyByName[property.name] = new propertyConstructor(opts);
                }
            },
            this
        );
        this._propertyByName = propertyByName;
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
        if (opts.value === null) {
            this.clear();
        }
    }
};
