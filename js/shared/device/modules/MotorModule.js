/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const motorModuleConstants = require('../../vm/modules/motorModuleConstants');
const DeviceModule         = require('./DeviceModule').DeviceModule;

exports.MotorModule = class extends DeviceModule {
    constructor(opts) {
        super(opts);
        this._timers = [];
    }

    clearStopTimer(layer, id) {
        let timers = this.getStopTimer(layer);
        if (timers[id]) {
            clearTimeout(timers[id]);
            timers[id] = null;
        }
    }

    getStopTimer(layer) {
        if (!this._timers[layer]) {
            this._timers[layer] = [null, null, null, null];
        }
        return this._timers[layer];
    }

    setStopTimer(layer, id, time) {
        let timers = getStopTimer(layer);
        if (timers[id]) {
            clearTimeout(timers[id]);
        }
        let device = this._device;
        timers[id] = setTimeout(
            function() {
                timers[id] = null;
                device.motorStop(layer, id);
            },
            time
        );
    }

    run(commandId, data) {
        if ((data.layer < 0) || (data.layer >= this._device.getLayerCount()) || (data.id < 0) || (data.id > 3)) {
            return;
        }
        switch (commandId) {
            case motorModuleConstants.MOTOR_SET_TYPE:
                break;
            case motorModuleConstants.MOTOR_SET_SPEED:
                break;
            case motorModuleConstants.MOTOR_RESET:
                this._device.motorReset(data.layer, data.id);
                break;
            case motorModuleConstants.MOTOR_REVERSE:
                this._device.motorReverse(data.layer, data.id);
                break;
            case motorModuleConstants.MOTOR_MOVE_TO:
                this.clearStopTimer(data.layer, data.id);
                this._device.motorDegrees(data.layer, data.id, data.speed, data.degrees, data.brake);
                break;
            case motorModuleConstants.MOTOR_MOVE_TO_BITS:
                break;
            case motorModuleConstants.MOTOR_ON:
                this.clearStopTimer(data.layer, data.id);
                this._device.motorOn(data.layer, data.id, data.speed, data.brake);
                break;
            case motorModuleConstants.MOTOR_TIME_ON:
                this.clearStopTimer(data.layer, data.id);
                this._device.motorOn(data.layer, data.id, data.speed, data.brake);
                this.setStopTimer(data.layer, data.id, data.time);
                break;
            case motorModuleConstants.MOTOR_STOP:
                this.clearStopTimer(data.layer, data.id);
                this._device.motorStop(data.layer, data.id, data.brake);
                break;
            case motorModuleConstants.MOTOR_READ:
                break;
            case motorModuleConstants.MOTOR_READY:
                break;
            case motorModuleConstants.MOTOR_THRESHOLD:
                this._device.motorThreshold(data.layer, data.id, data.threshold);
                break;
        }
    }
};
