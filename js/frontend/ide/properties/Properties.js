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
        this._opts       = opts;
        this._ui         = opts.ui;
        this._settings   = opts.settings;
        this._properties = [];
        this.initDOM(opts.parentNode || document.body);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
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
                        className: 'properties-container',
                        children:  [
                            {
                                className: 'property-separator'
                            }
                        ].concat(this.initPropertyChildren())
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
};
