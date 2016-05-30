/**
 * Compile an array read command.
 *
 * 		arrayr value, array, index
 *
 * Read an array value from a given index.
 *
**/
wheel(
	'compiler.commands.ArrayR',
	Class(wheel.compiler.commands.CommandCompiler, function(supr) {
		this.compile = function(command) {
			var compiler 		= this._compiler,
				compilerData 	= this._compilerData,
				size 			= 1,
				valueParam 		= command.params[0],
				arrayParam 		= command.params[1],
				indexParam 		= command.params[2];

			if ((valueParam.type === wheel.compiler.command.T_STRUCT_GLOBAL) ||
				(valueParam.type === wheel.compiler.command.T_STRUCT_LOCAL)) {
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
				code: 		wheel.compiler.command.set.code,
				params: [
					{type: 	wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index},
					indexParam
				]
			});
			// Check if the item size is greater than 1, if so multiply with the item size...
			(size > 1) && compiler.getOutput().add({
				command: 	'mul',
				code: 		wheel.compiler.command.mul.code,
				params: [
					{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index},
					{type: wheel.compiler.command.T_NUMBER_CONSTANT, value: size}
				]
			});
			if (arrayParam.value !== 0) {
				// Add the offset of the source var to the REG_OFFSET_SRC register...
				compiler.getOutput().add({
					command: 	'add',
					code: 		wheel.compiler.command.add.code,
					params: [
						{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index},
						{type: wheel.compiler.command.T_NUMBER_CONSTANT, value: arrayParam.value}
					]
				});
			}
			if (wheel.compiler.command.typeToLocation(arrayParam.type) === 'local') {
				compiler.getOutput().add({
					command: 	'add',
					code: 		wheel.compiler.command.add.code,
					params: [
						{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index},
						{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_STACK').index}
					]
				});
			}

			// Set the offset of the destination value...
			compiler.getOutput().add({
				command: 	'set',
				code: 		wheel.compiler.command.set.code,
				params: [
					{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
					{type: wheel.compiler.command.T_NUMBER_CONSTANT, value: valueParam.value}
				]
			});
			if (wheel.compiler.command.typeToLocation(valueParam.type) === 'local') {
				compiler.getOutput().add({
					command: 	'add',
					code: 		wheel.compiler.command.add.code,
					params: [
						{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
						{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_STACK').index}
					]
				});
			}

			compiler.getOutput().add({
				command: 	'copy',
				code: 		wheel.compiler.command.copy.code,
				params: [
					{type: wheel.compiler.command.T_NUMBER_CONSTANT, value: size},
					{type: wheel.compiler.command.T_NUMBER_CONSTANT, value: 0}
				]
			});
		};
	})
);