wheel(
	'compiler.commands.NumberInc',
	Class(wheel.compiler.commands.CommandCompiler, function(supr) {
		this.compile = function(validatedCommand) {
			validatedCommand.command 		= 'add';
			validatedCommand.code 			= wheel.compiler.command.add.code;
			validatedCommand.params.push({
				type: 	wheel.compiler.command.T_NUMBER_CONSTANT,
				value: 	1
			});
			this._compiler.getOutput().add(validatedCommand);
		};
	})
);