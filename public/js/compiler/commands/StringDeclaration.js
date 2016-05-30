/**
 * Compile a string declaration.
 *
 * 		string n1 [, n2[, n3[, ...]]]
 *
 * This code compiles string declarations in three scopes: global, local and struct.
 *
**/
wheel(
	'compiler.commands.StringDeclaration',
	Class(wheel.compiler.commands.CommandCompiler, function(supr) {
		this.compile = function(validatedCommand, params) {
			var compiler 		= this._compiler,
				compilerOutput 	= compiler.getOutput(),
				compilerData 	= this._compilerData;

			if (compiler.getActiveStruct() !== null) {
				/**
				 * Declare a string of array of strings field in a struct...
				**/
				for (var i = 0; i < params.length; i++) {
					var structField = compilerData.declareStructField(params[i], wheel.compiler.command.T_NUMBER_GLOBAL, wheel.compiler.command.T_NUMBER_GLOBAL_ARRAY);
					structField && (structField.metaType = wheel.compiler.command.T_STRING);
				}
			} else if (compiler.getInProc()) {
				/**
				 * Declare a local string constant...
				**/
				for (var j = 0; j < params.length; j++) {
					var local = compilerData.declareLocal(params[j], wheel.compiler.command.T_NUMBER_LOCAL, wheel.compiler.command.T_NUMBER_LOCAL_ARRAY, null, true);
					local.metaType = wheel.compiler.command.T_STRING;

					/**
					 * Check if the string declaration had a constant value assigned to it...
					**/
					if (local.value) {
						console.log(local.value);

						if (local.type === wheel.compiler.command.T_NUMBER_LOCAL) { // Like: string s = "abc"
							var value = local.value;
							if ((value.length < 2) || (value[0] !== '"') || (value.substr(-1) !== '"')) {
								throw compiler.createError('String expected, found "' + value + '".');
							}
							var offset = compilerData.declareString(value.substr(1, value.length - 2));
							// Set the the value at the address of the local variable...
							compilerOutput.add(compiler.createCommand(
								'set',
								[
									{type: wheel.compiler.command.T_NUMBER_LOCAL, 		value: local.offset},
									{type: wheel.compiler.command.T_NUMBER_CONSTANT, 	value: offset}
								]
							));
						} else if (local.type === wheel.compiler.command.T_NUMBER_LOCAL_ARRAY) { // Like: string arr[3] = ["a", "b", "c"]
							var size 	= local.size * local.length,
								offset 	= compilerData.allocateGlobal(size); // Allocate space...
							// Store the data which should be placed at the just allocated space:

							compilerData.declareConstant(offset, wheel.compiler.compilerHelper.parseStringArray(local.value, compiler, compilerData));

							// Copy the data from the global offset to the local offset...
							compilerOutput.add(compiler.createCommand(
								'set',
								[
									{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index},
									{type: wheel.compiler.command.T_NUMBER_CONSTANT, value: offset}
								]
							));
							if (local.offset === 0) {
								compilerOutput.add(compiler.createCommand(
									'set',
									[
										{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
										{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_STACK').index}
									]
								));
							} else {
								compilerOutput.add(compiler.createCommand(
									'set',
									[
										{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
										{type: wheel.compiler.command.T_NUMBER_CONSTANT, value: local.offset}
									]
								));
								compilerOutput.add(compiler.createCommand(
									'add',
									[
										{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
										{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_STACK').index}
									]
								));
							}
							compilerOutput.add(compiler.createCommand(
								'copy',
								[
									{type: wheel.compiler.command.T_NUMBER_CONSTANT, value: size}
								]
							));
						} else {
							throw compiler.createError('Type error.');
						}
					}
				}
			} else {
				/**
				 * Declare a global string or array of strings...
				**/
				for (var i = 0; i < params.length; i++) {
					var global = compilerData.declareGlobal(params[i], wheel.compiler.command.T_NUMBER_GLOBAL, wheel.compiler.command.T_NUMBER_GLOBAL_ARRAY, null, location, true);
					global.metaType = wheel.compiler.command.T_STRING;
					/**
					 * Check if the string declaration had a constant value assigned to it...
					**/
					if (global.value) {
						if (global.type === wheel.compiler.command.T_NUMBER_GLOBAL) { // Like: string n = "abc"
							var value = parseFloat(global.value);
							if (isNaN(value)) {
								throw compiler.createError('String expected, found "' + value + '".');
							}
							compilerData.declareConstant(global.offset, [value]);
						} else if (global.type === wheel.compiler.command.T_NUMBER_GLOBAL_ARRAY) { // Like: string arr[3] = ["a", "b", "c"]
							var value 	= global.value.trim(),
								data 	= wheel.compiler.compilerHelper.parseStringArray(value, compiler, compilerData);
							compilerData.declareConstant(global.offset, data);
						} else {
							throw compiler.createError('Type error.');
						}
					}
				}
			}
		};
	})
);