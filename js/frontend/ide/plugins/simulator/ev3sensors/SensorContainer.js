/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../../../shared/vm/modules/sensorModuleConstants');
const dispatcher            = require('../../../../lib/dispatcher').dispatcher;
const DOMNode               = require('../../../../lib/dom').DOMNode;
const Checkbox              = require('../../../../lib/components/input/Checkbox').Checkbox;
const IconSelect            = require('../../../../lib/components/input/IconSelect').IconSelect;
const getImage              = require('../../../data/images').getImage;
const BasicIOState          = require('../lib/motor/io/BasicIOState').BasicIOState;
const UnknownSensor         = require('./io/UnknownSensor').UnknownSensor;
const ColorSensor           = require('./io/ColorSensor').ColorSensor;
const GyroSensor            = require('./io/GyroSensor').GyroSensor;
const InfraredSensor        = require('./io/InfraredSensor').InfraredSensor;
const SoundSensor           = require('./io/SoundSensor').SoundSensor;
const TouchSensor           = require('./io/TouchSensor').TouchSensor;
const UltrasonicSensor      = require('./io/UltrasonicSensor').UltrasonicSensor;

exports.SensorContainer = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._opts               = opts;
        this._device             = opts.device;
        this._hidden             = opts.hidden;
        this._currentConstructor = null;
        this._currentSensor      = null;
        this._sensorConstructors = [];
        this._assignmentTimeout  = null;
        opts.addSensor(this);
        opts.device
           .addEventListener('EV3.Layer' + opts.layer + 'Sensor' + opts.id + 'Changed',  this, this.onValueChanged)
           .addEventListener('EV3.Layer' + opts.layer + 'Sensor' + opts.id + 'Assigned', this, this.onAssigned)
           .addEventListener('EV3.Connecting',                                           this, this.onConnecting)
           .addEventListener('EV3.Connected',                                            this, this.onConnected)
           .addEventListener('EV3.Disconnected',                                         this, this.onDisconnected);
        this
            .initSensorConstructors()
            .initDOM(opts.parentNode);
    }

    initSensorConstructors() {
        this._sensorConstructors[sensorModuleConstants.SENSOR_TYPE_NXT_TOUCH     ] = TouchSensor;
        this._sensorConstructors[sensorModuleConstants.SENSOR_TYPE_TOUCH         ] = TouchSensor;
        this._sensorConstructors[sensorModuleConstants.SENSOR_TYPE_NXT_COLOR     ] = ColorSensor;
        this._sensorConstructors[sensorModuleConstants.SENSOR_TYPE_COLOR         ] = ColorSensor;
        this._sensorConstructors[sensorModuleConstants.SENSOR_TYPE_NXT_ULTRASONIC] = UltrasonicSensor;
        this._sensorConstructors[sensorModuleConstants.SENSOR_TYPE_ULTRASONIC    ] = UltrasonicSensor;
        this._sensorConstructors[sensorModuleConstants.SENSOR_TYPE_GYRO          ] = GyroSensor;
        this._sensorConstructors[sensorModuleConstants.SENSOR_TYPE_INFRARED      ] = InfraredSensor;
        this._sensorConstructors[sensorModuleConstants.SENSOR_TYPE_NXT_SOUND     ] = SoundSensor;
        return this;
    }

    initSensor(sensorConstructor) {
        this._currentConstructor = sensorConstructor;
        let opts = Object.assign({}, this._opts);
        opts.type             = sensorConstructor;
        opts.sensorContainer  = this;
        opts.stateConstructor = BasicIOState;
        return opts;
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('sensor'),
                className: 'flt rel sensor-container' + (this._hidden ? ' hidden' : ''),
                children: [
                    this.initSensor(UnknownSensor)
                ]
            }
        );
    }

    onValueChanged(value) {
        this._currentSensor && this._currentSensor.getState().setValue(value);
    }

    onAssigned(assignment, mode) {
        const callback = () => {
                let currentConstructor = this._sensorConstructors[assignment] || UnknownSensor;
                if (currentConstructor !== this._currentConstructor) {
                    if (this._currentSensor) {
                        this._currentSensor.remove();
                        this._currentSensor = null;
                    }
                    if (currentConstructor !== null) {
                        let opts = this.initSensor(currentConstructor);
                        opts.parentNode = this._refs.sensor;
                        opts.connected  = this._device.getConnected();
                        new currentConstructor(opts);
                    }
                    this._currentConstructor = currentConstructor;
                }
                if (this._currentSensor) {
                    let state = this._currentSensor.getState();
                    state.setType(assignment);
                    if (mode !== null) {
                        state.setMode(parseInt(mode, 10));
                    }
                }
                this._assignmentTimeout = null;
            };
        if (this._assignmentTimeout) {
            clearTimeout(this._assignmentTimeout);
            this._assignmentTimeout = null;
        }
        this._assignmentTimeout = setTimeout(callback, 100);
    }

    onConnecting() {
        this.onAssigned(-1, null);
    }

    onConnected() {
        this._currentSensor && this._currentSensor.getState().setConnected(true);
    }

    onDisconnected() {
        this._currentSensor && this._currentSensor.getState().setConnected(false);
    }

    getCurrentSensor() {
        return this._currentSensor;
    }

    setCurrentSensor(currentSensor) {
        this._currentSensor && this._currentSensor.remove();
        this._currentSensor = currentSensor;
    }

    setHidden(hidden) {
        this._hidden                    = hidden;
        this._refs.sensor.style.display = hidden ? 'none' : 'block';
    }

    read() {
        return this._currentSensor ? this._currentSensor.getState().getValue() : 0;
    }
};
