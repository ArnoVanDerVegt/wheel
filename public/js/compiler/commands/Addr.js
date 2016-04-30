/**
 * Compile an array read command.
 *
 * 		arrayr value, array, index
 *
 * Read an array value from a given index.
 *
**/
wheel(
	'compiler.commands.Addr',
	Class(wheel.compiler.commands.CommandCompiler, function(supr) {
		this.compile = function(validatedCommand) {
			var compilerData 	= this._compilerData,
				param 			= validatedCommand.params[0];

			this._compiler.getOutput().add({
				command: 	'set',
				code: 		wheel.compiler.command.set.code,
				params: [
					{type: 	wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index},
					{type: 	wheel.compiler.command.T_NUMBER_CONSTANT, value: param.value}
				]
			});
			if (wheel.compiler.command.typeToLocation(param.type) === 'local') {
				this._compiler.getOutput().add({
					command: 	'add',
					code: 		wheel.compiler.command.add.code,
					params: [
						{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index},
						{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_STACK').index}
					]
				});
			}
		};
	})
);