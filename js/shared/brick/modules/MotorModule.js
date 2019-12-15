/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const motorModuleConstants = require('../../vm/modules/motorModuleConstants');
const BrickModule          = require('./BrickModule').BrickModule;

exports.MotorModule = class extends BrickModule {
    constructor(opts) {
        super(opts);
        this._timers = [[null, null, null, null], [null, null, null, null]];
    }

    clearStopTimer(layer, id) {
        if (this._timers[layer][id]) {
            clearTimeout(this._timers[layer][id]);
            this._timers[layer][id] = null;
        }
    }

    setStopTimer(layer, id, time) {
        let times = this._timers;
        if (timers[layer][id]) {
            clearTimeout(this._timers[layer][id]);
        }
        let brick = this._brick;
        timers[layer][id] = setTimeout(
            function() {
                timers[layer][id] = null;
                brick.motorStop(layer, id);
            },
            time
        );
    }

    run(commandId, data) {
        if ((data.layer < 0) || (data.layer > 1) || (data.id < 0) || (data.id > 3)) {
            return;
        }
        switch (commandId) {
            case motorModuleConstants.MOTOR_SET_TYPE:
                break;
            case motorModuleConstants.MOTOR_SET_SPEED:
                break;
            case motorModuleConstants.MOTOR_RESET:
                break;
            case motorModuleConstants.MOTOR_MOVE_TO:
                this.clearStopTimer(data.layer, data.id);
                this._brick.motorDegrees(data.layer, data.id, data.speed, data.degrees);
                break;
            case motorModuleConstants.MOTOR_ON:
                this.clearStopTimer(data.layer, data.id);
                this._brick.motorOn(data.layer, data.id, data.speed);
                break;
            case motorModuleConstants.MOTOR_TIME_ON:
                this.clearStopTimer(data.layer, data.id);
                this._brick.motorOn(data.layer, data.id, data.speed);
                this.setStopTimer(data.layer, data.id, data.time);
                break;
            case motorModuleConstants.MOTOR_STOP:
                this.clearStopTimer(data.layer, data.id);
                this._brick.motorStop(data.layer, data.id, data.brake);
                break;
            case motorModuleConstants.MOTOR_READ:
                break;
            case motorModuleConstants.MOTOR_READY:
                break;
        }
    }
};
