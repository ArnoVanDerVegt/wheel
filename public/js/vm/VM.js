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
				compare 	= function(v1, v2) {
					vmData.setRegister('REG_E', 	v1 == v2);
					vmData.setRegister('REG_NE', 	v1 != v2);
					vmData.setRegister('REG_L', 	v1 < v2);
					vmData.setRegister('REG_LE', 	v1 <= v2);
					vmData.setRegister('REG_G', 	v1 < v2);
					vmData.setRegister('REG_GE', 	v1 >= v2);
				},
				callProc = bind(this, function() {
					vmData.pushLocalOffset(command.params[1].value);
					this._callStack.push(this._index);
					this._index = command.params[0].value;
				}),
				callRet = bind(this, function() {
					vmData.popLocalOffset();
					this._index = this._callStack.pop();
				}),
				p1 = command.params[0].value,
				v1,
				p2 = command.params[1].value,
				v2,
				result;

			switch (command.params[0].type) {
				case 'nc': 	v1 = p1; 							break;
				case 'ng': 	v1 = vmData.getGlobalNumber(p1); 	break;
				case 'nl': 	v1 = vmData.getLocalNumber(p1); 	break;
				case 'nr': 	v1 = vmData.getRegister(p1); 		break;
				case 'sc': 	v1 = vmData.getString(p1); 			break;
			}
			switch (command.params[1].type) {
				case 'nc': 	v2 = p2; 							break;
				case 'ng': 	v2 = vmData.getGlobalNumber(p2); 	break;
				case 'nl': 	v2 = vmData.getLocalNumber(p2); 	break;
				case 'nr': 	v2 = vmData.getRegister(p2); 		break;
			}

			if (command.code === 0) {
				// Nop...
			} else {
				var commandGroup = ~~(command.code / 16);

				switch (commandGroup) {
					case 0:
						switch (command.command) {
							case 'set': 	result = v2; 		break;
							case 'add': 	result = v1 + v2; 	break;
							case 'sub': 	result = v1 - v2; 	break;
							case 'mul': 	result = v1 * v2; 	break;
							case 'div': 	result = v2 / v2; 	break;
							default: throw new Error('Unknown command "' + command.command + '"');
						}
						switch (command.params[0].type) {
							case 'ng': 	vmData.setGlobalNum(p1, result); 	break;
							case 'nl': 	vmData.setLocalNum(p1, result); 	break;
							case 'nr': 	vmData.setRegister(p1, result); 	break;
						}
						break;

					case 1:
						switch (command.command) {
							case 'cmp': compare(v1, v2); break;
							default: throw new Error('Unknown command "' + command.command + '"');
						}
						break;

					case 2:
						switch (command.command) {
							case 'inc': 	result = v1 + 1; 		break;
							case 'dec': 	result = v1 - 1; 		break;
							case 'abs': 	result = Math.abs(v1); 	break;
							case 'neg': 	result = -v1; 			break;
							default: throw new Error('Unknown command "' + command.command + '"');
						}
						switch (command.params[0].type) {
							case 'ng': 	vmData.setGlobalNum(p1, result); 	break;
							case 'nl': 	vmData.setLocalNum(p1, result); 	break;
							case 'nr': 	vmData.setRegister(p1, result); 	break;
						}
						break;

					case 3:
						switch (command.command) {
							case 'print':
								var size = ev3screen.drawText(
										vmData.getRegister('REG_DRAW_X'),
										vmData.getRegister('REG_DRAW_Y'),
										v1
									);
								vmData.setRegister('REG_DRAW_X', vmData.getRegister('REG_DRAW_X') + size);
								break;

							case 'motorw': // Motor write...
								var motor = this._motors.getMotor(v1);
								if (motor) {
									motor.setTarget(vmData.getRegister('REG_MOTOR_TARGET'));
									motor.setPower(vmData.getRegister('REG_MOTOR_POWER'));
								}
								break;

							case 'motorr': // Motor read...
								var motor = this._motors.getMotor(v1);
								if (motor) {
									vmData.setRegister('REG_MOTOR_TARGET', 		motor.getTarget());
									vmData.setRegister('REG_MOTOR_POSITION', 	motor.getPosition());
									vmData.setRegister('REG_MOTOR_POWER', 		motor.getPower());
								}
								break;

							default:
								throw new Error('Unknown command "' + command.command + '"');
						}
						break;

					case 4:
						var register = null;
						switch (command.command) {
							case 'jmp': 								break;
							case 'je': 			register = 'REG_E'; 	break;
							case 'jne': 		register = 'REG_NE'; 	break;
							case 'jl': 			register = 'REG_L'; 	break;
							case 'jle': 		register = 'REG_LE'; 	break;
							case 'jg': 			register = 'REG_G'; 	break;
							case 'jge': 		register = 'REG_GE'; 	break;
							default: throw new Error('Unknown command "' + command.command + '"');
						}
						(!register || vmData.getRegister(register)) && (this._index = p1);
						break;

					case 5:
						switch (command.command) {
							case 'call': 		callProc();					break;
							case 'ret': 		callRet(); 					break;
							default: throw new Error('Unknown command "' + command.command + '"');
						}
						break;

					case 6:
						switch (command.command) {
							case 'cls':
								ev3screen.clearScreen();
								break;

							case 'line':
								ev3screen.drawLine(
									vmData.getRegister('REG_DRAW_X1'),
									vmData.getRegister('REG_DRAW_Y1'),
									vmData.getRegister('REG_DRAW_X2'),
									vmData.getRegister('REG_DRAW_X2'),
									0
								);
								break;

							case 'rect':
								ev3screen.drawRect(
									vmData.getRegister('REG_DRAW_X'),
									vmData.getRegister('REG_DRAW_Y'),
									vmData.getRegister('REG_DRAW_WIDTH'),
									vmData.getRegister('REG_DRAW_HEIGHT'),
									0
								);
								break;

							case 'circle':
								//ev3screen.circle();
								break;

							default:
								throw new Error('Unknown command "' + command.command + '"');
						}
						break;
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

		this.run = function(commands) {
			this.stop();

			this._motors.reset();
			this._vmData.pushLocalOffset(0);
			this._callStack.push(0xFFFF);
			this._commands 		= commands;
			this._index 		= commands.mainIndex;
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