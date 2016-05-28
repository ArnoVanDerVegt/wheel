wheel(
	'vm.VM',
	Class(Emitter, function(supr) {
		this.init = function(opts) {
			supr(this, 'init', arguments);

			this._motors 		= opts.motors;
			this._vmData 		= new VMData({registers: opts.registers});
			this._commands 		= null;
			this._index 		= 0;
			this._callStack 	= [];
			this._runInterval 	= null;

			this.initModules();
		};

		this.initModules = function() {
			this._modules 		= [];
			this._modules[0]	= new wheel.vm.modules.StandardModule({vm: this, vmData: this._vmData});
			this._modules[1]	= new wheel.vm.modules.ScreenModule({vm: this, vmData: this._vmData});
			this._modules[2]	= new wheel.vm.modules.MotorModule({vm: this, vmData: this._vmData});
			this._modules[3]	= new wheel.vm.modules.SensorModule({vm: this, vmData: this._vmData});
		};

		this.runCommand = function(command) {
			var vmData 		= this._vmData,
				saveResult 	= function(result) {
					switch (command.params[0].type) {
						case wheel.compiler.command.T_NUMBER_GLOBAL: 	vmData.setGlobalNumber(p1, result); 	break;
						case wheel.compiler.command.T_NUMBER_LOCAL: 	vmData.setLocalNumber(p1, result); 		break;
						case wheel.compiler.command.T_NUMBER_REGISTER: 	vmData.setRegister(p1, result); 		break;
					}
				};
			if (command.code <= wheel.compiler.command.NO_PARAM_COMMANDS) { // Commands without parameters...
				switch (command.command) {
					case 'nop':
						break;

					case 'ret':
						vmData.popRegOffsetStack();
						this._index = this._callStack.pop();
						break;

					default:
						throw new Error('Unknown command "' + command.command + '"');
				}
			} else {
				var p1 = command.params[0].value,
					v1;
				switch (command.params[0].type) {
					case wheel.compiler.command.T_NUMBER_CONSTANT: 	v1 = p1; 							break;
					case wheel.compiler.command.T_NUMBER_GLOBAL: 	v1 = vmData.getGlobalNumber(p1); 	break;
					case wheel.compiler.command.T_NUMBER_LOCAL: 	v1 = vmData.getLocalNumber(p1); 	break;
					case wheel.compiler.command.T_NUMBER_REGISTER: 	v1 = vmData.getRegister(p1); 		break;
					case wheel.compiler.command.T_STRING_CONSTANT: 	v1 = p1;/*vmData.getString(p1); */	break;
				}
				if (command.code <= wheel.compiler.command.SINGLE_PARAM_COMMANDS) { // Commands with a signle parameter...
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
							vmData.pushRegOffsetStack(command.params[1].value);
							this._callStack.push(this._index);
							this._index = command.params[0].value;
							break;

						case 'call_var':
							vmData.pushRegOffsetStack(command.params[1].value);
							this._callStack.push(this._index);
							this._index = v1;
							break;

						default:
							throw new Error('Unknown command "' + command.command + '"');
					}
				} else { // Commands with two parameters...
					var p2 = command.params[1].value,
						v2;
					switch (command.params[1].type) {
						case wheel.compiler.command.T_NUMBER_CONSTANT: 	v2 = p2; 							break;
						case wheel.compiler.command.T_NUMBER_GLOBAL: 	v2 = vmData.getGlobalNumber(p2); 	break;
						case wheel.compiler.command.T_NUMBER_LOCAL: 	v2 = vmData.getLocalNumber(p2); 	break;
						case wheel.compiler.command.T_NUMBER_REGISTER: 	v2 = vmData.getRegister(p2); 		break;
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
								case wheel.compiler.command.T_NUMBER_GLOBAL: 	vmData.setGlobalNumber(p1, result); 	break;
								case wheel.compiler.command.T_NUMBER_LOCAL: 	vmData.setLocalNumber(p1, result); 		break;
								case wheel.compiler.command.T_NUMBER_REGISTER: 	vmData.setRegister(p1, result); 		break;
							}
							(result >= 0) && (this._index = command.params[1].value);
							break;

						case 'module':
							var modules = this._modules;
							if (modules[v1]) {
								modules[v1].run(v2);
							} else {
								throw new Error('Unknown module "' + v1 + '"');
							}
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

		this.getModule = function(index) {
			return this._modules[index];
		};

		this.getVMData = function() {
			return this._vmData;
		};
	})
);