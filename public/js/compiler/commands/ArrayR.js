/**
 * Compile an array read command.
 *
 * 		arrayr value, array, index
 *
 * Read an array value from a given index.
 *
**/
var ArrayR = Class(CommandCompiler, function(supr) {
		this.compile = function(command, params) {
			var compiler 		= this._compiler,
				compilerData 	= this._compilerData,
				size 			= 1,
				valueParam 		= params[0],
				arrayParam 		= params[1],
				indexParam 		= params[2];

			if ((valueParam.type === T_STRUCT_GLOBAL) || (valueParam.type === T_STRUCT_LOCAL)) {
				var valueStructName = valueParam.vr.struct.name,
					arrayStructName = arrayParam.vr.struct.name;
				if (valueStructName !== arrayStructName) {
					throw compiler.createError('Type mismatch "' + valueStructName + '" and "' + arrayStructName + '".');
				}
				size = valueParam.vr.struct.size;
			}

			// The second parameter contains the index...
			compiler.getOutput().add({
				command: 	'set',
				code: 		commands.set.code,
				params: [
					{type: 	T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index},
					indexParam
				]
			});
			// Check if the item size is greater than 1, if so multiply with the item size...
			(size > 1) && compiler.getOutput().add({
				command: 	'mul',
				code: 		commands.mul.code,
				params: [
					{type: T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index},
					{type: T_NUMBER_CONSTANT, value: size}
				]
			});
			if (arrayParam.value !== 0) {
				// Add the offset of the source var to the REG_OFFSET_SRC register...
				compiler.getOutput().add({
					command: 	'add',
					code: 		commands.add.code,
					params: [
						{type: T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index},
						{type: T_NUMBER_CONSTANT, value: arrayParam.value}
					]
				});
			}
			if (typeToLocation(arrayParam.type) === 'local') {
				compiler.getOutput().add({
					command: 	'add',
					code: 		commands.add.code,
					params: [
						{type: T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index},
						{type: T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_STACK').index}
					]
				});
			}

			// Set the offset of the destination value...
			compiler.getOutput().add({
				command: 	'set',
				code: 		commands.set.code,
				params: [
					{type: T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
					{type: T_NUMBER_CONSTANT, value: valueParam.value}
				]
			});
			if (typeToLocation(valueParam.type) === 'local') {
				compiler.getOutput().add({
					command: 	'add',
					code: 		commands.add.code,
					params: [
						{type: T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
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
	});