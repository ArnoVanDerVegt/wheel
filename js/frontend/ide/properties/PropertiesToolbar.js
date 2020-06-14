/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher  = require('../../lib/dispatcher').dispatcher;
const DOMNode     = require('../../lib/dom').DOMNode;
const CloseButton = require('../../lib/components/CloseButton').CloseButton;
const Button      = require('../../lib/components/Button').Button;
const Dropdown    = require('../../lib/components/Dropdown').Dropdown;
const tabIndex    = require('../tabIndex');

exports.PropertiesToolbar = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui        = opts.ui;
        this._settings  = opts.settings;
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'properties-options',
                children:  [
                    {
                        type:      Button,
                        ui:        this._ui,
                        uiId:      1,
                        dispatch:  'Button.Run',
                        event:     'Button.Run.Change',
                        tabIndex:  tabIndex.SIMULATOR_RUN_BUTTON,
                        className: 'run',
                        value:     'Run',
                        disabled:  true
                    },
                    {
                        type:      CloseButton,
                        ui:        this._ui,
                        uiId:      1,
                        onClick:   this.onCloseProperties.bind(this),
                        tabIndex:  tabIndex.CLOSE_PROPERTIES_BUTTON
                    },
                    {
                        type:      Dropdown,
                        ui:        this._ui,
                        uiId:      1,
                        tabIndex:  tabIndex.PROPERTIES_LIST,
                        event:     'Properties.ComponentList',
                        dispatch:  'Properties.SelectComponent'
                    }
                ]
            }
        );
    }

    onCloseProperties() {
        this._settings.getShowProperties() && dispatcher.dispatch('Settings.Toggle.ShowProperties');
    }
};
