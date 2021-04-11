/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const motorModuleConstants = require('../../../../../../shared/vm/modules/motorModuleConstants');
const getImage             = require('../../../../data/images').getImage;
const Motor                = require('./../../lib/motor/io/Motor').Motor;

exports.Motor = class extends Motor {
    constructor(opts) {
        opts.image  = 'images/nxt/motor64.png';
        opts.signal = {
            connecting:   'NXT.Connecting',
            disconnected: 'NXT.Disconnected',
            changed:      'NXT.Layer' + opts.layer + '.Motor.Changed' + opts.id
        };
        super(opts);
        this._state.on('Type',  this, this.onChangeType);
        this._state.on('Value', this, this.onChangeValue);
        this._state.setType(motorModuleConstants.MOTOR_LARGE);
    }

    onChangeType() {
        this._imageElement.style.display    = 'block';
        this._positionElement.style.display = 'block';
        this._speedElement.style.display    = 'block';
        this._imageElement.src              = getImage('images/nxt/motor64.png');
    }

    onChangeValue() {
        this._positionElement.innerHTML = this._state.getPosition();
    }
};
