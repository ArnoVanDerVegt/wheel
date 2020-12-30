/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const getImage = require('../../../../data/images').getImage;
const Motor    = require('./../../lib/motor/io/Motor').Motor;

exports.Motor = class extends Motor {
    constructor(opts) {
        opts.image = 'images/nxt/motor64.png';
        super(opts);
        let layer = opts.layer;
        let id    = opts.id;
        this._device.addEventListener('NXT.Layer' + layer + 'Motor' + id + 'Changed', this, this.onValueChanged);
        this._state.setType(0);
    }

    onChangeType(type) {
        this._imageElement.style.display    = 'block';
        this._positionElement.style.display = 'block';
        this._speedElement.style.display    = 'block';
        this._imageElement.src              = getImage('images/nxt/motor64.png');
    }

    onAssigned(assignment) {
    }
};
