/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher          = require('../../lib/dispatcher').dispatcher;
const DOMNode             = require('../../lib/dom').DOMNode;
const Button              = require('../../lib/components/Button').Button;
const Display             = require('./io/Display').Display;
const Buttons             = require('./io/Buttons').Buttons;
const EV3Button           = require('./io/Buttons').Button;
const Sound               = require('./io/Sound').Sound;
const SimulatorToolbar    = require('./SimulatorToolbar').SimulatorToolbar;
const SimulatorMotors     = require('./SimulatorMotors').SimulatorMotors;
const SimulatorSensors    = require('./SimulatorSensors').SimulatorSensors;
const SimulatorEV3        = require('./SimulatorEV3').SimulatorEV3;
const SimulatorConnection = require('./SimulatorConnection').SimulatorConnection;

exports.Simulator = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._opts     = opts;
        this._ui       = opts.ui;
        this._brick    = opts.brick;
        this._settings = opts.settings;
        this._layer    = 0;
        this._sound    = new Sound();
        this._vm       = null;
        this._plugins  = {};
        this.initDOM(opts.parentNode || document.body);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'simulator',
                children: [
                    {
                        type:      SimulatorToolbar,
                        ui:        this._ui,
                        brick:     this._brick,
                        settings:  this._settings,
                        simulator: this
                    },
                    {
                        className: 'ev3-background',
                        children: [
                            {
                                type:      SimulatorMotors,
                                ui:        this._ui,
                                brick:     this._brick,
                                settings:  this._settings,
                                simulator: this
                            },
                            {
                                type:      SimulatorEV3,
                                ui:        this._ui,
                                brick:     this._brick,
                                onStop:    this._opts.onStop,
                                simulator: this
                            },
                            {
                                type:      SimulatorSensors,
                                ui:        this._ui,
                                brick:     this._brick,
                                simulator: this
                            },
                            {
                                type:      SimulatorConnection,
                                ui:        this._ui,
                                brick:     this._brick
                            }
                        ]
                    }
                ]
            }
        );
        dispatcher.dispatch('Settings.UpdateViewSettings');
    }

    registerPlugin(name, plugin) {
        this._plugins[name] = plugin;
    }

    getPlugin(name) {
        return this._plugins[name] || null;
    }

    getVM() {
        return this._vm;
    }

    setVM(vm) {
        this._vm = vm;
    }

    getLight() {
        return require('./io/Light').light;
    }

    getSound() {
        return this._sound;
    }

    getLayer() {
        return this._layer;
    }

    setLayer(layer) {
        this._layer = layer;
        this._motors.showLayer(layer);
        this._sensors.showLayer(layer);
    }
};
