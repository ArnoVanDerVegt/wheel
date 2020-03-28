/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../lib/dispatcher').dispatcher;
const DOMNode           = require('../../lib/dom').DOMNode;
const tabIndex          = require('../tabIndex');
const PropertiesToolbar = require('./PropertiesToolbar').PropertiesToolbar;
const BooleanProperty   = require('./types/BooleanProperty').BooleanProperty;
const TextProperty      = require('./types/TextProperty').TextProperty;
const ColorProperty     = require('./types/ColorProperty').ColorProperty;
const ListProperty      = require('./types/ListProperty').ListProperty;

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
            .on('Properties.ChangePosition', this, this.onChangePosition);
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

    initPropertyChildren() {
        let children = [];
        children.push({
            type:       BooleanProperty,
            properties: this,
            ui:         this._ui,
            name:       'Boolean',
            value:      'boolean'
        });
        children.push({
            type:       TextProperty,
            properties: this,
            ui:         this._ui,
            name:       'Text',
            value:      'text'
        });
        children.push({
            type:       ListProperty,
            properties: this,
            ui:         this._ui,
            name:       'List',
            value:      'text'
        });
        children.push({
            type:       ColorProperty,
            properties: this,
            ui:         this._ui,
            name:       'Colors',
            value:      'text'
        });
        return children;
    }

    focusProperty(property) {
        this._properties.forEach(function(p) {
            if ((p !== property) && p.setFocus) {
                p.setFocus(false);
            }
        });
    }

    addProperty(property) {
        this._properties.push(property);
    }

    onSelectProperties(componentType, properties) {
        let propertiesContainer = this._refs.propertiesContainer;
        let childNodes          = propertiesContainer.childNodes;
        while (childNodes.length > 1) {
            let childNode = childNodes[childNodes.length - 1];
            childNode.parentNode.removeChild(childNode);
        }
        let id             = 0;
        let propertyByName = {};
        properties.forEach(
            function(property) {
                let onChange = function(value) {
                        dispatcher.dispatch('Properties.Property.Change', componentType, id, property.name, value);
                    };
                switch (property.type) {
                    case 'id':
                        id = property.value;
                        break;
                    case 'string':
                        propertyByName[property.name] = new TextProperty({
                            parentNode: propertiesContainer,
                            properties: this,
                            ui:         this._ui,
                            name:       property.name,
                            value:      property.value,
                            onChange:   onChange
                        });
                        break;
                    case 'integer':
                        propertyByName[property.name] = new TextProperty({
                            parentNode: propertiesContainer,
                            properties: this,
                            ui:         this._ui,
                            name:       property.name,
                            value:      property.value,
                            onChange:   onChange
                        });
                        break;
                    case 'colorStyle':
                        propertyByName[property.name] = new ColorProperty({
                            parentNode: propertiesContainer,
                            properties: this,
                            ui:         this._ui,
                            name:       property.name,
                            value:      property.value,
                            onChange:   onChange
                        });
                        break;
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
};
