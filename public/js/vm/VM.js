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
				case T_NUMBER_CONSTANT: 	v1 = p1; 							break;
				case T_NUMBER_GLOBAL: 		v1 = vmData.getGlobalNumber(p1); 	break;
				case T_NUMBER_LOCAL: 		v1 = vmData.getLocalNumber(p1); 	break;
				case T_NUMBER_REGISTER: 	v1 = vmData.getRegister(p1); 		break;
				case T_STRING_CONSTANT: 	v1 = p1;/*vmData.getString(p1); */	break;
			}
			switch (command.params[1].type) {
				case T_NUMBER_CONSTANT: 	v2 = p2; 							break;
				case T_NUMBER_GLOBAL: 		v2 = vmData.getGlobalNumber(p2); 	break;
				case T_NUMBER_LOCAL: 		v2 = vmData.getLocalNumber(p2); 	break;
				case T_NUMBER_REGISTER: 	v2 = vmData.getRegister(p2); 		break;
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
							case T_NUMBER_GLOBAL: 	vmData.setGlobalNumber(p1, result); 	break;
							case T_NUMBER_LOCAL: 	vmData.setLocalNumber(p1, result); 		break;
							case T_NUMBER_REGISTER: vmData.setRegister(p1, result); 		break;
						}
						break;

					case 1:
						switch (command.command) {
							case 'cmp': compare(v1, v2); break;
							case 'loop':
								result = v1 - 1;
								switch (command.params[0].type) {
									case T_NUMBER_GLOBAL: 	vmData.setGlobalNumber(p1, result); 	break;
									case T_NUMBER_LOCAL: 	vmData.setLocalNumber(p1, result); 		break;
									case T_NUMBER_REGISTER: vmData.setRegister(p1, result); 		break;
								}
								(result >= 0) && (this._index = command.params[1].value);
								break;
							default: throw new Error('Unknown command "' + command.command + '"');
						}
						break;

					case 2:
						switch (command.command) {
							case 'inc': 	result = v1 + 1; 		break;
							case 'dec': 	result = v1 - 1; 		break;
							case 'abs': 	result = Math.abs(v1); 	break;
							case 'neg': 	result = -v1; 			break;
							case 'copy_local_local':
								break;
							case 'copy_global_local':
								var size 			= command.params[0].value,
									regOffsetSrc 	= vmData.getRegister('REG_OFFSET_SRC'),
									regOffsetDest 	= vmData.getRegister('REG_OFFSET_DEST');
								for (var i = 0; i < size; i++) {
									vmData.setLocalNumber(regOffsetDest + i, vmData.getGlobalNumber(regOffsetSrc + i));
								}
								break;

							default: throw new Error('Unknown command "' + command.command + '"');
						}
						switch (command.params[0].type) {
							case T_NUMBER_GLOBAL: 	vmData.setGlobalNumber(p1, result); break;
							case T_NUMBER_LOCAL: 	vmData.setLocalNumber(p1, result); 	break;
							case T_NUMBER_REGISTER: vmData.setRegister(p1, result); 	break;
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

							case 'log':
								this.emit('Log', v1, command.location);
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
							case 'call':
								callProc();
								break;

							case 'call_global':
								vmData.pushLocalOffset(command.params[1].value);
								this._callStack.push(this._index);
								this._index = v1;
								break;

							case 'call_local':
								vmData.pushLocalOffset(command.params[1].value);
								this._callStack.push(this._index);
								this._index = v1;
								break;

							case 'ret':
								callRet();
								break;

							case 'arrayr': // Read from an array...
								var regOffset 	= vmData.getRegister('REG_OFFSET'),
									regSize 	= vmData.getRegister('REG_SIZE'),
									v1 			= null;

								switch (command.params[0].type) {
									case T_STRUCT_GLOBAL:
										switch (command.params[1].type) {
											case T_STRUCT_LOCAL_ARRAY:
												for (var offset = 0; offset < regSize; offset++) {
													vmData.setGlobalNumber(p1 + offset, vmData.getLocalNumber(regOffset + p2 + offset));
												}
												break;
											case T_STRUCT_GLOBAL_ARRAY:
												for (var offset = 0; offset < regSize; offset++) {
													vmData.setGlobalNumber(p1 + offset, vmData.getGlobalNumber(regOffset + p2 + offset));
												}
												break;
										}
										break;

									case T_STRUCT_LOCAL:
										switch (command.params[1].type) {
											case T_STRUCT_LOCAL_ARRAY:
												for (var offset = 0; offset < regSize; offset++) {
													vmData.setLocalNumber(p1 + offset, vmData.getLocalNumber(regOffset + p2 + offset));
												}
												break;
											case T_STRUCT_GLOBAL_ARRAY:
												for (var offset = 0; offset < regSize; offset++) {
													vmData.setLocalNumber(p1 + offset, vmData.getGlobalNumber(regOffset + p2 + offset));
												}
												break;
										}
										break;

									default:
										switch (command.params[1].type) {
											case T_NUMBER_GLOBAL_ARRAY: v2 = vmData.getGlobalNumber(regOffset + p2); 		break;
											case T_NUMBER_LOCAL_ARRAY: 	v2 = vmData.getLocalNumber(regOffset + p2, result); break;
										}
										switch (command.params[0].type) {
											case T_NUMBER_GLOBAL: 	vmData.setGlobalNumber(p1, v2); break;
											case T_NUMBER_LOCAL: 	vmData.setLocalNumber(p1, v2); 	break;
											case T_NUMBER_REGISTER: vmData.setRegister(p1, v2); 	break;
										}
										break;
								}
								break;

							case 'arrayw': // Write an array element...
								var regOffset 	= vmData.getRegister('REG_OFFSET'),
									regSize 	= vmData.getRegister('REG_SIZE'),
									v2 			= null;

								switch (command.params[0].type) {
									case T_STRUCT_GLOBAL_ARRAY:
										switch (command.params[1].type) {
											case T_STRUCT_LOCAL:
												for (var offset = 0; offset < regSize; offset++) {
													vmData.setGlobalNumber(regOffset + p1 + offset, vmData.getLocalNumber(v2 + offset));
												}
												break;
											case T_STRUCT_GLOBAL:
												for (var offset = 0; offset < regSize; offset++) {
													vmData.setGlobalNumber(regOffset + p1 + offset, vmData.getGlobalNumber(v2 + offset));
												}
												break;
										}
										break;

									case T_STRUCT_LOCAL_ARRAY:
										switch (command.params[1].type) {
											case T_STRUCT_LOCAL:
												for (var offset = 0; offset < regSize; offset++) {
													vmData.setLocalNumber(regOffset + p1 + offset, vmData.getLocalNumber(v2 + offset));
												}
												break;
											case T_STRUCT_GLOBAL:
												for (var offset = 0; offset < regSize; offset++) {
													vmData.setLocalNumber(regOffset + p1 + offset, vmData.getGlobalNumber(v2 + offset));
												}
												break;
										}
										break;

									default:
										switch (command.params[1].type) {
											case T_NUMBER_CONSTANT: 	v2 = p2; 							break;
											case T_NUMBER_GLOBAL: 		v2 = vmData.getGlobalNumber(p2); 	break;
											case T_NUMBER_LOCAL: 		v2 = vmData.getLocalNumber(p2); 	break;
											case T_NUMBER_REGISTER: 	v2 = vmData.getRegister(p2); 		break;
										}
										switch (command.params[0].type) {
											case T_NUMBER_GLOBAL_ARRAY: vmData.setGlobalNumber(regOffset + p1, v2); break;
											case T_NUMBER_LOCAL_ARRAY: 	vmData.setLocalNumber(regOffset + p1, v2); 	break;
										}
									}
								break;

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

		this.run = function(commands, globalConstants) {
			this.stop();

			this._motors.reset();
			this._vmData.setGlobalConstants(globalConstants);
			this._vmData.pushLocalOffset(0);
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