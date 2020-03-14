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
            this.createLayer(),
            this.createLayer(),
            this.createLayer(),
            this.createLayer()
        ];
    }

    createLayer() {
        return [
            this.createMotor(),
            this.createMotor(),
            this.createMotor(),
            this.createMotor()
        ];
    }

    createMotor() {
        return {
            target: null,
            time:   null
        };
    }

    getLayerAndIdValid(layer, id) {
        return ((layer >= 0) && (layer <= 3)) && ((id >= 0) && (id <= 3));
    }

    getMotorState(layer, id) {
        if (!this._layers[layer][id]) {
            this._layers[layer][id] = {};
        }
        return this._layers[layer][id];
    }

    getMotorPort(layer, id) {
        let layerState = this._device().getLayerState(layer);
        return layerState.getMotorPort(id);
    }

    getCurrentMotorPosition(layer, id) {
        return this.getLayerAndIdValid(layer, id) ? this.getMotorPort(layer, id).degrees : 0;
    }

    getMotorReady(layer, id) {
        let port = this.getMotorPort(layer, id);
        if ('ready' in port) {
            return port.ready;
        }
        let motorState = this.getMotorState(layer, id);
        let position   = port.value;
        return (Math.abs(position - motorState.target) < 15) ? 1 : 0;
    }

    resetMotorPosition(motor) {
        let device = this._device();
        let vm     = this._vm;
        device.module(motorModuleConstants.MODULE_MOTOR, motorModuleConstants.MOTOR_RESET, motor);
        let callback = (function() {
                vm.sleep(1000);
                if (!device.getQueueLength()) {
                    let port = this.getMotorPort(motor.layer, motor.id);
                    if (port.degrees === 0) {
                        return;
                    }
                }
                setTimeout(callback, 1);
            }).bind(this);
        callback();
    }

    waitForQueue() {
        let device = this._device();
        let vm     = this._vm;
        vm.sleep(1000);
        const callback = function() {
                if (device.getQueueLength()) {
                    vm.sleep(1000);
                    setTimeout(callback, 1);
                } else {
                    vm.sleep(0);
                }
            };
        callback();
    }

    callModule(commandId, signal, motor) {
        if (signal) {
            this.emit(signal, motor);
        }
        this._device().module(motorModuleConstants.MODULE_MOTOR, commandId, motor);
        this.waitForQueue();
    }

    run(commandId) {
        let vm     = this._vm;
        let vmData = this._vmData;
        let motor;
        let motors;
        let motorState;
        let motorTargets;
        let layerState;
        let value;
        switch (commandId) {
            case motorModuleConstants.MOTOR_SET_TYPE:
                motor = vmData.getRecordFromSrcOffset(['layer', 'id', 'type']);
                if (this.getLayerAndIdValid(motor.layer, motor.id)) {
                    motorState        = this.getMotorState(motor.layer, motor.id);
                    motorState.type   = motor.type;
                    this.emit('Motor.SetType', motor);
                }
                break;
            case motorModuleConstants.MOTOR_SET_SPEED:
                motor = vmData.getRecordFromSrcOffset(['layer', 'id', 'speed']);
                if (this.getLayerAndIdValid(motor.layer, motor.id)) {
                    motorState        = this.getMotorState(motor.layer, motor.id);
                    motorState.speed  = motor.speed;
                    this.emit('Motor.SetSpeed', motor);
                }
                break;
            case motorModuleConstants.MOTOR_SET_BRAKE:
                motor = vmData.getRecordFromSrcOffset(['layer', 'id', 'brake']);
                if (this.getLayerAndIdValid(motor.layer, motor.id)) {
                    motorState       = this.getMotorState(motor.layer, motor.id);
                    motorState.brake = motor.brake;
                    this.emit('Motor.SetBrake', motor);
                }
                break;
            case motorModuleConstants.MOTOR_GET_TYPE:
                motor          = vmData.getRecordFromSrcOffset(['layer', 'id']);
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
                motor = vmData.getRecordFromSrcOffset(['layer', 'id']);
                if (this.getLayerAndIdValid(motor.layer, motor.id)) {
                    motorState        = this.getMotorState(motor.layer, motor.id);
                    motorState.target = 0;
                    this.resetMotorPosition(motor);
                }
                break;
            case motorModuleConstants.MOTOR_MOVE_TO:
                motor = vmData.getRecordFromSrcOffset(['layer', 'id', 'target']);
                if (this.getLayerAndIdValid(motor.layer, motor.id)) {
                    motorState        = this.getMotorState(motor.layer, motor.id);
                    motorState.target = motor.target;
                    motorState.time   = 0;
                    motor.speed       = Math.abs(motorState.speed || 0);
                    motor.brake       = motorState.brake;
                    motor.degrees     = motor.target - this.getCurrentMotorPosition(motor.layer, motor.id);
                    this.callModule(motorModuleConstants.MOTOR_MOVE_TO, 'Motor.MoveTo', motor);
                }
                break;
            case motorModuleConstants.MOTOR_ON:
                motor = vmData.getRecordFromSrcOffset(['layer', 'id']);
                if (this.getLayerAndIdValid(motor.layer, motor.id)) {
                    motorState        = this.getMotorState(motor.layer, motor.id);
                    motorState.target = null;
                    motorState.time   = null;
                    motor.speed       = motorState.speed || 0;
                    motor.brake       = motorState.brake;
                    this.callModule(motorModuleConstants.MOTOR_ON, 'Motor.On', motor);
                }
                break;
            case motorModuleConstants.MOTOR_TIME_ON:
                motor = vmData.getRecordFromSrcOffset(['layer', 'id', 'time']);
                if (this.getLayerAndIdValid(motor.layer, motor.id)) {
                    motorState        = this.getMotorState(motor.layer, motor.id);
                    motorState.target = null;
                    motorState.time   = null;
                    motor.speed       = motorState.speed || 0;
                    this.callModule(motorModuleConstants.MOTOR_TIME_ON, 'Motor.TimeOn', motor);
                }
                break;
            case motorModuleConstants.MOTOR_STOP:
                motor = vmData.getRecordFromSrcOffset(['layer', 'id']);
                if (this.getLayerAndIdValid(motor.layer, motor.id)) {
                    motorState        = this.getMotorState(motor.layer, motor.id);
                    motorState.target = null;
                    motorState.time   = null;
                    motor.brake       = motorState.brake;
                    this.callModule(motorModuleConstants.MOTOR_STOP, 'Motor.Stop', motor);
                }
                break;
            case motorModuleConstants.MOTOR_READ:
                motor = vmData.getRecordFromSrcOffset(['layer', 'id']);
                value = 0;
                if (this.getLayerAndIdValid(motor.layer, motor.id)) {
                    value = this.getMotorPort(motor.layer, motor.id).degrees;
                }
                vmData.setNumberAtRet(value);
                break;
            case motorModuleConstants.MOTOR_READY:
                motor = vmData.getRecordFromSrcOffset(['layer', 'id']);
                if (this.getLayerAndIdValid(motor.layer, motor.id)) {
                    vmData.setNumberAtRet(this.getMotorReady(motor.layer, motor.id));
                } else {
                    vmData.setNumberAtRet(0);
                }
                break;
            case motorModuleConstants.MOTOR_READY_BITS:
                motor = vmData.getRecordFromSrcOffset(['layer', 'bits']);
                value = 1;
                if ((motor.layer >= 0) && (motor.layer <= 3)) {
                    let bit = 1;
                    for (let i = 0; i < 4; i++) {
                        if (((motor.bits & bit) === bit) && !this.getMotorReady(motor.layer, i, true)) {
                            value = 0;
                            break;
                        }
                        bit <<= 1;
                    }
                    vmData.setNumberAtRet(value);
                } else {
                    vmData.setNumberAtRet(0);
                }
                break;
            case motorModuleConstants.MOTOR_THRESHOLD:
                motor = vmData.getRecordFromSrcOffset(['layer', 'id', 'threshold']);
                if (this.getLayerAndIdValid(motor.layer, motor.id)) {
                    this.callModule(motorModuleConstants.MOTOR_THRESHOLD, 'Motor.Threshold', motor);
                }
                break;
        }
    }
};
