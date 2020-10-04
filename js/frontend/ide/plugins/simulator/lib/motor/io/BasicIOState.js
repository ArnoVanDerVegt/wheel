/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const MODE_OFF    = 0;
const MODE_ON     = 1;
const MODE_TARGET = 2;

exports.MODE_OFF    = MODE_OFF;
exports.MODE_ON     = MODE_ON;
exports.MODE_TARGET = MODE_TARGET;

exports.BasicIOState = class {
    constructor(opts) {
        this.reset();
        this._connected        = !!opts.connected;
        this._settings         = opts.settings;
        this._device           = opts.device;
        this._layer            = opts.layer;
        this._id               = opts.id;
        this._getCurrentTime   = opts.getCurrentTime || (() => { return Date.now(); });
        this._onChangeConneced = opts.onChangeConnected;
        this._onChangeType     = opts.onChangeType;
        this._onChangeMode     = opts.onChangeMode;
        this._onChangeValue    = opts.onChangeValue;
        this._value            = 0;
        this._timeoutReset     = null;
    }

    reset() {
        this._motorMode      = MODE_OFF;
        this._speed          = 100;
        this._isMotor        = true;
        this._type           = 0;
        this._mode           = 0;
        this._rpm            = 272;
        this._position       = 0;
        this._romotePosition = 0;
        this._target         = null;
        this._lastTime       = null;
        return this;
    }

    getLayer() {
        return this._layer;
    }

    getId() {
        return this._id;
    }

    getConnected() {
        return this._connected;
    }

    setConnected(connected) {
        this._connected = connected;
        this._onChangeConneced(connected);
    }

    getType() {
        return this._type;
    }

    setType(type) {
        this._type = type;
        this._rpm  = [272, 105][type] || 272;
        this._onChangeType(type);
        return this;
    }

    getMode() {
        return this._mode;
    }

    setMode(mode) {
        this._mode = mode;
        this._onChangeMode(mode);
        return this;
    }

    getValue() {
        return this._value;
    }

    setValue(value) {
        this._value = value;
        this._onChangeValue(value);
        this.setTimeoutReset();
    }

    setTimeoutReset() {
        if (!this._settings.getSensorAutoReset()) {
            return;
        }
        if (this._timeoutReset) {
            clearTimeout(this._timeoutReset);
        }
        this._timeoutReset = setTimeout(this.onResetTimeout.bind(this), 1500);
    }

    getIsMotor() {
        return this._isMotor;
    }

    setIsMotor(isMotor) {
        this._isMotor = isMotor;
        return this;
    }

    getTarget() {
        return this._target;
    }

    setTarget(target) {
        this._target    = target;
        this._motorMode = MODE_TARGET;
        return this;
    }

    getSpeed() {
        return this._speed;
    }

    setSpeed(speed) {
        speed       = Math.max(Math.min(speed, 100), -100);
        this._speed = speed;
        return speed;
    }

    getMotorMode() {
        return this._motorMode;
    }

    getPosition() {
        return Math.round(this._position);
    }

    setPosition(position) {
        this._position = position;
    }

    setOn(on) {
        this._target    = null;
        this._motorMode = on ? MODE_ON : MODE_OFF;
        return this;
    }

    onResetTimeout() {
        this._timeoutReset = null;
        this._value        = 0;
        this._onChangeValue(0);
    }

    ready() {
        return ((this._target === null) || Math.abs(this._target - this._position) < 10) ? 1 : 0;
    }

    updateSimulatedMotor() {
        if (this._device && this._device.getConnected()) {
            return false;
        }
        if (this._lastTime === null) {
            this._lastTime = this._getCurrentTime();
            return false;
        }
        let position      = this._position;
        let time          = this._getCurrentTime();
        let deltaTime     = time - this._lastTime;
        let deltaPosition = deltaTime / 1000 * this._rpm / 60 * this._speed;
        this._lastTime = time;
        switch (this._motorMode) {
            case MODE_ON:
                this._position = Math.round(position + deltaPosition);
                break;
            case MODE_TARGET:
                if (this._position < this._target) {
                    this._position += Math.abs(deltaPosition);
                    if (this._position >= this._target) {
                        this._position  = this._target;
                        this._motorMode = MODE_OFF;
                    }
                } else if (this._position > this._target) {
                    this._position -= Math.abs(deltaPosition);
                    if (this._position <= this._target) {
                        this._position  = this._target;
                        this._motorMode = MODE_OFF;
                    }
                } else {
                    this._motorMode = MODE_OFF;
                }
                break;
        }
        return (this._position !== position);
    }
};
