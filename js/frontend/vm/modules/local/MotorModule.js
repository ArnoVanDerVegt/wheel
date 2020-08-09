/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const motorModuleConstants = require('../../../../shared/vm/modules/motorModuleConstants');
const VMModule             = require('./../VMModule').VMModule;

exports.MotorModule = class extends VMModule {
    run(commandId) {
        let vm     = this._vm;
        let vmData = this._vmData;
        let motor;
        switch (commandId) {
            case motorModuleConstants.MOTOR_SET_TYPE:
                this.emit('Motor.SetType', vmData.getRecordFromSrcOffset(['layer', 'id', 'type']));
                break;
            case motorModuleConstants.MOTOR_SET_SPEED:
                this.emit('Motor.SetSpeed', vmData.getRecordFromSrcOffset(['layer', 'id', 'speed']));
                break;
            case motorModuleConstants.MOTOR_SET_BRAKE:
                this.emit('Motor.SetBrake', vmData.getRecordFromSrcOffset(['layer', 'id', 'brake']));
                break;
            case motorModuleConstants.MOTOR_GET_TYPE:
                motor          = vmData.getRecordFromSrcOffset(['layer', 'id']);
                motor.callback = (value) => {
                    if (!this._device().getConnected() && (value === -1)) {
                        vmData.setNumberAtRet(7);
                    } else {
                        vmData.setNumberAtRet(value);
                    }
                };
                this.emit('Motor.GetType', motor);
                break;
            case motorModuleConstants.MOTOR_RESET:
                this.emit('Motor.Reset', vmData.getRecordFromSrcOffset(['layer', 'id']));
                break;
            case motorModuleConstants.MOTOR_REVERSE:
                this.emit('Motor.Reverse', vmData.getRecordFromSrcOffset(['layer', 'id']));
                break;
            case motorModuleConstants.MOTOR_MOVE_TO:
                this.emit('Motor.MoveTo', vmData.getRecordFromSrcOffset(['layer', 'id', 'target']));
                break;
            case motorModuleConstants.MOTOR_MOVE_TO_BITS:
                break;
            case motorModuleConstants.MOTOR_ON:
                this.emit('Motor.On', vmData.getRecordFromSrcOffset(['layer', 'id']));
                break;
            case motorModuleConstants.MOTOR_TIME_ON:
                this.emit('Motor.TimeOn', vmData.getRecordFromSrcOffset(['layer', 'id', 'time']));
                break;
            case motorModuleConstants.MOTOR_STOP:
                this.emit('Motor.Stop', vmData.getRecordFromSrcOffset(['layer', 'id', 'brake']));
                break;
            case motorModuleConstants.MOTOR_READ:
                motor = vmData.getRecordFromSrcOffset(['layer', 'id']);
                motor.callback = function(value) { vmData.setNumberAtRet(value); };
                this.emit('Motor.Read', motor);
                break;
            case motorModuleConstants.MOTOR_READY:
                motor = vmData.getRecordFromSrcOffset(['layer', 'id']);
                motor.callback = function(value) { vmData.setNumberAtRet(value); };
                this.emit('Motor.Ready', motor);
                break;
            case motorModuleConstants.MOTOR_READY_BITS:
                motor = vmData.getRecordFromSrcOffset(['layer', 'bits']);
                motor.callback = function(value) { vmData.setNumberAtRet(value); };
                this.emit('Motor.ReadyBits', motor);
                break;
            case motorModuleConstants.MOTOR_THRESHOLD:
                this.emit('Motor.Threshold', vmData.getRecordFromSrcOffset(['layer', 'id', 'threshold']));
                break;
        }
    }
};
