/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const BasicIOState = require('./../../lib/motor/io/BasicIOState').BasicIOState;

const MODE_OFF    = 0;
const MODE_ON     = 1;
const MODE_TARGET = 2;

exports.MotorState = class extends BasicIOState {
    setType(type) {
        super.setType(type & 1);
        this._rpm = [272, 105][type] || 0;
        return this._type;
    }
};
