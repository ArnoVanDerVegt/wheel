/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const motorModuleConstants = require('../../../../shared/vm/modules/motorModuleConstants');
const VMModule             = require('./../VMModule').VMModule;

exports.MotorModule = class extends VMModule {
    constructor(opts) {
        super(opts);
        this._layers = [];
    }

    createMotor() {
        return {
            degrees:       0,
            assigned:      0,
            startDegrees:  0,
            targetDegrees: 0,
            brake:         0,
            speed:         0,
            time:          null
        };
    }

    getLayerAndIdValid(motor) {
        return ((motor.layer >= 0) && (motor.layer <= 3)) && ((motor.id >= 0) && (motor.id <= 3));
    }

    getMotorPort(motor) {
        if (this._device) {
            let device = this._device();
            if (device) {
                return device.getLayerState(motor.layer).getMotorPort(motor.id);
            }
        }
        if (!this._layers[motor.layer]) {
            this._layers[motor.layer] = [];
        }
        if (!this._layers[motor.layer][motor.id]) {
            this._layers[motor.layer][motor.id] = this.createMotor();
        }
        return this._layers[motor.layer][motor.id];
    }

    getMotorReady(motor) {
        let port   = this.getMotorPort(motor);
        let result = false;
        if (port.ready) {
            result = true;
        } else if (port.startDegrees < port.targetDegrees) {
            result = (port.degrees >= port.targetDegrees) || (Math.abs(port.degrees - port.targetDegrees) < 15);
        } else {
            result = (port.degrees <= port.targetDegrees) || (Math.abs(port.degrees - port.targetDegrees) < 15);
        }
        return result ? 1 : 0;
    }

    resetMotorPosition(motor) {
        let device = this._device();
        let vm     = this._vm;
        device.module(motorModuleConstants.MODULE_MOTOR, motorModuleConstants.MOTOR_RESET, motor);
        let callback = (function() {
                vm.sleep(50);
                if (!device.getQueueLength()) {
                    let port = this.getMotorPort(motor);
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
        let motorPort;
        let motor;
        let value;
        switch (commandId) {
            case motorModuleConstants.MOTOR_SET_TYPE:
                motor = vmData.getRecordFromSrcOffset(['layer', 'id', 'type']);
                if (this.getLayerAndIdValid(motor)) {
                    this.emit('Motor.SetType', motor);
                }
                break;
            case motorModuleConstants.MOTOR_SET_SPEED:
                motor = vmData.getRecordFromSrcOffset(['layer', 'id', 'speed']);
                if (this.getLayerAndIdValid(motor)) {
                    this.getMotorPort(motor).speed = motor.speed;
                    this.emit('Motor.SetSpeed', motor);
                }
                break;
            case motorModuleConstants.MOTOR_SET_BRAKE:
                motor = vmData.getRecordFromSrcOffset(['layer', 'id', 'brake']);
                if (this.getLayerAndIdValid(motor)) {
                    this.getMotorPort(motor).brake = motor.brake;
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
                if (this.getLayerAndIdValid(motor)) {
                    this.resetMotorPosition(motor);
                }
                break;
            case motorModuleConstants.MOTOR_MOVE_TO:
                motor = vmData.getRecordFromSrcOffset(['layer', 'id', 'target']);
                if (this.getLayerAndIdValid(motor)) {
                    motorPort               = this.getMotorPort(motor);
                    motorPort.startDegrees  = motorPort.degrees;
                    motorPort.targetDegrees = motor.target;
                    motor.speed             = Math.abs(motorPort.speed || 0);
                    motor.brake             = motorPort.brake;
                    motor.degrees           = motor.target - motorPort.degrees;
                    this.callModule(motorModuleConstants.MOTOR_MOVE_TO, 'Motor.MoveTo', motor);
                }
                break;
            case motorModuleConstants.MOTOR_ON:
                motor = vmData.getRecordFromSrcOffset(['layer', 'id']);
                if (this.getLayerAndIdValid(motor)) {
                    motorPort   = this.getMotorPort(motor);
                    motor.speed = motorState.speed || 0;
                    motor.brake = motorState.brake;
                    this.callModule(motorModuleConstants.MOTOR_ON, 'Motor.On', motor);
                }
                break;
            case motorModuleConstants.MOTOR_TIME_ON:
                motor = vmData.getRecordFromSrcOffset(['layer', 'id', 'time']);
                if (this.getLayerAndIdValid(motor)) {
                    motorPort   = this.getMotorPort(motor);
                    motor.speed = motorState.speed || 0;
                    motor.brake = motorState.brake;
                    this.callModule(motorModuleConstants.MOTOR_TIME_ON, 'Motor.TimeOn', motor);
                }
                break;
            case motorModuleConstants.MOTOR_STOP:
                motor = vmData.getRecordFromSrcOffset(['layer', 'id']);
                if (this.getLayerAndIdValid(motor)) {
                    motorPort        = this.getMotorPort(motor);
                    motorPort.target = null;
                    motorPort.time   = null;
                    motor.brake      = motorState.brake;
                    this.callModule(motorModuleConstants.MOTOR_STOP, 'Motor.Stop', motor);
                }
                break;
            case motorModuleConstants.MOTOR_READ:
                motor = vmData.getRecordFromSrcOffset(['layer', 'id']);
                value = 0;
                if (this.getLayerAndIdValid(motor)) {
                    value = this.getMotorPort(motor).degrees;
                }
                vmData.setNumberAtRet(value);
                break;
            case motorModuleConstants.MOTOR_READY:
                motor = vmData.getRecordFromSrcOffset(['layer', 'id']);
                if (this.getLayerAndIdValid(motor)) {
                    vmData.setNumberAtRet(this.getMotorReady(motor));
                } else {
                    vmData.setNumberAtRet(0);
                }
                break;
            case motorModuleConstants.MOTOR_READY_BITS:
                this.waitForQueue();
                motor = vmData.getRecordFromSrcOffset(['layer', 'bits']);
                value = 1;
                if ((motor.layer >= 0) && (motor.layer <= 3)) {
                    let bit = 1;
                    for (let id = 0; id < 4; id++) {
                        motor.id = id;
                        if (((motor.bits & bit) === bit) && !this.getMotorReady(motor)) {
                            value = 0;
                            break;
                        }
                        bit <<= 1;
                    }
                    if (value) {
                        this._vm.sleep(100);
                    }
                    vmData.setNumberAtRet(value);
                } else {
                    vmData.setNumberAtRet(0);
                }
                break;
            case motorModuleConstants.MOTOR_THRESHOLD:
                motor = vmData.getRecordFromSrcOffset(['layer', 'id', 'threshold']);
                if (this.getLayerAndIdValid(motor)) {
                    this.callModule(motorModuleConstants.MOTOR_THRESHOLD, 'Motor.Threshold', motor);
                }
                break;
        }
    }
};
