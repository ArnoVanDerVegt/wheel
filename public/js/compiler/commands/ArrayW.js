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
			compiler.getOutput().add({
				command: 	'set',
				code: 		commands.set.code,
				params: [
					{type: T_NUMBER_REGISTER, value: 'REG_SIZE'},
					{type: T_NUMBER_CONSTANT, value: size}
				]
			});

			// Check if the item size is greater than 1, if so multiply with the item size...
			var vr 		= destParam.vr,
				size 	= vr.field ? vr.field.size : vr.size;
			compiler.getOutput().add({
				command: 	'mul',
				code: 		commands.mul.code,
				params: [
					{type: T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET')},
					{type: T_NUMBER_CONSTANT, value: size}
				]
			});
		};
	});

