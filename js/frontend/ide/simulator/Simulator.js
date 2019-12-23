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
        this._motors   = null;
        this._sensors  = null;
        this._vm       = null;
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
                                id:        this.setMotors.bind(this),
                                type:      SimulatorMotors,
                                ui:        this._ui,
                                brick:     this._brick,
                                settings:  this._settings,
                                simulator: this
                            },
                            {
                                id:        this.setEV3.bind(this),
                                type:      SimulatorEV3,
                                ui:        this._ui,
                                brick:     this._brick,
                                onStop:    this._opts.onStop,
                                simulator: this
                            },
                            {
                                id:        this.setSensors.bind(this),
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

    getMotors() {
        return this._motors;
    }

    setMotors(motors) {
        this._motors = motors;
    }

    getSensors() {
        return this._sensors;
    }

    setSensors(sensors) {
        this._sensors = sensors;
    }

    getEV3() {
        return this._ev3;
    }

    setEV3(ev3) {
        this._ev3 = ev3;
    }

    getVM() {
        return this._vm;
    }

    setVM(vm) {
        this._vm = vm;
    }

    getDisplay() {
        return this._ev3.getDisplay();
    }

    getLight() {
        return require('./io/Light').light;
    }

    getButtons() {
        return this._ev3.getButtons();
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
