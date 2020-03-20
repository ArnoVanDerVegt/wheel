/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const getImage = require('../../../../data/images').getImage;
const Motor    = require('./../../lib/motor/io/Motor').Motor;

exports.Motor = class extends Motor {
    constructor(opts) {
        opts.image = 'images/ev3/motorMedium.png';
        super(opts);
        let layer = opts.layer;
        let id    = opts.id;
        this._device
            .addEventListener('EV3.Connecting',                                this, this.onConnecting)
            .addEventListener('EV3.Disconnected',                              this, this.onDisconnected)
            .addEventListener('EV3.Layer' + layer + 'Motor' + id + 'Changed',  this, this.onValueChanged)
            .addEventListener('EV3.Layer' + layer + 'Motor' + id + 'Assigned', this, this.onAssigned);
    }

    onChangeType(type) {
        if ([7, 8].indexOf(type) !== -1) {
            type -= 7;
        }
        let images = [
                'images/ev3/motorMedium.png',
                'images/ev3/motorLarge.png'
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

    onAssigned(assignment) {
        if (this._resetTimeout && (this.getType() !== assignment)) {
            clearTimeout(this._resetTimeout);
            this._resetTimeout = null;
        }
        let state = this._state;
        switch (assignment) {
            case 7: // Large Motor
                state.setType(1);
                break;
            case 8: // Medium Motor
                state.setType(0);
                break;
            default:
                this._resetTimeout = setTimeout(state.setType.bind(state, -1), 3000);
                break;
        }
    }
};
