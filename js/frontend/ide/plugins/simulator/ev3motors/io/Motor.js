/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const motorModuleConstants = require('../../../../../../shared/vm/modules/motorModuleConstants');
const getImage             = require('../../../../data/images').getImage;
const Motor                = require('../../lib/motor/io/Motor').Motor;
const MotorState           = require('./MotorState').MotorState;

exports.Motor = class extends Motor {
    constructor(opts) {
        opts.MotorState = MotorState;
        opts.image      = 'images/ev3/motorMedium64.png';
        opts.signal     = {
            connecting:   'EV3.Connecting',
            disconnected: 'EV3.Disconnected',
            assigned:     'EV3.Layer' + opts.layer + 'Motor' + opts.id + 'Assigned',
            changed:      'EV3.Layer' + opts.layer + 'Motor' + opts.id + 'Changed'
        };
        super(opts);
        this._state.on('Type',  this, this.onChangeType);
        this._state.on('Value', this, this.onChangeValue);
    }

    onChangeType() {
        let type = this._state.getType();
        if ([motorModuleConstants.MOTOR_LARGE, motorModuleConstants.MOTOR_MEDIUM].indexOf(type) !== -1) {
            type -= motorModuleConstants.MOTOR_LARGE;
        }
        let images = [
                'images/ev3/motorLarge64.png',
                'images/ev3/motorMedium64.png'
            ];
        if (images[type]) {
            this._imageElement.style.display    = 'block';
            this._positionElement.style.display = 'block';
            this._speedElement.style.display    = 'block';
            this._imageElement.src              = getImage(images[type]);
        } else {
            this._imageElement.style.display    = 'none';
            this._positionElement.style.display = 'none';
            this._speedElement.style.display    = 'none';
        }
    }

    onChangeValue() {
        this._positionElement.innerHTML = this._state.getPosition();
    }
};
