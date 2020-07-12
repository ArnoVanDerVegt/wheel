/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const BasicIODevice         = require('./BasicIODevice').BasicIODevice;
const sensorModuleConstants = require('../../../../shared/vm/modules/sensorModuleConstants');

exports.EV3Sensor = class extends BasicIODevice {
    constructor(opts) {
        super(opts);
        this
            .setValueVisible(false)
            .setReadyVisible(false)
            .setSpeedVisible(false)
            .setColorVisible(false)
            .setPort(opts.port || 0);
        this.setType(opts.device || sensorModuleConstants.SENSOR_TYPE_NXT_TOUCH);
    }

    setType(type) {
        this._canSetSpeed = false;
        this._canSetValue = false;
        this._canSetReady = false;
        this._canSetColor = false;
        let image = false;
        switch (type) {
            case sensorModuleConstants.SENSOR_TYPE_NXT_SOUND:
                image             = 'images/ev3/microphone.png';
                this._canSetValue = true;
                break;
            case sensorModuleConstants.SENSOR_TYPE_NXT_TOUCH:
            case sensorModuleConstants.SENSOR_TYPE_TOUCH:
                image             = 'images/ev3/touch.png';
                this._canSetValue = true;
                break;
            case sensorModuleConstants.SENSOR_TYPE_NXT_COLOR:
            case sensorModuleConstants.SENSOR_TYPE_COLOR:
                image             = 'images/ev3/color.png';
                this._canSetColor = true;
                break;
            case sensorModuleConstants.SENSOR_TYPE_NXT_ULTRASONIC:
            case sensorModuleConstants.SENSOR_TYPE_ULTRASONIC:
                image             = 'images/ev3/ultrasonic.png';
                this._canSetValue = true;
                break;
            case sensorModuleConstants.SENSOR_TYPE_GYRO:
                image             = 'images/ev3/gyro.png';
                this._canSetValue = true;
                break;
            case sensorModuleConstants.SENSOR_TYPE_INFRARED:
                image             = 'images/ev3/infrared.png';
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

    onEvent(opts) {
        if ('device' in opts) {
            opts.type = opts.device;
        }
        super.onEvent(opts);
    }
};
