/**
 * Compile an array write command.
 *
 * 		arrayw array, index, value
 *
 * Store an item in an array at a given index.
 *
**/
wheel(
	'compiler.commands.ArrayW',
	Class(wheel.compiler.commands.CommandCompiler, function(supr) {
		this.compile = function(command, params) {
			var compiler 		= this._compiler,
				compilerData 	= this._compilerData,
				size 			= 1,
				arrayParam 		= params[0],
				indexParam 		= params[1],
				valueParam 		= params[2];

			if ((arrayParam.type === T_STRUCT_GLOBAL_ARRAY) || (arrayParam.type === T_STRUCT_LOCAL_ARRAY)) {
				var arrayStructName 	= arrayParam.vr.struct.name,
					valueStructName 	= valueParam.vr.struct.name;
				if (arrayStructName !== valueStructName) {
					throw compiler.createError('Type mismatch "' + arrayStructName + '" and "' + valueStructName + '".');
				}
				size = valueParam.vr.struct.size;
			}

			// The second parameter contains the index...
			compiler.getOutput().add({
				command: 	'set',
				code: 		commands.set.code,
				params: [
					{type: 	T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
					indexParam
				]
			});
			// Check if the item size is greater than 1, if so multiply with the item size...
			(size > 1) && compiler.getOutput().add({
				command: 	'mul',
				code: 		commands.mul.code,
				params: [
					{type: T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
					{type: T_NUMBER_CONSTANT, value: size}
				]
			});
			if (arrayParam.value !== 0) {
				// Add the offset of the destination var to the REG_OFFSET_DEST register...
				compiler.getOutput().add({
					command: 	'add',
					code: 		commands.add.code,
					params: [
						{type: T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
						{type: T_NUMBER_CONSTANT, value: parseInt(arrayParam.value, 10)}
					]
				});
			}
			if (typeToLocation(arrayParam.type) === 'local') {
				compiler.getOutput().add({
					command: 	'add',
					code: 		commands.add.code,
					params: [
						{type: T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
						{type: T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_STACK').index}
					]
				});
			}

			// Set the offset of the source value...
			compiler.getOutput().add({
				command: 	'set',
				code: 		commands.set.code,
				params: [
					{type: T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index},
					{type: T_NUMBER_CONSTANT, value: parseInt(valueParam.value, 10)}
				]
			});
			if (typeToLocation(valueParam.type) === 'local') {
				compiler.getOutput().add({
					command: 	'add',
					code: 		commands.add.code,
					params: [
						{type: T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index},
						{type: T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_STACK').index}
					]
				});
			}

			compiler.getOutput().add({
				command: 	'copy',
				code: 		commands.copy.code,
				params: [
					{type: T_NUMBER_CONSTANT, value: size},
					{type: T_NUMBER_CONSTANT, value: 0}
				]
			});
		};
	})
);
