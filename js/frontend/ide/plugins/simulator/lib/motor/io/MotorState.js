/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const MODE_OFF    = 0;
const MODE_ON     = 1;
const MODE_TARGET = 2;

exports.MotorState = class {
    constructor(opts) {
        this.reset();
        this._device = opts.device;
        this._layer  = opts.layer;
        this._id     = opts.id;
    }

    reset() {
        this._mode           = MODE_OFF;
        this._speed          = 100;
        this._type           = 0;
        this._rpm            = 272;
        this._position       = 0;
        this._romotePosition = 0;
        this._target         = null;
        this._lastTime       = null;
    }

    getType() {
        return this._type;
    }

    setType(type) {
        type = (type & 1);
        this._type = type;
        this._rpm  = [272, 105][type];
        return this._type;
    }

    getTarget() {
        return this._target;
    }

    setTarget(target) {
        this._target = target;
        this._mode   = MODE_TARGET;
    }

    getSpeed() {
        return this._speed;
    }

    setSpeed(speed) {
        speed       = Math.max(Math.min(speed, 100), -100);
        this._speed = speed;
        return speed;
    }

    getPosition() {
        return Math.round(this._position);
    }

    setPosition(position) {
        this._position = position;
    }

    setOn(on) {
        this._target = null;
        this._mode   = on ? MODE_ON : MODE_OFF;
    }

    ready() {
        return ((this._target === null) || Math.abs(this._target - this._position) < 10) ? 1 : 0;
    }

    update() {
        if (this._device && this._device.getConnected()) {
            return false;
        }
        if (this._lastTime === null) {
            this._lastTime = Date.now();
            return false;
        }
        let position      = this._position;
        let time          = Date.now();
        let deltaTime     = time - this._lastTime;
        let deltaPosition = deltaTime / 1000 * this._rpm / 60 * this._speed;
        this._lastTime = time;
        switch (this._mode) {
            case MODE_ON:
                this._position = Math.round(position + deltaPosition);
                break;
            case MODE_TARGET:
                if (this._position < this._target) {
                    this._position += Math.abs(deltaPosition);
                    if (this._position >= this._target) {
                        this._position = this._target;
                        this._mode     = MODE_OFF;
                    }
                } else if (this._position > this._target) {
                    this._position -= Math.abs(deltaPosition);
                    if (this._position <= this._target) {
                        this._position = this._target;
                        this._mode     = MODE_OFF;
                    }
                } else {
                    this._mode = MODE_OFF;
                }
                break;
        }
        return (this._position !== position);
    }
};
