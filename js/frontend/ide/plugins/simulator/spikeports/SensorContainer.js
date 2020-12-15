/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const spikeModuleConstants = require('../../../../../shared/vm/modules/spikeModuleConstants');
const dispatcher           = require('../../../../lib/dispatcher').dispatcher;
const DOMNode              = require('../../../../lib/dom').DOMNode;
const Checkbox             = require('../../../../lib/components/input/Checkbox').Checkbox;
const IconSelect           = require('../../../../lib/components/input/IconSelect').IconSelect;
const getImage             = require('../../../data/images').getImage;
const BasicIOState         = require('../lib/motor/io/BasicIOState').BasicIOState;
const UnknownSensor        = require('./io/UnknownSensor').UnknownSensor;
const ColorSensor          = require('./io/ColorSensor').ColorSensor;
const DistanceSensor       = require('./io/DistanceSensor').DistanceSensor;
const ForceSensor          = require('./io/ForceSensor').ForceSensor;
const MotorMedium          = require('./io/MotorMedium').MotorMedium;
const MotorLarge           = require('./io/MotorLarge').MotorLarge;

exports.SensorContainer = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._opts               = opts;
        this._device             = opts.device;
        this._hidden             = opts.hidden;
        this._currentConstructor = null;
        this._currentSensor      = null;
        this._sensorConstructors = [];
        opts.addSensor(this);
        opts.device
           .addEventListener('Spike.Layer' + opts.layer + 'Sensor' + opts.id + 'Changed',  this, this.onValueChanged)
           .addEventListener('Spike.Layer' + opts.layer + 'Sensor' + opts.id + 'Assigned', this, this.onAssigned)
           .addEventListener('Spike.Connecting',                                           this, this.onConnecting)
           .addEventListener('Spike.Connected',                                            this, this.onConnected)
           .addEventListener('Spike.Disconnected',                                         this, this.onDisconnected);
        this
            .initSensorConstructors()
            .initDOM(opts.parentNode);
    }

    initSensorConstructors() {
        this._sensorConstructors[spikeModuleConstants.SPIKE_DEVICE_MEDIUM_MOTOR   ] = MotorMedium;
        this._sensorConstructors[spikeModuleConstants.SPIKE_DEVICE_LARGE_MOTOR    ] = MotorLarge;
        this._sensorConstructors[spikeModuleConstants.SPIKE_DEVICE_DISTANCE_SENSOR] = DistanceSensor;
        this._sensorConstructors[spikeModuleConstants.SPIKE_DEVICE_COLOR_SENSOR   ] = ColorSensor;
        this._sensorConstructors[spikeModuleConstants.SPIKE_DEVICE_FORCE_SENSOR   ] = ForceSensor;
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
