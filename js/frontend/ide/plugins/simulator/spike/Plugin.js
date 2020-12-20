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
const LedMatrix       = require('./io/LedMatrix').LedMatrix;

exports.Plugin = class extends SimulatorPlugin {
    constructor(opts) {
        opts.device = opts.spike;
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
                            {
                                ref:  this.setRef('ledMatrix'),
                                type: LedMatrix
                            },
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
        this._refs.spike.className = this.getClassName();
    }

    clearLeds(led) {
        this._refs.ledMatrix.clear();
    }

    setLed(led) {
        this._refs.ledMatrix.setLed(led.x, led.y, led.brightness);
    }
};
