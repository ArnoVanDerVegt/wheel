var VM = Class(Emitter, function(supr) {
		this.init = function(opts) {
			supr(this, 'init', arguments);

			this._motors 		= opts.motors;
			this._vmData 		= new VMData({registers: opts.registers});
			this._commands 		= null;
			this._index 		= 0;
			this._callStack 	= [];
			this._runInterval 	= null;
		};

		this.runCommand = function(command) {
			var vmData 		= this._vmData,
				ev3screen 	= this._ev3Screen,
				saveResult 	= function(result) {
					switch (command.params[0].type) {
						case T_NUMBER_GLOBAL: 	vmData.setGlobalNumber(p1, result); 	break;
						case T_NUMBER_LOCAL: 	vmData.setLocalNumber(p1, result); 		break;
						case T_NUMBER_REGISTER: vmData.setRegister(p1, result); 		break;
					}
				};
			if (command.code <= NO_PARAM_COMMANDS) { // Commands without parameters...
				switch (command.command) {
					case 'nop':
						break;

					case 'ret':
						vmData.popRegOffsetStack();
						this._index = this._callStack.pop();
						break;

					case 'cls':
						ev3screen.clearScreen();
						break;

					case 'line':
						ev3screen.drawLine(
							vmData.getRegisterByName('REG_DRAW_X1'),
							vmData.getRegisterByName('REG_DRAW_Y1'),
							vmData.getRegisterByName('REG_DRAW_X2'),
							vmData.getRegisterByName('REG_DRAW_X2'),
							0
						);
						break;

					case 'rect':
						ev3screen.drawRect(
							vmData.getRegisterByName('REG_DRAW_X1'),
							vmData.getRegisterByName('REG_DRAW_Y1'),
							vmData.getRegisterByName('REG_DRAW_WIDTH'),
							vmData.getRegisterByName('REG_DRAW_HEIGHT'),
							0
						);
						break;

					case 'circle':
						//ev3screen.circle();
						break;

					default:
						throw new Error('Unknown command "' + command.command + '"');
				}
			} else {
				var p1 = command.params[0].value,
					v1;
				switch (command.params[0].type) {
					case T_NUMBER_CONSTANT: 	v1 = p1; 							break;
					case T_NUMBER_GLOBAL: 		v1 = vmData.getGlobalNumber(p1); 	break;
					case T_NUMBER_LOCAL: 		v1 = vmData.getLocalNumber(p1); 	break;
					case T_NUMBER_REGISTER: 	v1 = vmData.getRegister(p1); 		break;
					case T_STRING_CONSTANT: 	v1 = p1;/*vmData.getString(p1); */	break;
				}
				if (command.code <= SINGLE_PARAM_COMMANDS) { // Commands with a signle parameter...
					switch (command.command) {
						case 'inc':
							saveResult(v1 + 1);
							break;

						case 'dec':
							saveResult(v1 - 1);
							break;

						case 'abs':
							saveResult(Math.abs(v1));
							break;

						case 'neg':
							saveResult(-v1);
							break;

						case 'copy':
							var size 			= command.params[0].value,
								regOffsetSrc 	= vmData.getRegisterByName('REG_OFFSET_SRC'),
								regOffsetDest 	= vmData.getRegisterByName('REG_OFFSET_DEST');
							for (var i = 0; i < size; i++) {
								var value = vmData.getGlobalNumber(regOffsetSrc + i);
								vmData.setGlobalNumber(regOffsetDest + i, vmData.getGlobalNumber(regOffsetSrc + i));
							}
							break;

						case 'jmp':
							this._index = p1;
							break;

						case 'je':
							vmData.getRegisterByName('REG_E') && (this._index = p1);
							break;

						case 'jne':
							vmData.getRegisterByName('REG_NE') && (this._index = p1);
							break;

						case 'jl':
							vmData.getRegisterByName('REG_L') && (this._index = p1);
							break;

						case 'jle':
							vmData.getRegisterByName('REG_LE') && (this._index = p1);
							break;

						case 'jg':
							vmData.getRegisterByName('REG_G') && (this._index = p1);
							break;

						case 'jge':
							vmData.getRegisterByName('REG_GE') && (this._index = p1);
							break;

						case 'call':
							vmData.pu(command.params[1].value);
							this._callStack.push(this._index);
							this._index = command.params[0].value;
							break;

						case 'call_global':
						case 'call_local':
							vmData.pushRegOffsetStack(command.params[1].value);
							this._callStack.push(this._index);
							this._index = v1;
							break;

						case 'print':
							var size = ev3screen.drawText(
									vmData.getRegisterByName('REG_DRAW_X1'),
									vmData.getRegisterByName('REG_DRAW_Y1'),
									v1
								);
							break;

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

						default:
							throw new Error('Unknown command "' + command.command + '"');
					}
				} else { // Commands with two parameters...
					var p2 = command.params[1].value,
						v2;
					switch (command.params[1].type) {
						case T_NUMBER_CONSTANT: 	v2 = p2; 							break;
						case T_NUMBER_GLOBAL: 		v2 = vmData.getGlobalNumber(p2); 	break;
						case T_NUMBER_LOCAL: 		v2 = vmData.getLocalNumber(p2); 	break;
						case T_NUMBER_REGISTER: 	v2 = vmData.getRegister(p2); 		break;
					}

					switch (command.command) {
						case 'set':
							saveResult(v2);
							break;

						case 'add':
							saveResult(v1 + v2);
							break;

						case 'sub':
							saveResult(v1 - v2);
							break;

						case 'mul':
							saveResult(v1 * v2);
							break;

						case 'div':
							saveResult(v2 / v2);
							break;

						case 'cmp':
							vmData.setRegisterByName('REG_E', 	v1 == v2);
							vmData.setRegisterByName('REG_NE', 	v1 != v2);
							vmData.setRegisterByName('REG_L', 	v1 < v2);
							vmData.setRegisterByName('REG_LE', 	v1 <= v2);
							vmData.setRegisterByName('REG_G', 	v1 < v2);
							vmData.setRegisterByName('REG_GE', 	v1 >= v2);
							break;

						case 'loop':
							result = v1 - 1;
							switch (command.params[0].type) {
								case T_NUMBER_GLOBAL: 	vmData.setGlobalNumber(p1, result); 	break;
								case T_NUMBER_LOCAL: 	vmData.setLocalNumber(p1, result); 		break;
								case T_NUMBER_REGISTER: vmData.setRegister(p1, result); 		break;
							}
							(result >= 0) && (this._index = command.params[1].value);
							break;

						default:
							throw new Error('Unknown command "' + command.command + '"');
					}
				}
			}
		};

		this.onInterval = function() {
			var commands 	= this._commands,
				count 		= 0;
			while ((this._index < commands.length) && (count < 100)) {
				this.runCommand(commands[this._index]);
				this._index++;
				count++;
			}
			if (this._index >= commands.length) {
				this.stop();
			}
			this._motors.update();
		};

		this.run = function(commands, globalConstants, stackOffset) {
			this.stop();

			this._motors.reset();
			this._vmData.setGlobalConstants(globalConstants, stackOffset);
			this._vmData.pushRegOffsetStack(0);
			this._callStack.push(0xFFFF);
			this._commands 		= commands.getBuffer();
			this._index 		= commands.getMainIndex();
			this._runInterval 	= setInterval(this.onInterval.bind(this), 20);
		};

		this.stop = function() {
			if (this._runInterval !== null) {
				clearInterval(this._runInterval);
				this._runInterval = null;
			}
		};

		this.setEV3Screen = function(ev3screen) {
			this._ev3Screen = ev3screen;
		};

		this.getVMData = function() {
			return this._vmData;
		};
	});