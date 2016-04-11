/**
 * Compile an array write command.
 *
 * 		arrayw array, index, value
 *
 * Store an item in an array at a given index.
 *
 * - The item size is calculated and stored in REG_SIZE.
 *
 * - The value of the second parameter is copied to REG_OFFSET,
 *   which is then multiplied with the item size if the size is
 *   greater than 1 (if it's an array of structs).
 *
 * - The VM uses REG_OFFSET, REG_SIZE and the memory location
 *   of the first and third parameter of arrayw to copy the data.
 *
**/
var ArrayW = Class(CommandCompiler, function(supr) {
		this.compile = function(command, params) {
			var compiler 		= this._compiler,
				compilerData 	= this._compilerData,
				size 			= 1,
				type 			= params[0].type;
			if ((type === T_STRUCT_GLOBAL_ARRAY) || (type === T_STRUCT_LOCAL_ARRAY)) {
				var destStructName 	= params[0].vr.struct.name,
					srcStructName 	= params[2].vr.struct.name;
				if (destStructName !== srcStructName) {
					throw compiler.createError('Type mismatch "' + destStructName + '" and "' + srcStructName + '".');
				}
				size = params[0].vr.struct.size;
			}

			compiler.getOutput().add({
				command: 	'set',
				code: 		commands.set.code,
				params: [
					{type: T_NUMBER_REGISTER, value: 'REG_SIZE'},
					{type: T_NUMBER_CONSTANT, value: size}
				]
			});

			// Remove the second parameter which is the index and
			// add a command to move the value to the REG_OFFSET...
			var destParam = command.params[0];
			compiler.getOutput().add({
				command: 	'set',
				code: 		commands.set.code,
				params: [
					{type: 	T_NUMBER_REGISTER, value: 'REG_OFFSET'},
					command.params.splice(1, 1)[0]
				]
			});
			// Check if the item size is greater than 1, if so multiply with the item size...
			(size > 1) && compiler.getOutput().add({
				command: 	'mul',
				code: 		commands.mul.code,
				params: [
					{type: T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET')},
					{type: T_NUMBER_CONSTANT, value: size}
				]
			});

			compiler.getOutput().add(command);
		};
	});

