/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const getImage = require('../../../../data/images').getImage;
const Motor    = require('./../../lib/motor/io/Motor').Motor;

exports.MotorLarge = class extends Motor {
    constructor(opts) {
        opts.image = 'images/spike/motorLarge64.png';
        super(opts);
        let layer = opts.layer;
        let id    = opts.id;
        this._device
            .addEventListener('Spike.Connecting',                                this, this.onConnecting)
            .addEventListener('Spike.Disconnected',                              this, this.onDisconnected)
            .addEventListener('Spike.Layer' + layer + 'Motor' + id + 'Changed',  this, this.onValueChanged)
            .addEventListener('Spike.Layer' + layer + 'Motor' + id + 'Assigned', this, this.onAssigned);
    }

    onChangeType(type) {
    }

    onAssigned(assignment) {
    }
};
