/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const poweredUpModuleConstants = require('../../../../../../shared/vm/modules/poweredUpModuleConstants');
const getImage                 = require('../../../../data/images').getImage;
const Motor                    = require('../../lib/motor/io/Motor').Motor;
const MotorState               = require('./MotorState').MotorState;

let deviceInfo = [];
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_BASIC_MOTOR              ] = {src: 'images/poweredup/motor.svg',       motor: true,  value: false};
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_TACHO_MOTOR        ] = {src: 'images/poweredup/motor.svg',       motor: true,  value: true};
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_MOVE_HUB_MOTOR     ] = {src: 'images/poweredup/motor.svg',       motor: true,  value: true};
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_CONTROL_PLUS_LARGE_MOTOR ] = {src: 'images/poweredup/motor.svg',       motor: true,  value: true};
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_CONTROL_PLUS_XLARGE_MOTOR] = {src: 'images/poweredup/motor.svg',       motor: true,  value: true};
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_LED_LIGHTS               ] = {src: 'images/poweredup/light.svg',       motor: false, value: false};
deviceInfo[poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_DISTANCE           ] = {src: 'images/poweredup/lightSensor.svg', motor: false, value: true};

exports.Motor = class extends Motor {
    constructor(opts) {
        opts.image  = 'images/poweredup/motor.svg';
        super(opts);
        this._device
            .addEventListener('PoweredUp.Layer' + this._layer + 'Sensor' + this._id + 'Changed',  this, this.onValueChanged)
            .addEventListener('PoweredUp.Layer' + this._layer + 'Sensor' + this._id + 'Assigned', this, this.onAssigned);
        this.setType(0);
    }

    setType(type) {
        if (deviceInfo[type]) {
            this._imageElement.style.display    = 'block';
            this._speedElement.style.display    = 'block';
            this._imageElement.src              = getImage(deviceInfo[type].src);
            this._positionElement.style.display = deviceInfo[type].value ? 'block' : 'none';
            this._speedElement.style.display    = deviceInfo[type].motor ? 'block' : 'none';
        } else {
            this._imageElement.style.display    = 'none';
            this._positionElement.style.display = 'none';
            this._speedElement.style.display    = 'none';
        }
        this._state.setType(type);
    }

    onValueChanged(value) {
        this._positionElement.innerHTML = value;
    }

    onAssigned(assignment) {
        this.setType(assignment);
    }
};
