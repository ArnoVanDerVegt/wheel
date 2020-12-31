/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const spikeModuleConstants = require('../../../../../../shared/vm/modules/spikeModuleConstants');
const getImage             = require('../../../../data/images').getImage;
const Motor                = require('../../lib/motor/io/Motor').Motor;
const MotorOrSensorState   = require('./MotorOrSensorState').MotorOrSensorState;

let deviceInfo = [];
deviceInfo[spikeModuleConstants.SPIKE_DEVICE_MEDIUM_MOTOR   ] = {src: 'images/spike/motorMedium64.png',    motor: true,  value: true};
deviceInfo[spikeModuleConstants.SPIKE_DEVICE_LARGE_MOTOR    ] = {src: 'images/spike/motorLarge64.png',     motor: true,  value: true};
deviceInfo[spikeModuleConstants.SPIKE_DEVICE_DISTANCE_SENSOR] = {src: 'images/spike/distanceSensor64.png', motor: false, value: true};
deviceInfo[spikeModuleConstants.SPIKE_DEVICE_COLOR_SENSOR   ] = {src: 'images/spike/colorSensor64.png',    motor: false, value: true};
deviceInfo[spikeModuleConstants.SPIKE_DEVICE_FORCE_SENSOR   ] = {src: 'images/spike/forceSensor64.png',    motor: false, value: true};

exports.MotorOrSensor = class extends Motor {
    constructor(opts) {
        opts.deviceInfo = deviceInfo;
        opts.MotorState = MotorOrSensorState;
        opts.image      = 'images/spike/motor.svg';
        super(opts);
        let layer = opts.layer;
        let id    = opts.id;
        this._device
            .addEventListener('Spike.Layer' + layer + 'Port' + id + 'Changed',  this, this.onValueChanged)
            .addEventListener('Spike.Layer' + layer + 'Port' + id + 'Assigned', this, this.onAssigned);
        this._state
            .setType(0)
            .setMode(spikeModuleConstants.SPIKE_SENSOR_MODE_DISTANCE);
    }

    getExtraElements() {
        return [
            this.getColorValueInput(),
            this.getNumberValueInput()
        ];
    }

    setMotorElement(element) {
        this._motorElement = element;
        element.addEventListener('click', this.onClickMotorElement.bind(this));
    }

    getContextMenuOptions() {
        return [];
    }

    onChangeType(type) {
        let state = this._state;
        let refs  = this._refs;
        let info  = deviceInfo[type];
        refs.sensorTitle.className = 'title';
        refs.colorValue.className  = 'value hidden';
        refs.numberValue.className = 'value hidden';
        if (info) {
            let isMotor = info.motor;
            this._imageElement.style.display = 'block';
            this._speedElement.style.display = 'block';
            this._imageElement.src           = getImage(info.src);
            this._speedElement.style.display = isMotor ? 'block' : 'none';
            if (!isMotor) {
                refs.sensorTitle.className = 'title with-mode';
            }
            if (isMotor || this._device.getConnected()) {
                this._positionElement.style.display = deviceInfo[type].value ? 'block' : 'none';
            } else {
                // Not connected, no motor: allow input in the simulator...
                this._positionElement.style.display = 'none';
            }
        } else {
            this._imageElement.style.display    = 'none';
            this._positionElement.style.display = 'none';
            this._speedElement.style.display    = 'none';
        }
        return this;
    }

    onChangeMode(mode) {
        let state = this._state;
        if (state.getType() !== -1) {
            this.onChangeValue(this._state.getValue());
        }
    }

    onChangeValue(value) {
        let state           = this._state;
        let type            = state.getType();
        let positionElement = this._positionElement;
        if (!(type in deviceInfo)) {
            return;
        }
        if (deviceInfo[type].motor) {
            positionElement.style.display = 'block';
            positionElement.innerHTML     = value;
            return;
        }
        let refs = this._refs;
        positionElement.style.display = 'none';
        switch (type) {
            case spikeModuleConstants.SPIKE_DEVICE_DISTANCE_SENSOR:
            case spikeModuleConstants.SPIKE_DEVICE_COLOR_SENSOR:
            case spikeModuleConstants.SPIKE_DEVICE_FORCE_SENSOR:
                refs.colorValue.className         = 'value hidden';
                refs.numberValue.className        = 'value';
                this._numberInputElement.disabled = '';
                this._numberInputElement.value    = value;
                break;
        }
    }

    onAssigned(assigned) {
        this._state
            .setIsMotor((assigned in deviceInfo) && deviceInfo[assigned].motor)
            .setType(assigned);
    }

    onValueChanged(value) {
        this._state
            .setPosition(value)
            .setValue(value);
        this.onChangeValue(value);
    }

    onClickMotorElement(event) {
        this.onClickTitle(this._refs.sensorTitle, event);
    }
};
