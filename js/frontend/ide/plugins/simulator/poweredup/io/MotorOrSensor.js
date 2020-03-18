/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const poweredUpModuleConstants = require('../../../../../../shared/vm/modules/poweredUpModuleConstants');
const getImage                 = require('../../../../data/images').getImage;
const Motor                    = require('../../lib/motor/io/Motor').Motor;
const MotorOrSensorState       = require('./MotorOrSensorState').MotorOrSensorState;

let deviceInfo = [];
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_BASIC_MOTOR              ] = {src: 'images/poweredup/motor.png',       motor: true,  value: false};
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_TACHO_MOTOR        ] = {src: 'images/poweredup/motorM.png',      motor: true,  value: true};
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_MOVE_HUB_MOTOR     ] = {src: 'images/poweredup/moveHub.png',     motor: true,  value: true};
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_CONTROL_PLUS_LARGE_MOTOR ] = {src: 'images/poweredup/motorL.png',      motor: true,  value: true};
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_CONTROL_PLUS_XLARGE_MOTOR] = {src: 'images/poweredup/motorXl.png',     motor: true,  value: true};
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_LED_LIGHTS               ] = {src: 'images/poweredup/light.png',       motor: false, value: false};
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_DISTANCE           ] = {src: 'images/poweredup/lightSensor.png', motor: false, value: true};

/**
 * Todo: move _mode to _state instance.
**/
exports.MotorOrSensor = class extends Motor {
    constructor(opts) {
        opts.deviceInfo = deviceInfo;
        opts.MotorState = MotorOrSensorState;
        opts.image      = 'images/poweredup/motor.svg';
        super(opts);
        this._device
            .addEventListener('PoweredUp.Layer' + this._layer + 'Sensor' + this._id + 'Changed',  this, this.onValueChanged)
            .addEventListener('PoweredUp.Layer' + this._layer + 'Sensor' + this._id + 'Assigned', this, this.onAssigned);
        this
            .setType(0)
            .setMode(poweredUpModuleConstants.POWERED_UP_SENSOR_MODE_DISTANCE);
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

    setType(type) {
        this._state.setType(type);
        let refs = this._refs;
        let info = deviceInfo[type];
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
            if ((this._layer === 0) && (this._id === 0)) {
                this.setMode(this._mode);
            }
        } else {
            this._imageElement.style.display    = 'none';
            this._positionElement.style.display = 'none';
            this._speedElement.style.display    = 'none';
        }
        return this;
    }

    setMode(mode) {
        this._mode = mode;
        this.onValueChanged(0);
    }

    getContextMenuOptions() {
        if (this._state.getType() in deviceInfo) {
            return [
                'POWERED_UP_SENSOR_MODE_DISTANCE',
                'POWERED_UP_SENSOR_MODE_COLOR'
            ];
        }
        return [];
    }

    onClickMotorElement(event) {
        this.onClickTitle(this._refs.sensorTitle, event);
    }

    onResetTimeout() {
        this._refs.colorValueInput.setValue(0);
        this._numberInputElement.value = 0;
        this._timeoutReset             = null;
        this._value                    = 0;
    }

    onValueChanged(value) {
        let type            = this._state.getType();
        let positionElement = this._positionElement;
        if (!(type in deviceInfo)) {
            return;
        }
        if (deviceInfo[type].motor) {
            positionElement.innerHTML = value;
            return;
        }
        if (type === poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_DISTANCE) {
            let refs = this._refs;
            switch (this._mode) {
                case poweredUpModuleConstants.POWERED_UP_SENSOR_MODE_DISTANCE:
                    if (this._device.getConnected()) {
                        refs.numberValue.className     = 'value hidden';
                        refs.colorValue.className      = 'value hidden';
                        positionElement.style.display  = 'block';
                        positionElement.innerHTML      = value;
                    } else {
                        refs.numberValue.className     = 'value';
                        refs.colorValue.className      = 'value hidden';
                        positionElement.style.display  = 'none';
                        this._numberInputElement.value = value;
                    }
                    break;
                case poweredUpModuleConstants.POWERED_UP_SENSOR_MODE_COLOR:
                    positionElement.style.display = 'none';
                    refs.numberValue.className    = 'value hidden';
                    refs.colorValue.className     = 'value';
                    refs.colorValueInput.setValue(value);
                    refs.colorValueInput.setDisabled(this._device.getConnected());
                    break;
            }
        }
    }

    onAssigned(assigned) {
        this.setType(assigned);
        this._state.setIsMotor((assigned in deviceInfo) && deviceInfo[assigned].motor);
    }
};
