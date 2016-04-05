var Compiler = Class(function() {
		this.init = function(opts) {
			this._compilerData 		= new CompilerData({compiler: this, registers: opts.registers});
			this._outputCommands 	= [];
			this._mainIndex 		= -1;
			this._filename 			= '';
			this._lineNumber		= 0;
			this._includes 			= null;
		};

		this.createError = function(message) {
			var error = new Error(message);
			error.filename 		= this._filename;
			error.lineNumber 	= this._lineNumber;
			return error;
		};

		this.paramInfo = function(param) {
			if (param === 'TRUE') {
				return {
					type: 	T_NUMBER_CONSTANT,
					value: 	1,
					param: 	param
				}
			} else if (param === 'FALSE') {
				return {
					type: 	T_NUMBER_CONSTANT,
					value: 	0,
					param: 	param
				}
			} else if ((param.length > 2) && (param[0] === '"') && (param.substr(-1) === '"')) {
				return {
					type: 	T_STRING_CONSTANT, // String constant
					value: 	param.substr(1, param.length - 2),
					param: 	param
				};
			} else if (!isNaN(parseInt(param, 10))) {
				return {
					type: 	T_NUMBER_CONSTANT,
					value: 	parseInt(param, 10),
					param: 	param
				};
			} else {
				var compilerData = this._compilerData,
					offset,
					vr 		= null,
					type 	= null;

				offset = compilerData.findRegister(param);
				if (offset !== null) {
					type 	= offset;
					offset 	= param;
				} else {
					var local = compilerData.findLocal(param);
					if (local !== null) {
						offset 	= local.offset;
						type 	= local.type;
						vr 		= local;
					} else {
						var global = compilerData.findGlobal(param);
						if (global !== null) {
							offset 	= global.offset;
							type 	= global.type;
							vr 		= global;
						} else {
							offset = 0;
							var label = compilerData.findLabel(param);
							if (label !== null) {
								label.jumps.push(this._outputCommands.length);
								type = T_LABEL;
							}
						}
					}
				}

				if (type === null) {
					throw this.createError('Undefined identifier "' + param + '".');
				}

				return {
					type: 	type,
					vr: 	vr,
					value: 	offset,
					param: 	param
				}
			}
		};

		this.createCommand = function(command, params) {
			var args = commands[command].args,
				code = commands[command].code;
			if (params.length) {
				for (var i = 0; i < params.length; i++) {
					var param = params[i],
						found = false;

					for (var j = 0; j < args.length; j++) {
						if (param.type === args[j].type) {
							args 	= ('args' in args[j]) ? args[j].args : args[j];
							found 	= true;
							break;
						}
					}
					if (!found) {
						throw this.createError('Type mismatch "' + param.param + '".');
					}
				}
				return {
					command: 	command,
					code: 		code,
					params: 	params
				};
			}
		};

		this.validateCommand = function(command, params) {
			if (!(command in commands)) {
				throw this.createError('Unknown command "' + command + '".');
			}

			for (var i = 0; i < params.length; i++) {
				params[i] = this.paramInfo(params[i]);
			}
			return this.createCommand(command, params);
		};

		this.compileCall = function(line) {
			var compilerData 	= this._compilerData,
				i 				= line.indexOf('('),
				procedure 		= line.substr(0, i),
				valid 			= '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';

			for (var j = 0; j < procedure.length; j++) {
				if (valid.indexOf(procedure[j]) === -1) {
					throw this.createError('Syntax error.');
				}
			}

			var p = compilerData.findProcedure(procedure);
			if (p === null) {
				throw this.createError('Unknown procedure "' + procedure + '".');
			} else {
				var params = line.substr(i + 1, line.length - i - 2).trim();
				params = params.length ? params.split(',') : [];
				for (var i = 0; i < params.length; i++) {
					var param = params[i].trim();
					if (param !== '') {
						var destParam = null;
						switch (p.command.paramTypes[i]) {
							case 'bool': 	destParam = { type: 'bl', value: p.command.localCount + i, param: param }; break;
							case 'number': 	destParam = { type: T_NUMBER_LOCAL, value: p.command.localCount + i, param: param }; break;
						}
						this.addOutputCommand(this.createCommand('set', [destParam, this.paramInfo(param)]));
					}
				}

				this.addOutputCommand({
					command: 	'call',
					code: 		commands['call'].code,
					params: [
						{
							value: p.index
						},
						{
							value: p.command.localCount
						}
					]
				});
			}
		};

		this.compileProcedure = function(params) {
			var compilerData 	= this._compilerData,
				outputCommands 	= this._outputCommands,
				procStartIndex 	= outputCommands.length;
				outputCommand 	= {
					command: 	'nop',
					code: 		commands.nop.code,
					params: [
						{
							value: 0
						}
					],
					paramTypes: []
				};
			this.addOutputCommand(outputCommand);

			var j 			= params.indexOf('('),
				procedure 	= params.substr(0, j);
			compilerData.declareProcedure(procedure, outputCommands[outputCommands.length - 1], outputCommands.length - 1);

			if (procedure === 'main') {
				this._mainIndex = procStartIndex;
			}

			params = params.substr(j + 1, params.length - j - 2).trim();
			params = params.length ? params.split(',') : [];
			for (var j = 0; j < params.length; j++) {
				var param = params[j].trim().split(' ');
				if (param.length !== 2) {
					throw this.createError('Syntax error in procedure parameter "' + params[j] + '".');
				}
				switch (param[0]) {
					case 'number':
						compilerData.declareLocal(param[1], T_NUMBER_LOCAL, T_NUMBER_LOCAL_ARRAY);
						break;

					default:
						throw this.createError('Unknown type "' + param[0] + '".');
				}
				outputCommand.paramTypes.push(param[0]);
			}

			return procStartIndex;
		};

		this.addOutputCommand = function(outputCommand) {
			if (!outputCommand.params) {
				outputCommand.params = [];
			}
			while (outputCommand.params.length < 2) {
				outputCommand.params.push({type: '', value: 0});
			}
			this._outputCommands.push(outputCommand);
		};

		this.hasCall = function(line) {
			return (line.indexOf('proc') === -1) && (line.indexOf('(') !== -1);
		};

		this.hasLabel = function(line) {
			var i = line.indexOf(':');
			if ((line.length > 1) && (i !== -1)) {
				for (var j = 0; j < i; j++) {
					if ('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_'.indexOf(line[j]) === -1) {
						return false;
					}
				}
				return true;
			}
			return false;
		};

		this.compileLabels = function(lines) {
			for (var i = 0; i < lines.length; i++) {
				this._lineNumber = i;
				var line = lines[i].trim();
				if (this.hasLabel(line)) {
					var j = line.indexOf(':');
					if (this._compilerData.declareLabel(line.substr(0, j))) {
						throw this.createError('Duplicate label "' + name + '".');
					}
				}
			}
		};

		this.updateLabels = function() {
			var outputCommands 	= this._outputCommands,
				compilerData 	= this._compilerData,
				labelList 		= compilerData.getLabelList();

			for (var i in labelList) {
				var label = labelList[i],
					jumps = label.jumps;
				for (var j = 0; j < jumps.length; j++) {
					outputCommands[jumps[j]].params[0].value = label.index;
				}
			}
		};

		this.compileLines = function(lines) {
			var compilerData 	= this._compilerData,
				outputCommands 	= this._outputCommands,
				procStartIndex 	= -1,
				activeProc 		= null;

			for (var i = 0; i < lines.length; i++) {
				this._lineNumber = i;
				var line = lines[i].trim();
				if (line !== '') {
					if (this.hasCall(line)) {
						this.compileCall(line);
					} else if (line.indexOf(' ') === -1) {
						if (this.hasLabel(line)) {
							var label = compilerData.findLabel(line.substr(0, line.length - 1));
							label.index = outputCommands.length - 1;
						} else if (line === 'endp') {
							this.addOutputCommand({
								command: 	'ret',
								code: 		commands.ret.code
							});
							outputCommands[procStartIndex].localCount = compilerData.getLocalOffset();
							procStartIndex 	= -1;
							compilerData.resetLocal();
						} else {
							var command = line;
							if (command in commands) {
								var args = commands[command];
								this.addOutputCommand({
									command: 	command,
									code: 		args.code
								});
							}
						}
					} else {
						var j 		= line.indexOf(' '),
							command = line.substr(0, j),
							params 	= line.substr(j - line.length + 1).trim();

						if (params !== '') {
							var j = params.indexOf('(');
							if ((command === 'proc') && (j !== -1) && (params.substr(-1) === ')')) {
								procStartIndex = this.compileProcedure(params);
							} else {
								params = params.split(',');
								for (var j = 0; j < params.length; j++) {
									params[j] = params[j].trim();
								}

								switch (command) {
									case 'number':
										if (procStartIndex === -1) {
											for (var j = 0; j < params.length; j++) {
												compilerData.declareGlobal(params[j], T_NUMBER_GLOBAL, T_NUMBER_GLOBAL_ARRAY);
											}
										} else {
											for (var j = 0; j < params.length; j++) {
												compilerData.declareLocal(params[j], T_NUMBER_LOCAL, T_NUMBER_LOCAL_ARRAY);
											}
										}
										break;

									default:
										command = this.validateCommand(command, params);
										switch (command.command) {
											case 'arrayr': // Array read...
												// Remove the third parameter which is the index and
												// add a command to move the value to the REG_OFFSET...
												this.addOutputCommand({
													command: 	'set',
													code: 		commands.set.code,
													params: [
														{
															type: 	T_NUMBER_REGISTER,
															value: 	'REG_OFFSET'
														},
														command.params.pop()
													]
												});

												// Check if the item size is greater than 1, if so multiply with the item size...
												var size = command.params[1].vr.size;
												if (size > 1) {
													this.addOutputCommand({
														command: 	'mul',
														code: 		commands.mul.code,
														params: [
															{
																type: 	T_NUMBER_REGISTER,
																value: 	compilerData.findRegister('REG_OFFSET')
															},
															{
																type: 	T_NUMBER_CONSTANT,
																value: 	size
															}
														]
													});
												}
												break;

											case 'arrayw': // Array write...
												// Remove the second parameter which is the index and
												// add a command to move the value to the REG_OFFSET...
												this.addOutputCommand({
													command: 	'set',
													code: 		commands.set.code,
													params: [
														{
															type: 	T_NUMBER_REGISTER,
															value: 	'REG_OFFSET'
														},
														command.params.splice(1, 1)[0]
													]
												});

												// Check if the item size is greater than 1, if so multiply with the item size...
												var size = command.params[1].vr.size;
												if (size > 1) {
													this.addOutputCommand({
														command: 	'mul',
														code: 		commands.mul.code,
														params: [
															{
																type: 	T_NUMBER_REGISTER,
																value: 	compilerData.findRegister('REG_OFFSET')
															},
															{
																type: 	T_NUMBER_CONSTANT,
																value: 	size
															}
														]
													});
												}
												break;
										}

										this.addOutputCommand(command);
										break;
								}
							}
						}
					}
				}
			}

			return outputCommands;
		};

		this.compile = function(includes) {
			this._compilerData.reset();
			this._outputCommands.length = 0;
			this._mainIndex 			= -1;
			this._includes 				= includes;

			var i = includes.length;
			while (i) {
				i--;
				this._filename = includes[i].filename;

				var lines = includes[i].lines;
				this.compileLabels(lines);
				this.compileLines(lines);
				this.updateLabels();
			}

			if (this._mainIndex === -1) {
				throw this.createError('No main procedure found.');
			}

			this._outputCommands.mainIndex = this._mainIndex;
			return this._outputCommands;
		};

		this.getIncludes = function() {
			return this._includes;
		};

		this.getCompilerData = function() {
			return this._compilerData;
		};
	});