/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode    = require('../../../../lib/dom').DOMNode;
const dispatcher = require('../../../../lib/dispatcher').dispatcher;
const TextArea   = require('../../../../lib/components/input/TextArea').TextArea;
const Button     = require('../../../../lib/components/input/Button').Button;

exports.ExportSettings = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui              = opts.ui;
        this._uiId            = opts.uiId;
        this._settings        = opts.settings;
        this._tabIndex        = opts.tabIndex;
        this.initDOM(opts.parentNode);
        this.load();
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'text-property-setting',
                children: [
                    {
                        type:      'h3',
                        className: 'no-select flt max-w text-property-row',
                        innerHTML: 'Settings'
                    },
                    {
                        ref:  this.setRef('value'),
                        type: TextArea,
                        ui:   this._ui,
                        uiId: this._uiId
                    },
                    {
                        className: 'flt max-w text-property-row',
                        children: [
                            {
                                type:     Button,
                                color:    'blue',
                                ui:       this._ui,
                                uiId:     this._uiId,
                                tabIndex: 32,
                                value:    'Load settings from text above',
                                onClick:  this.onLoadSettings.bind(this)
                            }
                        ]
                    }
                ]
            }
        );
    }

    load() {
        this._refs.value.setValue(JSON.stringify(this._settings.getSettings(), null, '    '));
    }

    onLoadSettings() {
        try {
            dispatcher.dispatch('Settings.Load.New', JSON.parse(this._refs.value.getValue()));
        } catch (error) {

        }
    }
};
