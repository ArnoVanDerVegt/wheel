/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const motorModuleConstants = require('../../../../shared/vm/modules/motorModuleConstants');
const VMModule             = require('./../VMModule').VMModule;

exports.MotorModule = class extends VMModule {
    constructor(opts) {
        super(opts);
        this._layers = [
            [{target: null}, {target: null}, {target: null}, {target: null}],
            [{target: null}, {target: null}, {target: null}, {target: null}]
        ];
    }

    getLayerAndIdValid(layer, id) {
        return ((layer >= 0) && (layer <= 1)) && ((id >= 0) && (id <= 3));
    }

    getMotorStatus(layer, id) {
        if (!this.getLayerAndIdValid(layer, id)) {
            return {};
        }
        if (!this._layers[layer][id]) {
            this._layers[layer][id] = {};
        }
        return this._layers[layer][id];
    }

    getCurrentMotorPosition(layer, id) {
        if (this.getLayerAndIdValid(layer, id)) {
            let layerState = this._device().getLayerState(layer);
            return layerState.getMotors()[id];
        }
        return 0;
    }

    getMotorReady(layer, id) {
        let motorStatus = this.getMotorStatus(layer, id);
        if (this.getLayerAndIdValid(layer, id)) {
            let layerState = this._device().getLayerState(layer);
            let motors      = layerState.getMotors();
            if (motorStatus.target === null) {
                return 1;
            }
            return (Math.abs(motors[id] - motorStatus.target) < 10) ? 1 : 0;
        }
        return 0;
    }

    run(commandId) {
        let vm     = this._vm;
        let vmData = this._vmData;
        let motor;
        let motors;
        let motorStatus;
        let motorTargets;
        let layerState;
        let value;
        switch (commandId) {
            case motorModuleConstants.MOTOR_SET_TYPE:
                motor              = vmData.getRecordFromAtOffset(['layer', 'id', 'type']);
                motorStatus        = this.getMotorStatus(motor.layer, motor.id);
                motorStatus.type   = motor.type;
                this.emit('Motor.SetType', motor);
                break;
            case motorModuleConstants.MOTOR_SET_SPEED:
                motor              = vmData.getRecordFromAtOffset(['layer', 'id', 'speed']);
                motorStatus        = this.getMotorStatus(motor.layer, motor.id);
                motorStatus.speed  = motor.speed;
                this.emit('Motor.SetSpeed', motor);
                break;
            case motorModuleConstants.MOTOR_SET_BRAKE:
                motor              = vmData.getRecordFromAtOffset(['layer', 'id', 'brake']);
                motorStatus        = this.getMotorStatus(motor.layer, motor.id);
                motorStatus.brake  = motor.brake;
                this.emit('Motor.SetBrake', motor);
                break;
            case motorModuleConstants.MOTOR_GET_TYPE:
                motor          = vmData.getRecordFromAtOffset(['layer', 'id']);
                motor.callback = (function(value) {
                    if (!this._device().getConnected() && (value === -1)) {
                        vmData.setNumberAtRet(7);
                    } else if (value === -1) {
                        vmData.setNumberAtRet(0);
                    } else {
                        vmData.setNumberAtRet(7 + value);
                    }
                }).bind(this);
                this.emit('Motor.GetType', motor);
                break;
            case motorModuleConstants.MOTOR_RESET:
                motor              = vmData.getRecordFromAtOffset(['layer', 'id']);
                motorStatus        = this.getMotorStatus(motor.layer, motor.id);
                motorStatus.target = null;
                this.emit('Motor.Reset', motor);
                this._device().module(motorModuleConstants.MODULE_MOTOR, motorModuleConstants.MOTOR_RESET, motor);
                break;
            case motorModuleConstants.MOTOR_MOVE_TO:
                motor              = vmData.getRecordFromAtOffset(['layer', 'id', 'target']);
                motorStatus        = this.getMotorStatus(motor.layer, motor.id);
                motorStatus.target = motor.target;
                motor.speed        = motorStatus.speed || 0;
                motor.brake        = motorStatus.brake;
                if (this._device().getAbsolutePosition()) {
                    motor.degrees = motor.target;
                } else {
                    motor.degrees = motor.target - this.getCurrentMotorPosition(motor.layer, motor.id);
                }
                this.emit('Motor.MoveTo', motor);
                this._device().module(motorModuleConstants.MODULE_MOTOR, motorModuleConstants.MOTOR_MOVE_TO, motor);
                break;
            case motorModuleConstants.MOTOR_ON:
                motor              = vmData.getRecordFromAtOffset(['layer', 'id']);
                motorStatus        = this.getMotorStatus(motor.layer, motor.id);
                motorStatus.target = null;
                motor.speed        = motorStatus.speed || 0;
                motor.brake        = motorStatus.brake;
                this.emit('Motor.On', motor);
                this._device().module(motorModuleConstants.MODULE_MOTOR, motorModuleConstants.MOTOR_ON, motor);
                break;
            case motorModuleConstants.MOTOR_TIME_ON:
                motor              = vmData.getRecordFromAtOffset(['layer', 'id', 'time']);
                motorStatus        = this.getMotorStatus(motor.layer, motor.id);
                motorStatus.target = null;
                motor.speed        = motorStatus.speed || 0;
                this.emit('Motor.TimeOn', motor);
                this._device().module(motorModuleConstants.MODULE_MOTOR, motorModuleConstants.MOTOR_TIME_ON, motor);
                break;
            case motorModuleConstants.MOTOR_STOP:
                motor              = vmData.getRecordFromAtOffset(['layer', 'id']);
                motorStatus        = this.getMotorStatus(motor.layer, motor.id);
                motorStatus.target = null;
                motor.brake        = motorStatus.brake;
                this.emit('Motor.Stop', motor);
                this._device().module(motorModuleConstants.MODULE_MOTOR, motorModuleConstants.MOTOR_STOP, motor);
                break;
            case motorModuleConstants.MOTOR_READ:
                motor = vmData.getRecordFromAtOffset(['layer', 'id']);
                value = 0;
                if (((motor.layer >= 0) && (motor.layer <= 1)) && ((motor.id >= 0) && (motor.id <= 3))) {
                    layerState = this._device().getLayerState(motor.layer);
                    motors     = layerState.getMotors();
                    value      = motors[motor.id];
                }
                vmData.setNumberAtRet(value);
                break;
            case motorModuleConstants.MOTOR_READY:
                motor = vmData.getRecordFromAtOffset(['layer', 'id']);
                value = this.getMotorReady(motor.layer, motor.id);
                vmData.setNumberAtRet(value);
                break;
        }
    }
};
