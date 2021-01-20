/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const motorModuleConstants = require('../../../../../../shared/vm/modules/motorModuleConstants');
const BasicIOState         = require('../../lib/motor/io/BasicIOState').BasicIOState;

exports.MotorState = class extends BasicIOState {
    getIsValidType(type) {
        return (type === motorModuleConstants.MOTOR_LARGE) || (type === motorModuleConstants.MOTOR_MEDIUM);
    }

    getIsValidMotor() {
        return this.getIsValidType(this._type);
    }

    setType(type) {
        switch (type) {
            case motorModuleConstants.MOTOR_LARGE:  this._rpm = 101; break;
            case motorModuleConstants.MOTOR_MEDIUM: this._rpm = 272; break;
        }
        return super.setType(type);
    }
};
