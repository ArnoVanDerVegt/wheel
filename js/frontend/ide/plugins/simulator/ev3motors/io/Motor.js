/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Motor      = require('./../../lib/motor/io/Motor').Motor;
const MotorState = require('./MotorState').MotorState;
const getImage   = require('../../../../data/images').getImage;

exports.Motor = class extends Motor {
    constructor(opts) {
        opts.image = 'images/ev3/motorMedium.png';
        super(opts);
        this._device
            .addEventListener('EV3.Connecting',                                            this, this.onConnecting)
            .addEventListener('EV3.Disconnected',                                          this, this.onDisconnected)
            .addEventListener('EV3.Layer' + this._layer + 'Motor' + this._id + 'Changed',  this, this.onValueChanged)
            .addEventListener('EV3.Layer' + this._layer + 'Motor' + this._id + 'Assigned', this, this.onAssigned);
    }

    setType(type) {
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
            this._imageElement.src              = getImage(images[this._state.setType(type)]);
        } else {
            this._imageElement.style.display    = 'none';
            this._positionElement.style.display = 'none';
            this._speedElement.style.display    = 'none';
        }
        this._type = type;
    }

    onAssigned(assignment) {
        if (this._resetTimeout && (this.getType() !== assignment)) {
            clearTimeout(this._resetTimeout);
            this._resetTimeout = null;
        }
        switch (assignment) {
            case 7: // Large Motor
                this.setType(1);
                break;
            case 8: // Medium Motor
                this.setType(0);
                break;
            default:
                this._resetTimeout = setTimeout(
                    (function() {
                        this.setType(-1);
                    }).bind(this),
                    3000
                );
                break;
        }
    }
};
