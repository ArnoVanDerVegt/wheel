(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'vm.modules.MotorModule',
        wheel.Class(wheel.vm.modules.VMModule, function(supr) {
            /*this.init = function(opts) {
                supr(this, 'init', arguments);

                this._motors = opts.motors;
            };*/

            this.setMotors = function(motors) {
                this._motors = motors;
            };

            this.run = function(commandId) {
                var vmData = this._vmData;

                switch (commandId) {
                    case 0: // MOTOR_RESET
                        var resetRecord = vmData.getRecordFromAtOffset(['id']);
                        console.log(resetRecord);
                        break;

                    case 1: // MOTOR_MOVE_TO
                        var moveToRecord = vmData.getRecordFromAtOffset(['id', 'target', 'power']);
                        var motor        = this._motors.getMotor(moveToRecord.id - 1);
                        if (motor) {
                            motor.setPower(moveToRecord.power);
                            motor.setTarget(moveToRecord.target);
                        }
                        break;

                    case 2: // MOTOR_MOVE
                        var moveRecord = vmData.getRecordFromAtOffset(['id', 'power']);
                        console.log(moveRecord);
                        break;

                    case 3: // MOTOR_STOP
                        var stopRecord = vmData.getRecordFromAtOffset(['id']);
                        console.log(stopRecord);
                        break;

                    default:
                        console.error('Unknown drawing command "' + commandId + '".');
                        break;
                }

    /*
                var motor = this._motors.getMotor(v1);
                if (motor) {
                    vmData.setRegisterByName('REG_MOTOR_TARGET',     motor.getTarget());
                    vmData.setRegisterByName('REG_MOTOR_POSITION',     motor.getPosition());
                    vmData.setRegisterByName('REG_MOTOR_POWER',     motor.getPower());
                }
    */
            };
        })
    );
})();