/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const BasicIOState = require('./../../lib/motor/io/BasicIOState').BasicIOState;

const MODE_OFF    = 0;
const MODE_ON     = 1;
const MODE_TARGET = 2;

exports.MotorState = class extends BasicIOState {
    getIsValidType(type) {
        console.log('valid?', type);
        return (type === 7) || (type === 8);
    }

    setType(type) {
        switch (type) {
            case 7: this._rpm = 101; break; // Large Motor
            case 8: this._rpm = 272; break; // Medium Motor
        }
        return super.setType(type);
    }
};
