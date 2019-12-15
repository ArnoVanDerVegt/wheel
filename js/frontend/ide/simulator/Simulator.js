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
                                className: 'ev3',
                                children: [
                                    {
                                        className: 'ev3-left'
                                    },
                                    {
                                        className: 'ev3-body',
                                        children: [
                                            {
                                                className: 'ev3-display',
                                                children: [
                                                    {
                                                        className: 'display-border',
                                                        children: [
                                                            {
                                                                id:   this.setDisplayElement.bind(this),
                                                                type: 'canvas',
                                                                ui:   this._ui
                                                            },
                                                            ('electron' in window) ?
                                                                {
                                                                    type:     Button,
                                                                    ui:       this._ui,
                                                                    color:    'blue',
                                                                    value:    'Copy',
                                                                    onClick:  this.onCopyDisplay.bind(this)
                                                                } :
                                                                null
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                className: 'ev3-panel',
                                                children: [
                                                    {
                                                        id:   this.setButtons.bind(this),
                                                        type: Buttons,
                                                        ui:   this._ui
                                                    },
                                                    {
                                                        type:      EV3Button,
                                                        ui:        this._ui,
                                                        className: 'ev3-button-stop',
                                                        up:        'ev3-button-stop',
                                                        down:      'ev3-button-stop pressed',
                                                        onClick:   this._opts.onStop
                                                    }
                                                ]
                                            },
                                            {
                                                className: 'ev3-bottom',
                                                children: [
                                                    {
                                                        className: 'ev3-log-text',
                                                        innerHTML: 'WHL'
                                                    },
                                                    {
                                                        className: 'ev3-logo'
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        className: 'ev3-right'
                                    }
                                ]
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

    getVM() {
        return this._vm;
    }

    setVM(vm) {
        this._vm = vm;
    }

    getDisplay() {
        return this._display;
    }

    getLight() {
        return require('./io/Light').light;
    }

    getButtons() {
        return this._buttons;
    }

    getSound() {
        return this._sound;
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

    setButtons(buttons) {
        this._buttons = buttons;
    }

    setDisplayElement(element) {
        this._canvas  = element;
        this._display = new Display({canvas: element});
    }

    getLayer() {
        return this._layer;
    }

    setLayer(layer) {
        this._layer = layer;
        this._motors.showLayer(layer);
        this._sensors.showLayer(layer);
    }

    onCopyDisplay() {
        const clipboard   = require('electron').clipboard;
        const nativeImage = require('electron').nativeImage;
        clipboard.writeImage(nativeImage.createFromDataURL(this._canvas.toDataURL('image/png')));
        dispatcher.dispatch('Console.Log', {message: 'Copied display to clipboard.'});
    }
};
