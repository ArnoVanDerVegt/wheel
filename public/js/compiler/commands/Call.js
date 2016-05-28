wheel(
	'compiler.commands.Call',
	Class(wheel.compiler.commands.CommandCompiler, function(supr) {
		this.compile = function(line) {
			var compiler 		= this._compiler,
				compilerData 	= this._compilerData,
				i 				= line.indexOf('('),
				procedure 		= line.substr(0, i);

			if (!wheel.compiler.compilerHelper.validateString(procedure)) {
				throw compiler.createError('Syntax error.');
			}

			var callCommand,
				p 						= compilerData.findProcedure(procedure),
				currentLocalStackSize 	= compilerData.getLocalOffset();

			if (p !== null) {
				callCommand = {
					command: 	'call',
					code: 		wheel.compiler.command['call'].code,
					params: [
						{type: wheel.compiler.command.T_NUMBER_CONSTANT, value: p.index},
						{type: wheel.compiler.command.T_NUMBER_CONSTANT, value: currentLocalStackSize}
					]
				};
			} else {
				var local = compilerData.findLocal(procedure);
				if (local !== null) {
					if (local.type !== wheel.compiler.command.T_PROC_LOCAL) {
						throw compiler.createError('Type error, can not call "' + procedure + '".');
					}
					callCommand = {
						command: 	'call_var',
						code: 		wheel.compiler.command.call_var.code,
						params: [
							{type: wheel.compiler.command.T_NUMBER_LOCAL, 		value: local.offset},
							{type: wheel.compiler.command.T_NUMBER_CONSTANT, 	value: currentLocalStackSize}
						]
					};
				} else {
					var global = compilerData.findGlobal(procedure)
					if (global !== null) {
						if (global.type !== wheel.compiler.command.T_PROC_GLOBAL) {
							throw compiler.createError('Type error, can not call "' + procedure + '".');
						}
						callCommand = {
							command: 	'call_var',
							code: 		wheel.compiler.command.call_var.code,
							params: [
								{type: wheel.compiler.command.T_NUMBER_GLOBAL, 	value: global.offset},
								{type: wheel.compiler.command.T_NUMBER_CONSTANT, 	value: currentLocalStackSize}
							]
						};
					} else {
						throw compiler.createError('Unknown procedure "' + procedure + '".');
					}
				}
			}

			var params = line.substr(i + 1, line.length - i - 2).trim();
			params = wheel.compiler.compilerHelper.splitParams(params);

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
						case wheel.compiler.command.T_NUMBER_CONSTANT:
							destParam = {
								type: 	wheel.compiler.command.T_NUMBER_LOCAL,
								value: 	offset,
								param: 	param
							};
							compiler.getOutput().add(compiler.createCommand('set', [destParam, paramInfo]));
							break;

						case wheel.compiler.command.T_NUMBER_LOCAL:
							destParam = {
								type: 	wheel.compiler.command.T_NUMBER_LOCAL,
								value: 	offset,
								param: 	param
							};
							compiler.getOutput().add(compiler.createCommand('set', [destParam, paramInfo]));
							break;

						case wheel.compiler.command.T_NUMBER_LOCAL_ARRAY:
						case wheel.compiler.command.T_STRUCT_LOCAL_ARRAY:
						case wheel.compiler.command.T_STRUCT_LOCAL:
							console.log('check code');
							compiler.getOutput().add(compiler.createCommand(
								'set',
								[
									{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index},
									{type: wheel.compiler.command.T_NUMBER_CONSTANT, value: paramInfo.value} // Offset of local parameter value
								]
							));
							compiler.getOutput.add(compiler.createCommand(
								'set',
								[
									{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
									{type: wheel.compiler.command.T_NUMBER_CONSTANT, value: offset}
								]
							));
							compiler.getOutput().add(compiler.createCommand(
								'copy',
								[
									{type: wheel.compiler.command.T_NUMBER_CONSTANT, value: size}
								]
							));
							break;

						case wheel.compiler.command.T_NUMBER_GLOBAL:
							destParam = {
								type: 	wheel.compiler.command.T_NUMBER_LOCAL,
								value: 	offset,
								param: 	param
							};
							compiler.getOutput().add(compiler.createCommand('set', [destParam, paramInfo]));
							break;

						case wheel.compiler.command.T_NUMBER_GLOBAL_ARRAY:
						case wheel.compiler.command.T_STRUCT_GLOBAL_ARRAY:
						case wheel.compiler.command.T_STRUCT_GLOBAL:
							if (paramInfo.value) {
								if (paramInfo.type === wheel.compiler.command.T_NUMBER_GLOBAL_ARRAY) {
									var data = wheel.compiler.compilerHelper.parseNumberArray(paramInfo.value);
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
									{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index},
									{type: wheel.compiler.command.T_NUMBER_CONSTANT, value: paramInfo.value} // Offset of local parameter value
								]
							));
							compiler.getOutput().add(compiler.createCommand(
								'set',
								[
									{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
									{type: wheel.compiler.command.T_NUMBER_CONSTANT, value: offset}
								]
							));
							compiler.getOutput().add(compiler.createCommand(
								'add',
								[
									{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
									{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_STACK').index},
								]
							));
							compiler.getOutput().add(compiler.createCommand(
								'copy',
								[
									{type: wheel.compiler.command.T_NUMBER_CONSTANT, value: size}
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
	})
);