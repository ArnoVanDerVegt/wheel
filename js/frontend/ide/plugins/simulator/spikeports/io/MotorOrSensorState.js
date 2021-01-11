/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const BasicIOState = require('./../../lib/motor/io/BasicIOState').BasicIOState;
const deviceInfo   = require('./constants').deviceInfo;

const MODE_OFF    = 0;
const MODE_ON     = 1;
const MODE_TARGET = 2;

exports.MotorOrSensorState = class extends BasicIOState {
    setType(type) {
        super.setType(type);
        this._isMotor   = (type in deviceInfo) && deviceInfo[type].motor;
        this._connected = this._device.getConnected();
        if ((type in deviceInfo) || ([0, 1].indexOf(type) !== -1)) {
            this._type = type;
        } else {
            this._type = -1;
        }
        this._rpm = 272;
        return this;
    }
};
