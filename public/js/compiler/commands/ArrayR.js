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
		this.compileDestSetupPointer = function(valueParam, arrayParam, indexParam) {
			var compiler 		= this._compiler,
				compilerOutput 	= this._compiler.getOutput(),
				compilerData 	= this._compilerData;

			// De-reference the pointer, let REG_OFFSET_SRC point to the value...
			compilerOutput.add({
				command: 	'set',
				code: 		wheel.compiler.command.set.code,
				params: [
					{type: 	wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
					{type: 	wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_STACK').index}
				]
			});

			if (wheel.compiler.command.typeToLocation(arrayParam.type) === 'local') {
				compilerOutput.add({
					command: 	'set',
					code: 		wheel.compiler.command.set.code,
					params: [
						{type: 	wheel.compiler.command.T_NUMBER_REGISTER, 	value: compilerData.findRegister('REG_OFFSET_SRC').index},
						{type: 	wheel.compiler.command.T_NUMBER_LOCAL, 		value: arrayParam.value}
					]
				});
			} else {
				compilerOutput.add({
					command: 	'set',
					code: 		wheel.compiler.command.set.code,
					params: [
						{type: 	wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_STACK').index},
						{type: 	wheel.compiler.command.T_NUMBER_CONSTANT, value: arrayParam.value}
					]
				});
				compilerOutput.add({
					command: 	'set',
					code: 		wheel.compiler.command.set.code,
					params: [
						{type: 	wheel.compiler.command.T_NUMBER_REGISTER, 	value: compilerData.findRegister('REG_OFFSET_SRC').index},
						{type: 	wheel.compiler.command.T_NUMBER_LOCAL, 		value: 0}
					]
				});
			}

			compilerOutput.add({
				command: 	'set',
				code: 		wheel.compiler.command.set.code,
				params: [
					{type: 	wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_STACK').index},
					{type: 	wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index}
				]
			});

			// The third parameter contains the index...
			compilerOutput.add({
				command: 	'set',
				code: 		wheel.compiler.command.set.code,
				params: [
					{type: 	wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
					indexParam
				]
			});
			/*
			// Check if the item size is greater than 1, if so multiply with the item size...
			(size > 1) && compilerOutput.add({
				command: 	'mul',
				code: 		wheel.compiler.command.mul.code,
				params: [
					{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
					{type: wheel.compiler.command.T_NUMBER_CONSTANT, value: size}
				]
			});
			*/
			if (arrayParam.value !== 0) {
				// Add the offset of the source var to the REG_OFFSET_SRC register...
				compilerOutput.add({
					command: 	'add',
					code: 		wheel.compiler.command.add.code,
					params: [
						{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
						{type: wheel.compiler.command.T_NUMBER_CONSTANT, value: arrayParam.value}
					]
				});
			}

			// pointer...
			compilerOutput.add({
				command: 	'add',
				code: 		wheel.compiler.command.add.code,
				params: [
					{type: 	wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index},
					{type: 	wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index}
				]
			});
		};

		this.compileDestSetup = function(valueParam, arrayParam, indexParam, size) {
			var compiler 		= this._compiler,
				compilerOutput 	= this._compiler.getOutput(),
				compilerData 	= this._compilerData;

			// The third parameter contains the index...
			compilerOutput.add({
				command: 	'set',
				code: 		wheel.compiler.command.set.code,
				params: [
					{type: 	wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index},
					indexParam
				]
			});
			// Check if the item size is greater than 1, if so multiply with the item size...
			(size > 1) && compilerOutput.add({
				command: 	'mul',
				code: 		wheel.compiler.command.mul.code,
				params: [
					{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index},
					{type: wheel.compiler.command.T_NUMBER_CONSTANT, value: size}
				]
			});
			if (arrayParam.value !== 0) {
				// Add the offset of the source var to the REG_OFFSET_SRC register...
				compilerOutput.add({
					command: 	'add',
					code: 		wheel.compiler.command.add.code,
					params: [
						{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index},
						{type: wheel.compiler.command.T_NUMBER_CONSTANT, value: arrayParam.value}
					]
				});
			}
			if (wheel.compiler.command.typeToLocation(arrayParam.type) === 'local') {
				compilerOutput.add({
					command: 	'add',
					code: 		wheel.compiler.command.add.code,
					params: [
						{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index},
						{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_STACK').index}
					]
				});
			}
		};

		this.compile = function(command) {
			var compiler 		= this._compiler,
				compilerOutput 	= this._compiler.getOutput(),
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

			if (arrayParam.metaType === wheel.compiler.command.T_META_POINTER) {
				this.compileDestSetupPointer(valueParam, arrayParam, indexParam);
			} else {
				this.compileDestSetup(valueParam, arrayParam, indexParam, size);
			}

			// Set the offset of the destination value...
			compilerOutput.add({
				command: 	'set',
				code: 		wheel.compiler.command.set.code,
				params: [
					{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
					{type: wheel.compiler.command.T_NUMBER_CONSTANT, value: valueParam.value}
				]
			});
			if (wheel.compiler.command.typeToLocation(valueParam.type) === 'local') {
				compilerOutput.add({
					command: 	'add',
					code: 		wheel.compiler.command.add.code,
					params: [
						{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
						{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_STACK').index}
					]
				});
			}

			compilerOutput.add({
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