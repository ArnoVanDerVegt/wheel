/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../lib/dispatcher').dispatcher;
const DOMNode           = require('../../lib/dom').DOMNode;
const tabIndex          = require('../tabIndex');
const PropertiesToolbar = require('./PropertiesToolbar').PropertiesToolbar;

exports.Properties = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._opts      = opts;
        this._ui        = opts.ui;
        this._settings  = opts.settings;
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
                        children:  []
                    }
                ]
            }
        );
        dispatcher.dispatch('Settings.UpdateViewSettings');
    }
};
