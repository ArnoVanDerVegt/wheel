var Call = Class(CommandCompiler, function(supr) {
		this.compile = function(line) {
			var compiler 		= this._compiler,
				compilerData 	= this._compilerData,
				i 				= line.indexOf('('),
				procedure 		= line.substr(0, i);

			if (!compilerHelper.validateString(procedure)) {
				throw compiler.createError('Syntax error.');
			}

			var callCommand,
				p 						= compilerData.findProcedure(procedure),
				currentLocalStackSize 	= compilerData.getLocalOffset();

			if (p !== null) {
				callCommand = {
					command: 	'call',
					code: 		commands['call'].code,
					params: [
						{value: p.index},
						{value: currentLocalStackSize}
					]
				};
			} else {
				var local = compilerData.findLocal(procedure);
				if (local !== null) {
					if (local.type !== T_PROC_LOCAL) {
						throw compiler.createError('Type error, can not call "' + procedure + '".');
					}
					callCommand = {
						command: 	'call_local',
						code: 		commands.call_global.code,
						params: [
							{value: local.offset, type: T_NUMBER_LOCAL},
							{value: currentLocalStackSize}
						]
					};
				} else {
					var global = compilerData.findGlobal(procedure)
					if (global !== null) {
						if (global.type !== T_PROC_GLOBAL) {
							throw compiler.createError('Type error, can not call "' + procedure + '".');
						}
						callCommand = {
							command: 	'call_global',
							code: 		commands.call_global.code,
							params: [
								{value: global.offset, type: T_NUMBER_GLOBAL},
								{value: currentLocalStackSize}
							]
						};
					} else {
						throw compiler.createError('Unknown procedure "' + procedure + '".');
					}
				}
			}

			var params = line.substr(i + 1, line.length - i - 2).trim();
			params = compilerHelper.splitParams(params);

			// The local offset is the stack size used in the current procedure...
			var offset = currentLocalStackSize;
			for (var i = 0; i < params.length; i++) {
				var param = params[i].trim();
				if (param !== '') {
					var paramInfo 	= compilerData.paramInfo(param),
						destParam;
						vr 			= paramInfo.vr,
						size 		= vr ? (vr.size * vr.length) : 1;
					switch (paramInfo.type) {
						case T_NUMBER_LOCAL:
							destParam = {
								type: 	T_NUMBER_LOCAL,
								value: 	offset,
								param: 	param
							};
							compiler.getOutput().add(compiler.createCommand('set', [destParam, paramInfo]));
							break;

						case T_NUMBER_LOCAL_ARRAY:
						case T_STRUCT_LOCAL_ARRAY:
						case T_STRUCT_LOCAL:
							compiler.getOutput().add(compiler.createCommand(
								'set',
								[
									{type: T_NUMBER_REGISTER, value: 'REG_OFFSET_SRC'},
									{type: T_NUMBER_CONSTANT, value: paramInfo.value} // Offset of local parameter value
								]
							));
							compiler.getOutput.add(compiler.createCommand(
								'set',
								[
									{type: T_NUMBER_REGISTER, value: 'REG_OFFSET_DEST'},
									{type: T_NUMBER_CONSTANT, value: offset}
								]
							));
							compiler.getOutput().add(compiler.createCommand(
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
							compiler.getOutput().add(compiler.createCommand('set', [destParam, paramInfo]));
							break;

						case T_NUMBER_GLOBAL_ARRAY:
						case T_STRUCT_GLOBAL_ARRAY:
						case T_STRUCT_GLOBAL:
							if (paramInfo.value) {
								if (paramInfo.type === T_NUMBER_GLOBAL_ARRAY) {
									var data = compilerHelper.parseNumberArray(paramInfo.value);
									size 			= data.length;
									paramInfo.value = compilerData.allocateGlobal(size);
									compilerData.declareConstant(paramInfo.value, data);
								} else {
									throw compiler.createError('Type mismatch.');
								}
							}
							compiler.getOutput().add(compiler.createCommand(
								'set',
								[
									{type: T_NUMBER_REGISTER, value: 'REG_OFFSET_SRC'},
									{type: T_NUMBER_CONSTANT, value: paramInfo.value} // Offset of local parameter value
								]
							));
							compiler.getOutput().add(compiler.createCommand(
								'set',
								[
									{type: T_NUMBER_REGISTER, value: 'REG_OFFSET_DEST'},
									{type: T_NUMBER_CONSTANT, value: offset}
								]
							));
							compiler.getOutput().add(compiler.createCommand(
								'copy_global_local',
								[
									{type: T_NUMBER_CONSTANT, value: size}
								]
							));
							break;

						default:
							throw compiler.createError('Type mismatch.');
					}

					offset += size;
				}
			}

			compiler.getOutput().add(callCommand);
		};
	});
