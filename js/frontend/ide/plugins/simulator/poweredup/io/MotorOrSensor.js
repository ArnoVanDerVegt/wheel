/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const poweredUpModuleConstants = require('../../../../../../shared/vm/modules/poweredUpModuleConstants');
const getImage                 = require('../../../../data/images').getImage;
const Motor                    = require('../../lib/motor/io/Motor').Motor;
const MotorState               = require('./MotorState').MotorState;

let deviceInfo = [];
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_BASIC_MOTOR              ] = {src: 'images/poweredup/motor.png',       motor: true,  value: false};
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_TACHO_MOTOR        ] = {src: 'images/poweredup/motorM.png',      motor: true,  value: true};
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_MOVE_HUB_MOTOR     ] = {src: 'images/poweredup/moveHub.png',     motor: true,  value: true};
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_CONTROL_PLUS_LARGE_MOTOR ] = {src: 'images/poweredup/motorL.png',      motor: true,  value: true};
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_CONTROL_PLUS_XLARGE_MOTOR] = {src: 'images/poweredup/motorXl.png',     motor: true,  value: true};
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_LED_LIGHTS               ] = {src: 'images/poweredup/light.png',       motor: false, value: false};
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_DISTANCE           ] = {src: 'images/poweredup/lightSensor.png', motor: false, value: true};

exports.MotorOrSensor = class extends Motor {
    constructor(opts) {
        opts.image  = 'images/poweredup/motor.svg';
        super(opts);
        this._device
            .addEventListener('PoweredUp.Layer' + this._layer + 'Sensor' + this._id + 'Changed',  this, this.onValueChanged)
            .addEventListener('PoweredUp.Layer' + this._layer + 'Sensor' + this._id + 'Assigned', this, this.onAssigned);
        this.setType(0);
    }

    getExtraElements() {
        return [
            this.getNumberValueInput()
        ];
    }

    setType(type) {
        let info = deviceInfo[type];
        if (info) {
            let isMotor = info.motor;
            this._refs.numberValue.className     = 'value hidden';
            this._imageElement.style.display     = 'block';
            this._speedElement.style.display     = 'block';
            this._imageElement.src               = getImage(info.src);
            this._speedElement.style.display     = isMotor ? 'block' : 'none';
            if (isMotor || this._device.getConnected()) {
                this._positionElement.style.display = deviceInfo[type].value ? 'block' : 'none';
            } else {
                // Not connected, no motor: allow input in the simulator...
                this._positionElement.style.display = 'none';
                this._refs.numberValue.className    = 'value';
            }
        } else {
            this._imageElement.style.display    = 'none';
            this._positionElement.style.display = 'none';
            this._speedElement.style.display    = 'none';
        }
        this._state.setType(type);
    }

    onResetTimeout() {
        // Todo: this._refs.colorValueInput.setValue(0);
        this._numberInputElement.value = 0;
        this._timeoutReset             = null;
        this._value                    = 0;
    }

    onValueChanged(value) {
        this._positionElement.innerHTML = value;
    }

    onAssigned(assigned) {
        this.setType(assigned);
        this._state.setIsMotor((assigned in deviceInfo) && deviceInfo[assigned].motor);
    }
};
