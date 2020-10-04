/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const poweredUpModuleConstants = require('../../../../shared/vm/modules/poweredUpModuleConstants');
const BasicIODevice            = require('./BasicIODevice').BasicIODevice;

exports.PoweredUpDevice = class extends BasicIODevice {
    constructor(opts) {
        super(opts);
        this._colorMode = false;
        this
            .setValueVisible(false)
            .setReadyVisible(false)
            .setSpeedVisible(false)
            .setColorVisible(false)
            .setPort(opts.port || 0);
        this.setDevice(opts.device || poweredUpModuleConstants.POWERED_UP_DEVICE_BASIC_MOTOR);
        this.setValue(0);
    }

    setDevice(device) {
        this._canSetSpeed = true;
        this._canSetValue = true;
        this._canSetReady = true;
        this._canSetColor = false;
        let image = false;
        this._device = device;
        switch (device) {
            case poweredUpModuleConstants.POWERED_UP_DEVICE_BASIC_MOTOR:
                image             = 'images/poweredup/motor64.png';
                this._canSetValue = false;
                this._canSetReady = false;
                break;
            case poweredUpModuleConstants.POWERED_UP_DEVICE_TRAIN_MOTOR:
                image = 'images/poweredup/train64.png';
                this._canSetValue = false;
                this._canSetReady = false;
                break;
            case poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_TACHO_MOTOR:
                image             = 'images/poweredup/motorM64.png';
                break;
            case poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_MOVE_HUB_MOTOR:
                image             = 'images/poweredup/moveHub64.png';
                break;
            case poweredUpModuleConstants.POWERED_UP_DEVICE_CONTROL_PLUS_LARGE_MOTOR:
                image             = 'images/poweredup/motorL64.png';
                break;
            case poweredUpModuleConstants.POWERED_UP_DEVICE_CONTROL_PLUS_XLARGE_MOTOR:
                image             = 'images/poweredup/motorXl64.png';
                break;
            case poweredUpModuleConstants.POWERED_UP_DEVICE_LED_LIGHTS:
                image             = 'images/poweredup/light64.png';
                this._canSetValue = false;
                this._canSetReady = false;
                break;
            case poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_DISTANCE:
                image = 'images/poweredup/lightSensor64.png';
                this._canSetReady = false;
                this._canSetSpeed = false;
                this._canSetColor = this._colorMode;
                this._canSetValue = !this._colorMode;
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
        if (this._colorMode && this._canSetColor) {
            this.setValueVisible(false);
            super.setColor(value);
        } else {
            this.setValueVisible(true);
            super.setValue(value);
        }
    }

    onEvent(opts) {
        super.onEvent(opts);
        if ('colorMode' in opts) {
            this._canSetColor = (this._type === poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_DISTANCE);
            this._colorMode   = !!opts.colorMode;
            let color = this._colorMode && this._canSetColor;
            this
                .setValueVisible(!color)
                .setColorVisible(color);
        }
    }
};

exports.Component = exports.PoweredUpDevice;
