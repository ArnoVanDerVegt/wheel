/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const platform        = require('../../../../lib/platform');
const dispatcher      = require('../../../../lib/dispatcher').dispatcher;
const DOMNode         = require('../../../../lib/dom').DOMNode;
const Button          = require('../../../../lib/components/input/Button').Button;
const SettingsState   = require('../../../settings/SettingsState');
const SimulatorPlugin = require('../lib/SimulatorPlugin').SimulatorPlugin;

exports.Plugin = class extends SimulatorPlugin {
    constructor(opts) {
        super(opts);
        this._baseClassName = 'spike';
        opts.settings.on('Settings.Plugin', this, this.onPluginSettings);
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('spike'),
                className: this.getClassName(),
                children: [
                    {
                        className: 'spike-top flt max-w',
                        children: [
                            this.initButton()
                        ]
                    },
                    {
                        className: 'spike-middle flt max-w',
                        children: [
                            this.initPorts(['A', 'C', 'E']),
                            this.initLeds(),
                            this.initPorts(['B', 'D', 'F'])
                        ]
                    },
                    {
                        className: 'spike-bottom flt max-w',
                        children: [
                            this.initButtons()
                        ]
                    }
                ]
            }
        );
    }

    initLeds() {
        let result = {
                className: 'flt leds',
                children:  []
            };
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                result.children.push({
                    className: 'flt led'
                });
            }
        }
        return result;
    }

    initPorts(ports) {
        let result = {
                className: 'flt max-h ports',
                children: []
            };
        ports.forEach((port) => {
            result.children.push({
                className: 'flt port',
                innerHTML: port
            });
        });
        return result;
    }

    initButton() {
        return {
            className: 'button'
        };
    }

    initButtons() {
        return {
            className: 'flt buttons',
            children: [
                {
                    className: 'left-right'
                },
                {
                    className: 'center'
                }
            ]
        };
    }

    onPluginSettings() {
    }
};
