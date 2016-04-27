var Compiler = Class(function() {
		this.init = function(opts) {
			this._registers 		= opts.registers;
			this._compilerData 		= new CompilerData({compiler: this, registers: opts.registers});
			this._output		 	= new CompilerOutput({compiler: this, registers: opts.registers});
			this._mainIndex 		= -1;
			this._filename 			= '';
			this._lineNumber		= 0;
			this._includes 			= null;
			this._procStartIndex 	= -1;
			this._activeStruct 		= null;

			var compilerOpts = {
					compiler: 		this,
					compilerData: 	this._compilerData
				},
				constructors = [
					'NumberDeclaration',
					'ProcedureDeclaration',
					'Call',
					'Label',
					'ArrayR',
					'ArrayW'
				];

			this._compilers = {};
			for (var i = 0; i < constructors.length; i++) {
				this._compilers[constructors[i]] = new window[constructors[i]](compilerOpts); // Needs namespace!
			}
		};

		this.createError = function(message) {
			var error = new Error(message);
			error.location = {
				filename: 	this._filename,
				lineNumber: this._lineNumber
			};
			return error;
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
				params[i] = this._compilerData.paramInfo(params[i]);
			}
			return this.createCommand(command, params);
		};

		this.compileLines = function(lines) {
			var compilerData 	= this._compilerData,
				output 			= this._output;

			this._procStartIndex 	= -1;
			this._activeStruct 		= null;
			for (var i = 0; i < lines.length; i++) {
				var line = lines[i].trim();
				if (line === '') {
					continue;
				}

				this._lineNumber = i;

				var location = {
						filename: 	this._filename,
						lineNumber: i
					};

				if ((line.indexOf('proc') === -1) && (line.indexOf('(') !== -1)) {
					this._compilers.Call.compile(line);
				} else if (this._compilers.Label.hasLabel(line)) {
					compilerData.findLabel(line.substr(0, line.length - 1)).index = output.getLength() - 1;
				} else {
					var spacePos = line.indexOf(' ');
					if (spacePos === -1) {
						command = line;
						params 	= '';
					} else {
						command = line.substr(0, spacePos),
						params 	= line.substr(spacePos - line.length + 1).trim();
					}

					switch (command) {
						case 'proc':
							this._compilers.ProcedureDeclaration.compile(params);
							break;

						case 'endp':
							if (this._activeStruct !== null) {
								throw this.createError('Invalid command "endp".');
							}
							this.getOutput().add({
								command: 	'ret',
								code: 		commands.ret.code
							});
							output.getBuffer()[this._procStartIndex].localCount = compilerData.getLocalOffset();
							this._procStartIndex = -1;
							compilerData.resetLocal();
							break;

						case 'struct':
							this._activeStruct = compilerData.declareStruct(params, command, location);
							break;

						case 'ends':
							this._activeStruct = null;
							break;

						case 'number':
							params = compilerHelper.splitParams(params);
							this._compilers.NumberDeclaration.compile(params);
							break;

						default:
							params = compilerHelper.splitParams(params);
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
										this._compilers.ArrayR.compile(validatedCommand, params);
										break;

									case 'arrayw': // Array write...
										this._compilers.ArrayW.compile(validatedCommand, params);
										break;

									default:
										this.getOutput().add(validatedCommand);
										break;
								}
							}
							break;
					}
				}
			}

			return output.getBuffer();
		};

		this.compile = function(includes) {
			var compilerData 	= this._compilerData,
				output 			= this._output;

			compilerData.reset();
			output.reset();
			this._mainIndex = -1;
			this._includes 	= includes;

			var i = includes.length;
			while (i) {
				i--;
				this._filename = includes[i].filename;
				var lines = includes[i].lines;
				this._compilers.Label.compile(lines);
				this.compileLines(lines);
				this._compilers.Label.updateLabels();
			}

			if (this._mainIndex === -1) {
				throw this.createError('No main procedure found.');
			}

			output.optimizeTypes();
			output.setGlobalOffset(compilerData.getGlobalOffset());
			output.setMainIndex(this._mainIndex);
			output.getLines();

			return output;
		};

		this.getIncludes = function() {
			return this._includes;
		};

		this.getOutput = function() {
			return this._output;
		};

		this.getCompilerData = function() {
			return this._compilerData;
		};

		this.getProcStartIndex = function() {
			return this._procStartIndex;
		};

		this.setProcStartIndex = function(procStartIndex) {
			this._procStartIndex = procStartIndex;
		};

		this.getActiveStruct = function() {
			return this._activeStruct;
		};

		this.setMainIndex = function(mainIndex) {
			this._mainIndex = mainIndex;
		};
	});