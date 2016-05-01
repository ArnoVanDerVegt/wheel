wheel(
	'vm.modules.DebugModule',
	Class(wheel.vm.modules.VMModule, function(supr) {
		this.run = function(commandId) {
			var vmData = this._vmData;
/*
			switch (commandId) {
				case 0:
					break;

				default:
					console.error('Unknown drawing command "' + commandId + '".');
					break;
			}

				case 'log':
					this.emit('Log', v1, command.location);
					break;

				case 'motorw': // Motor write...
					var motor = this._motors.getMotor(v1);
					if (motor) {
						motor.setTarget(vmData.getRegisterByName('REG_MOTOR_TARGET'));
						motor.setPower(vmData.getRegisterByName('REG_MOTOR_POWER'));
					}
					break;

				case 'motorr': // Motor read...
					var motor = this._motors.getMotor(v1);
					if (motor) {
						vmData.setRegisterByName('REG_MOTOR_TARGET', 	motor.getTarget());
						vmData.setRegisterByName('REG_MOTOR_POSITION', 	motor.getPosition());
						vmData.setRegisterByName('REG_MOTOR_POWER', 	motor.getPower());
					}
					break;
*/
		};
	})
);
