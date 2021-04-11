/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../../shared/vm/modules/sensorModuleConstants');
const BasicIODevice         = require('./BasicIODevice').BasicIODevice;

exports.EV3Sensor = class extends BasicIODevice {
    constructor(opts) {
        super(opts);
        this
            .setValueVisible(false)
            .setReadyVisible(false)
            .setSpeedVisible(false)
            .setColorVisible(false)
            .setPort(opts.port || 0);
        this.setDevice(opts.device || sensorModuleConstants.SENSOR_TYPE_NXT_TOUCH);
    }

    setDevice(device) {
        this._canSetSpeed = false;
        this._canSetValue = false;
        this._canSetReady = false;
        this._canSetColor = false;
        let image = false;
        switch (device) {
            case sensorModuleConstants.SENSOR_TYPE_NXT_SOUND:
                image             = 'images/nxt/sound64.png';
                this._canSetValue = true;
                break;
            case sensorModuleConstants.SENSOR_TYPE_NXT_TOUCH:
            case sensorModuleConstants.SENSOR_TYPE_TOUCH:
                image             = 'images/ev3/touch64.png';
                this._canSetValue = true;
                break;
            case sensorModuleConstants.SENSOR_TYPE_NXT_COLOR:
            case sensorModuleConstants.SENSOR_TYPE_COLOR:
                image             = 'images/ev3/color64.png';
                this._canSetColor = true;
                break;
            case sensorModuleConstants.SENSOR_TYPE_NXT_ULTRASONIC:
            case sensorModuleConstants.SENSOR_TYPE_ULTRASONIC:
                image             = 'images/ev3/ultrasonic64.png';
                this._canSetValue = true;
                break;
            case sensorModuleConstants.SENSOR_TYPE_GYRO:
                image             = 'images/ev3/gyro64.png';
                this._canSetValue = true;
                break;
            case sensorModuleConstants.SENSOR_TYPE_INFRARED:
                image             = 'images/ev3/infrared64.png';
                this._canSetValue = true;
                break;
        }
        if (image) {
            this
                .setImage(image)
                .setImageVisible(true);
        } else {
            this.setImageVisible(false);
        }
        this
            .setValueVisible(this._canSetValue)
            .setColorVisible(this._canSetColor)
            .setReadyVisible(this._canSetReady)
            .setSpeedVisible(this._canSetSpeed);
    }

    setPort(port) {
        if ((port >= 0) && (port < 4)) {
            super.setPort(port + 1);
        }
    }

    setValue(value) {
        if (this._canSetColor) {
            this.setValueVisible(false);
            super.setColor(value);
        } else {
            this.setValueVisible(this._canSetValue);
            super.setValue(value);
        }
    }
};

exports.Component = exports.EV3Sensor;
