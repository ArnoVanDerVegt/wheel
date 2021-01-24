/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const motorModuleConstants = require('../vm/modules/motorModuleConstants');
const BasicDeviceModule    = require('./BasicDeviceModule').BasicDeviceModule;

exports.MotorModule = class extends BasicDeviceModule {
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
        let device = this._device;
        if ((data.layer < 0) || (data.layer >= device.getLayerCount()) || (data.id < 0) || (data.id >= device.getPortsPerLayer())) {
            return;
        }
        switch (commandId) {
            case motorModuleConstants.MOTOR_SET_TYPE:
                break;
            case motorModuleConstants.MOTOR_SET_SPEED:
                break;
            case motorModuleConstants.MOTOR_RESET:
                device.motorReset(data.layer, data.id);
                break;
            case motorModuleConstants.MOTOR_REVERSE:
                device.motorReverse(data.layer, data.id);
                break;
            case motorModuleConstants.MOTOR_MOVE_TO:
                this.clearStopTimer(data.layer, data.id);
                device.motorDegrees(
                    data.layer,
                    data.id, data.speed, data.brake,
                    data.degrees
                );
                break;
            case motorModuleConstants.MOTOR_MOVE_TO_BITS:
                // Todo
                break;
            case motorModuleConstants.MOTOR_ON:
                this.clearStopTimer(data.layer, data.id);
                device.motorOn(data.layer, data.id, data.speed, data.brake);
                break;
            case motorModuleConstants.MOTOR_TIME_ON:
                this.clearStopTimer(data.layer, data.id);
                device.motorOn(data.layer, data.id, data.speed, data.brake);
                this.setStopTimer(data.layer, data.id, data.time);
                break;
            case motorModuleConstants.MOTOR_STOP:
                this.clearStopTimer(data.layer, data.id);
                device.motorStop(data.layer, data.id, data.brake);
                break;
            case motorModuleConstants.MOTOR_READ:
                break;
            case motorModuleConstants.MOTOR_READY:
                break;
            case motorModuleConstants.MOTOR_THRESHOLD:
                device.motorThreshold(data.layer, data.id, data.threshold);
                break;
        }
    }
};
