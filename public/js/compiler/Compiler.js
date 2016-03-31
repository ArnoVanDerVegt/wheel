var Compiler = Class(function() {
		this.init = function(opts) {
			this._compilerData 		= new CompilerData({registers: opts.registers});
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
					type: 	'nc', // Number constant
					value: 	1,
					param: 	param
				}
			} else if (param === 'FALSE') {
				return {
					type: 	'nc', // Number constant
					value: 	0,
					param: 	param
				}
			} else if ((param.length > 2) && (param[0] === '"') && (param.substr(-1) === '"')) {
				return {
					type: 	'sc', // String constant
					value: 	param.substr(1, param.length - 2),
					param: 	param
				};
			} else if (!isNaN(parseInt(param, 10))) {
				return {
					type: 	'nc', // Num constant
					value: 	parseInt(param, 10),
					param: 	param
				};
			} else {
				var compilerData = this._compilerData,
					index,
					type 	= null;

				index = compilerData.findRegister(param);
				if (index !== null) {
					type 	= index;
					index 	= param;
				} else {
					index = compilerData.findLocal(param);
					if (index !== null) {
						type = 'nl'; // Num local
					} else {
						index = compilerData.findGlobal(param);
						if (index !== null) {
							type = 'ng'; // Num global
						} else {
							index = compilerData.findLabel(param);
							if (index !== null) {
								type = 'la';
							}
						}
					}
				}

				if (type === null) {
					throw this.createError('Undefined identifier "' + param + '".');
				}

				return {
					type: 	type,
					value: 	index,
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
							case 'number': 	destParam = { type: 'nl', value: p.command.localCount + i, param: param }; break;
						}
						this.addOutputCommand(this.createCommand('set', [destParam, this.paramInfo(param)]));
					}
				}

				this.addOutputCommand({
					command: 	'call',
					code: 		82,
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
					code: 		0,
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
					case 'bool':
						compilerData.declareLocal(param[1]);
						break;

					case 'number':
						compilerData.declareLocal(param[1]);
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

		this.compileLines = function(lines) {
			var compilerData 	= this._compilerData,
				outputCommands 	= this._outputCommands,
				procStartIndex 	= -1,
				activeProc 		= null;

			for (var i = 0; i < lines.length; i++) {
				this._lineNumber = i;
				var line = lines[i].trim();
				if (line !== '') {
					if ((line.indexOf('proc') === -1) && (line.indexOf('(') !== -1)) {
						this.compileCall(line);
					} else if (line.indexOf(' ') === -1) {
						if ((line.length > 1) && (line.substr(-1) === ':')) {
							compilerData.declareLabel(line.substr(0, line.length - 1), outputCommands.length - 1);
						} else if (line === 'endp') {
							this.addOutputCommand({
								command: 	'ret',
								code: 		81
							});
							outputCommands[procStartIndex].localCount = compilerData.getLocalIndex();
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
									case 'bool':
										if (procStartIndex === -1) {
											for (var j = 0; j < params.length; j++) {
												compilerData.declareGlobal(params[j]);
											}
										} else {
											for (var j = 0; j < params.length; j++) {
												compilerData.declareLocal(params[j]);
											}
										}
										break;

									case 'number':
										if (procStartIndex === -1) {
											for (var j = 0; j < params.length; j++) {
												compilerData.declareGlobal(params[j]);
											}
										} else {
											for (var j = 0; j < params.length; j++) {
												compilerData.declareLocal(params[j]);
											}
										}
										break;

									default:
										command = this.validateCommand(command, params);
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
				this.compileLines(includes[i].lines);
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