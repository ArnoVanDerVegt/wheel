/**
 * Compile a number declaration.
 *
 * 		number n1 [, n2[, n3[, ...]]]
 *
 * This code compiles number declarations in three scopes: global, local and struct.
 *
**/
var NumberDeclaration = Class(CommandCompiler, function(supr) {
		this.compile = function(params) {
			var compiler 		= this._compiler,
				compilerData 	= this._compilerData;

			if (compiler.getActiveStruct() !== null) {
				/**
				 * Declare a number of array of numbers field in a struct...
				**/
				for (var i = 0; i < params.length; i++) {
					compilerData.declareStructField(params[i], T_NUMBER_GLOBAL, T_NUMBER_GLOBAL_ARRAY);
				}
			} else if (compiler.getProcStartIndex() === -1) {
				/**
				 * Declare a global number or array of numbers...
				**/
				for (var i = 0; i < params.length; i++) {
					var global = compilerData.declareGlobal(params[i], T_NUMBER_GLOBAL, T_NUMBER_GLOBAL_ARRAY, null, location, true);

					/**
					 * Check if the number declaration had a constant value assigned to it...
					**/
					if (global.value) {
						if (global.type === T_NUMBER_GLOBAL) { // Like: number n = 1
							var value = parseFloat(global.value);
							if (isNaN(value)) {
								throw compiler.createError('Number expected, found "' + value + '".');
							}
							compilerData.declareConstant(global.offset, [value]);
						} else if (global.type === T_NUMBER_GLOBAL_ARRAY) { // Like: number arr[3] = [0, 1, 2]
							var value = global.value.trim();
							compilerData.declareConstant(global.offset, compilerHelper.parseNumberArray(value, compiler));
						} else {
							throw compiler.createError('Type error.');
						}
					}
				}
			} else {
				/**
				 * Declare a local number constant...
				**/
				for (var j = 0; j < params.length; j++) {
					var local = compilerData.declareLocal(params[j], T_NUMBER_LOCAL, T_NUMBER_LOCAL_ARRAY, null, true);

					/**
					 * Check if the number declaration had a constant value assigned to it...
					**/
					if (local.value) {
						if (local.type === T_NUMBER_LOCAL) { // Like: number n = 1
							var value = parseFloat(local.value);
							if (isNaN(value)) {
								throw compiler.createError('Number expected, found "' + value + '".');
							}
							// Set the the value at the address of the local variable...
							compiler.getOutput().add(compiler.createCommand(
								'set',
								[
									{type: T_NUMBER_LOCAL, 		value: local.offset},
									{type: T_NUMBER_CONSTANT, 	value: value}
								]
							));
						} else if (local.type === T_NUMBER_LOCAL_ARRAY) { // Like: number arr[3] = [0, 1, 2]
							var size 	= local.size * local.length,
								offset 	= compilerData.allocateGlobal(size); // Allocate space...
							// Store the data which should be placed at the just allocated space:
							compilerData.declareConstant(offset, compilerHelper.parseNumberArray(local.value, compiler));

							// Copy the data from the global offset to the local offset...
							compiler.getOutput().add(compiler.createCommand(
								'set',
								[
									{type: T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index},
									{type: T_NUMBER_CONSTANT, value: offset}
								]
							));
							compiler.getOutput().add(compiler.createCommand(
								'set',
								[
									{type: T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
									{type: T_NUMBER_CONSTANT, value: local.offset}
								]
							));
							compiler.getOutput().add(compiler.createCommand(
								'copy_global_local',
								[
									{type: T_NUMBER_CONSTANT, value: size}
								]
							));
						} else {
							throw compiler.createError('Type error.');
						}
					}
				}
			}
		};
	});