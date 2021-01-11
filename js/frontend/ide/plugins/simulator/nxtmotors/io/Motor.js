/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const getImage = require('../../../../data/images').getImage;
const Motor    = require('./../../lib/motor/io/Motor').Motor;

exports.Motor = class extends Motor {
    constructor(opts) {
        opts.image  = 'images/nxt/motor64.png';
        opts.signal = {
            connecting:   'NXT.Connecting',
            disconnected: 'NXT.Disconnected',
            changed:      'NXT.Layer' + opts.layer + 'Motor' + opts.id + 'Changed'
        };
        super(opts);
        this._state.setType(0);
    }

    onChangeType() {
        this._imageElement.style.display    = 'block';
        this._positionElement.style.display = 'block';
        this._speedElement.style.display    = 'block';
        this._imageElement.src              = getImage('images/nxt/motor64.png');
    }
};
