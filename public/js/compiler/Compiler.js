var Compiler = Class(function() {
		this.init = function(opts) {
			this._compilerData 		= new CompilerData({compiler: this, registers: opts.registers});
			this._outputCommands 	= [];
			this._mainIndex 		= -1;
			this._filename 			= '';
			this._lineNumber		= 0;
			this._includes 			= null;
			this._procStartIndex 	= -1;
			this._activeStruct 		= null;
		};

		this.createError = function(message) {
			var error = new Error(message);
			error.location = {
				filename: 	this._filename,
				lineNumber: this._lineNumber
			};
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
							var procedure = compilerData.findProcedure(param);
							if (procedure !== null) {
								offset 	= procedure.index;
								type 	= T_PROC;
								vr 		= procedure;
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
						var argsType = args[j].type,
							matchType = (param.type === args[j].type) ||
								(param.vr && param.vr.field && (param.vr.field.type === args[j].type));

						if (matchType) {
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
					params: 	params,
					location: {
						filename: 	this._filename,
						lineNumber: this._lineNumber
					}
				};
			}
		};

		this.validateCommand = function(command, params) {
			if (!(command in commands)) {
				return false;
			}

			for (var i = 0; i < params.length; i++) {
				params[i] = this.paramInfo(params[i]);
			}
			return this.createCommand(command, params);
		};

		this.validateString = function(s, valid) {
			if (!valid) {
				valid = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';
			}
			for (var i = 0; i < s.length; i++) {
				if (valid.indexOf(s[i]) === -1) {
					return false;
				}
			}
			return true;
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

		this.updateLabels = function() {
			var outputCommands 	= this._outputCommands,
				compilerData 	= this._compilerData,
				labelList 		= compilerData.getLabelList();

			for (var i in labelList) {
				var label = labelList[i],
					jumps = label.jumps;
				for (var j = 0; j < jumps.length; j++) {
					var outputCommand = outputCommands[jumps[j]];
					if (outputCommand.code === commands.loop.code) {
						outputCommands[jumps[j]].params[1].value = label.index;
					} else {
						outputCommands[jumps[j]].params[0].value = label.index;
					}
				}
			}
		};

		this.splitParams = function(params) {
			var result 	= [],
				param 	= '',
				j 		= 0;

			while (j < params.length) {
				var c = params[j];
				switch (c) {
					case ',':
						param = param.trim();
						(param !== '') && result.push(param);
						param = '';
						break;

					case '[':
						while (j < params.length) {
							var c = params[j++];
							param += c;
							if (c === ']') {
								break;
							}
						}
						break;

					case '"':
						j++;
						param += '"';
						while (j < params.length) {
							var c = params[j++];
							param += c;
							if (c === '"') {
								break;
							}
						}
						break;

					default:
						param += c;
						break;
				}
				j++;
			}
			param = param.trim();
			(param !== '') && result.push(param);

			return result;
		};

		this.compileCall = function(line) {
			var compilerData 	= this._compilerData,
				i 				= line.indexOf('('),
				procedure 		= line.substr(0, i),
				valid 			= '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';

			if (!this.validateString(procedure)) {
				throw this.createError('Syntax error.');
			}

			var callCommand,
				p 						= compilerData.findProcedure(procedure),
				currentLocalStackSize 	= compilerData.getLocalOffset();

			if (p !== null) {
				callCommand = {
					command: 	'call',
					code: 		commands['call'].code,
					params: [
						{
							value: p.index
						},
						{
							value: currentLocalStackSize
						}
					]
				};
			} else {
				var local = compilerData.findLocal(procedure);
				if (local !== null) {
					if (local.type !== T_PROC_LOCAL) {
						throw this.createError('Type error, can not call "' + procedure + '".');
					}
					callCommand = {
						command: 	'call_local',
						code: 		commands.call_global.code,
						params: [
							{
								value: 	local.offset,
								type: 	T_NUMBER_LOCAL
							},
							{
								value: currentLocalStackSize
							}
						]
					};
				} else {
					var global = compilerData.findGlobal(procedure)
					if (global !== null) {
						if (global.type !== T_PROC_GLOBAL) {
							throw this.createError('Type error, can not call "' + procedure + '".');
						}
						callCommand = {
							command: 	'call_global',
							code: 		commands.call_global.code,
							params: [
								{
									value: 	global.offset,
									type: 	T_NUMBER_GLOBAL
								},
								{
									value: currentLocalStackSize
								}
							]
						};
					} else {
						throw this.createError('Unknown procedure "' + procedure + '".');
					}
				}
			}

			var params = line.substr(i + 1, line.length - i - 2).trim();
			params = params.length ? params.split(',') : [];

			// The local offset is the stack size used in the current procedure...
			var offset = currentLocalStackSize;
			for (var i = 0; i < params.length; i++) {
				var param = params[i].trim();
				if (param !== '') {
					var paramInfo 	= this.paramInfo(param),
						destParam;
						vr 			= paramInfo.vr,
						size 		= vr.size * vr.length;

					switch (paramInfo.type) {
						case T_NUMBER_LOCAL:
							destParam = {
								type: 	T_NUMBER_LOCAL,
								value: 	offset,
								param: 	param
							};
							this.addOutputCommand(this.createCommand('set', [destParam, paramInfo]));
							break;

						case T_NUMBER_LOCAL_ARRAY:
						case T_STRUCT_LOCAL_ARRAY:
						case T_STRUCT_LOCAL:
							this.addOutputCommand(this.createCommand(
								'set',
								[
									{type: T_NUMBER_REGISTER, value: 'REG_OFFSET_SRC'},
									{type: T_NUMBER_CONSTANT, value: paramInfo.value} // Offset of local parameter value
								]
							));
							this.addOutputCommand(this.createCommand(
								'set',
								[
									{type: T_NUMBER_REGISTER, value: 'REG_OFFSET_DEST'},
									{type: T_NUMBER_CONSTANT, value: offset}
								]
							));
							this.addOutputCommand(this.createCommand(
								'copy_local_local',
								[
									{type: T_NUMBER_CONSTANT, value: size}
								]
							));
							break;

						case T_NUMBER_GLOBAL:
							destParam = {
								type: 	T_NUMBER_LOCAL,
								value: 	offset,
								param: 	param
							};
							this.addOutputCommand(this.createCommand('set', [destParam, paramInfo]));
							break;

						case T_NUMBER_GLOBAL_ARRAY:
						case T_STRUCT_GLOBAL_ARRAY:
						case T_STRUCT_GLOBAL:
							this.addOutputCommand(this.createCommand(
								'set',
								[
									{type: T_NUMBER_REGISTER, value: 'REG_OFFSET_SRC'},
									{type: T_NUMBER_CONSTANT, value: paramInfo.value} // Offset of local parameter value
								]
							));
							this.addOutputCommand(this.createCommand(
								'set',
								[
									{type: T_NUMBER_REGISTER, value: 'REG_OFFSET_DEST'},
									{type: T_NUMBER_CONSTANT, value: offset}
								]
							));
							this.addOutputCommand(this.createCommand(
								'copy_global_local',
								[
									{type: T_NUMBER_CONSTANT, value: size}
								]
							));
							break;

						default:
							throw this.createError('Type mismatch.');
					}

					offset += size;
				}
			}

			this.addOutputCommand(callCommand);
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
						compilerData.declareLocal(param[1], T_NUMBER_LOCAL, T_NUMBER_LOCAL_ARRAY, false);
						break;

					default:
						var struct = compilerData.findStruct(param[0]);
						if (struct === null) {
							throw this.createError('Unknown type "' + param[0] + '".');
						}
						compilerData.declareLocal(param[1], T_STRUCT_LOCAL, T_STRUCT_LOCAL_ARRAY, struct, false);
						break;
				}
				outputCommand.paramTypes.push(param[0]);
			}

			return procStartIndex;
		};

		this.compileLabels = function(lines) {
			for (var i = 0; i < lines.length; i++) {
				this._lineNumber = i;
				var line 		= lines[i].trim(),
					location 	= {
						filename: 	this._filename,
						lineNumber: i
					};
				if (this.hasLabel(line)) {
					var j = line.indexOf(':');
					if (this._compilerData.declareLabel(line.substr(0, j), location)) {
						throw this.createError('Duplicate label "' + name + '".');
					}
				}
			}
		};

		this.compileArrayR = function(command, params) {
			var size = 1,
				type = params[0].type;
			if ((type === T_STRUCT_GLOBAL) || (type === T_STRUCT_LOCAL)) {
				var destStructName 	= params[0].vr.struct.name,
					srcStructName 	= params[1].vr.struct.name;
				if (destStructName !== srcStructName) {
					throw this.createError('Type mismatch "' + destStructName + '" and "' + srcStructName + '".');
				}
				size = params[0].vr.struct.size;
			}

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
			this.addOutputCommand({
				command: 	'set',
				code: 		commands.set.code,
				params: [
					{
						type: 	T_NUMBER_REGISTER,
						value: 	'REG_SIZE'
					},
					{
						type: 	T_NUMBER_CONSTANT,
						value: 	size
					}
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
							value: 	this._compilerData.findRegister('REG_OFFSET')
						},
						{
							type: 	T_NUMBER_CONSTANT,
							value: 	size
						}
					]
				});
			}
		};

		this.compileArrayW = function(command, params) {
			var size = 1,
				type = params[0].type;
			if ((type === T_STRUCT_GLOBAL_ARRAY) || (type === T_STRUCT_LOCAL_ARRAY)) {
				var destStructName 	= params[0].vr.struct.name,
					srcStructName 	= params[2].vr.struct.name;
				if (destStructName !== srcStructName) {
					throw this.createError('Type mismatch "' + destStructName + '" and "' + srcStructName + '".');
				}
				size = params[0].vr.struct.size;
			}

			// Remove the second parameter which is the index and
			// add a command to move the value to the REG_OFFSET...
			var destParam = command.params[0];
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
			this.addOutputCommand({
				command: 	'set',
				code: 		commands.set.code,
				params: [
					{
						type: 	T_NUMBER_REGISTER,
						value: 	'REG_SIZE'
					},
					{
						type: 	T_NUMBER_CONSTANT,
						value: 	size
					}
				]
			});

			// Check if the item size is greater than 1, if so multiply with the item size...
			var vr 		= destParam.vr,
				size 	= vr.field ? vr.field.size : vr.size;
			this.addOutputCommand({
				command: 	'mul',
				code: 		commands.mul.code,
				params: [
					{
						type: 	T_NUMBER_REGISTER,
						value: 	this._compilerData.findRegister('REG_OFFSET')
					},
					{
						type: 	T_NUMBER_CONSTANT,
						value: 	size
					}
				]
			});
		};

		this.compileNumberDeclaration = function(params) {
			var compilerData = this._compilerData;
			if (this._activeStruct !== null) {
				for (var i = 0; i < params.length; i++) {
					compilerData.declareStructField(params[i], T_NUMBER_GLOBAL, T_NUMBER_GLOBAL_ARRAY);
				}
			} else if (this._procStartIndex === -1) {
				for (var i = 0; i < params.length; i++) {
					var global = compilerData.declareGlobal(params[i], T_NUMBER_GLOBAL, T_NUMBER_GLOBAL_ARRAY, null, location, true);
					if (global.value) {
						if (global.type === T_NUMBER_GLOBAL) {
							var value = parseFloat(global.value);
							if (isNaN(value)) {
								throw this.createError('Number expected, found "' + value + '".');
							}
							compilerData.declareConstant(global.offset, [value]);
						} else if (global.type === T_NUMBER_GLOBAL_ARRAY) {
							var value = global.value.trim();
							if (value.length && (value[0] === '[') && (value[value.length - 1] !== ']')) {
								throw this.createError('Syntax error.');
							} else {
								value = value.substr(1, value.length - 2);
								var values 	= value.split(','),
									data 	= [];
								for (var j = 0; j < values.length; j++) {
									var v = parseFloat(values[j].trim());
									if (isNaN(v)) {
										throw this.createError('Number expected, found "' + values[j] + '".');
									}
									data.push(v);
								}
								compilerData.declareConstant(global.offset, data);
							}
						} else {
							throw this.createError('Type error.');
						}
					}
				}
			} else {
				for (var j = 0; j < params.length; j++) {
					var local = compilerData.declareLocal(params[j], T_NUMBER_LOCAL, T_NUMBER_LOCAL_ARRAY, null, true);
					if (local.value) {
						if (local.type === T_NUMBER_LOCAL) {
							var value = parseFloat(local.value);
							if (isNaN(value)) {
								throw this.createError('Number expected, found "' + value + '".');
							}
							this.addOutputCommand(this.createCommand(
								'set',
								[
									{type: T_NUMBER_LOCAL, 		value: local.offset},
									{type: T_NUMBER_CONSTANT, 	value: value}
								]
							));
						} else if (global.type === T_NUMBER_GLOBAL_ARRAY) {
							//compilerData.declareConstant(global.offset, [value]);
						} else {
							throw this.createError('Type error.');
						}
					}
				}
			}
		};

		this.compileProcedureDeclaration = function(params) {
			var j = params.indexOf('(');
			if ((j !== -1) && (params.substr(-1) === ')')) {
				this._procStartIndex = this.compileProcedure(params);
			} else {
				params = params.split(',');
				for (var j = 0; j < params.length; j++) {
					params[j] = params[j].trim();
				}

				if (this._activeStruct !== null) {
					for (var j = 0; j < params.length; j++) {
						compilerData.declareStructField(params[j], T_PROC_GLOBAL, T_PROC_GLOBAL_ARRAY);
					}
				} else if (this._procStartIndex === -1) {
					for (var j = 0; j < params.length; j++) {
						compilerData.declareGlobal(params[j], T_PROC_GLOBAL, T_PROC_GLOBAL_ARRAY, null, location, false);
					}
				} else {
					for (var j = 0; j < params.length; j++) {
						compilerData.declareLocal(params[j], T_PROC_LOCAL, T_PROC_LOCAL_ARRAY, false);
					}
				}
			}
		};

		this.compileLines = function(lines) {
			var compilerData 	= this._compilerData,
				outputCommands 	= this._outputCommands;

			this._procStartIndex 	= -1;
			this._activeStruct 		= null;
			for (var i = 0; i < lines.length; i++) {
				this._lineNumber = i;

				var location = {
						filename: 	this._filename,
						lineNumber: i
					};

				var line = lines[i].trim();
				if (line !== '') {
					if (this.hasCall(line)) {
						this.compileCall(line);
					} else if (line.indexOf(' ') === -1) {
						if (this.hasLabel(line)) {
							var label = compilerData.findLabel(line.substr(0, line.length - 1));
							label.index = outputCommands.length - 1;
						} else if (line === 'ends') {
							this._activeStruct = null;
						} else if (line === 'endp') {
							if (this._activeStruct !== null) {
								throw this.createError('Invalid command "endp".');
							}
							this.addOutputCommand({
								command: 	'ret',
								code: 		commands.ret.code
							});
							outputCommands[this._procStartIndex].localCount = compilerData.getLocalOffset();
							this._procStartIndex 	= -1;
							compilerData.resetLocal();
						} else {
							var command = line;
							if (this._activeStruct !== null) {
								throw this.createError('Invalid command "' + command + '".');
							}
							if (command in commands) {
								var args = commands[command];
								this.addOutputCommand({
									command: 	command,
									code: 		args.code
								});
							} else {
								throw this.createError('Unknown command "' + command + '".');
							}
						}
					} else {
						var j 		= line.indexOf(' '),
							command = line.substr(0, j),
							params 	= line.substr(j - line.length + 1).trim();
						if (params !== '') {
							if (command === 'proc') {
								this.compileProcedureDeclaration(params);
							} else if (command === 'struct') {
								this._activeStruct = compilerData.declareStruct(params, command, location);
							} else {
								params = this.splitParams(params);
								switch (command) {
									case 'number':
										this.compileNumberDeclaration(params);
										break;

									default:
										var validatedCommand = this.validateCommand(command, params);
										if (validatedCommand === false) {
											var struct = compilerData.findStruct(command);
											if (struct === null) {
												throw this.createError('Unknown command "' + command + '".');
											} else if (this._activeStruct !== null) {
												throw this.createError('Nested structs are not supported "' + command + '".');
											} else if (this._procStartIndex === -1) {
												for (var j = 0; j < params.length; j++) {
													compilerData.declareGlobal(params[j], T_STRUCT_GLOBAL, T_STRUCT_GLOBAL_ARRAY, struct, location);
												}
											} else {
												for (var j = 0; j < params.length; j++) {
													compilerData.declareLocal(params[j], T_STRUCT_LOCAL, T_STRUCT_LOCAL_ARRAY, struct);
												}
											}
										} else {
											switch (validatedCommand.command) {
												case 'arrayr': // Array read...
													this.compileArrayR(validatedCommand, params);
													break;

												case 'arrayw': // Array write...
													this.compileArrayW(validatedCommand, params);
													break;
											}

											this.addOutputCommand(validatedCommand);
											break;
									}
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

			var outputCommands = this._outputCommands;
			for (var i = 0; i < outputCommands.length; i++) {
				var outputCommand 	= outputCommands[i],
					params 			= outputCommand.params;
				for (var j = 0; j < params.length; j++) {
					switch (params[j].type) {
						case T_PROC:
							params[j].type = T_NUMBER_CONSTANT;
							break;

						case T_PROC_GLOBAL:
							params[j].type = T_NUMBER_GLOBAL;
							break;

						case T_PROC_GLOBAL_ARRAY:
							params[j].type = T_NUMBER_GLOBAL_ARRAY;
							break;

						case T_PROC_LOCAL:
							params[j].type = T_NUMBER_LOCAL;
							break;

						case T_PROC_LOCAL_ARRAY:
							params[j].type = T_NUMBER_LOCAL_ARRAY;
							break;
					}
				}
			}

			outputCommands.mainIndex = this._mainIndex;
			return outputCommands;
		};

		this.getIncludes = function() {
			return this._includes;
		};

		this.getCompilerData = function() {
			return this._compilerData;
		};
	});