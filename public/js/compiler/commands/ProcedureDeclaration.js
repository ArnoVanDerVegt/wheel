var ProcedureDeclaration = Class(CommandCompiler, function(supr) {
		this.compileProcedure = function(params) {
			var compiler 		= this._compiler,
				compilerData 	= this._compilerData,
				outputCommands 	= compiler.getOutput().getBuffer(),
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
			compiler.getOutput().add(outputCommand);

			var j 			= params.indexOf('('),
				procedure 	= params.substr(0, j);
			compilerData.declareProcedure(procedure, outputCommands[outputCommands.length - 1], outputCommands.length - 1);

			if (procedure === 'main') {
				compiler.setMainIndex(procStartIndex);
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

		this.compile = function(params) {
			var compiler 		= this._compiler,
				compilerData 	= this._compilerData,
				j 				= params.indexOf('(');
			if ((j !== -1) && (params.substr(-1) === ')')) {
				compiler.setProcStartIndex(this.compileProcedure(params));
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
	});