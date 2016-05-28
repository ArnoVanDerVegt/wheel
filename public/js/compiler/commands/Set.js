/**
 * Compile a set command.
**/
wheel(
	'compiler.commands.Set',
	Class(wheel.compiler.commands.CommandCompiler, function(supr) {
		this.compile = function(validatedCommand) {
			var compiler 		= this._compiler,
				compilerData 	= this._compilerData,
				param1 			= validatedCommand.params[0],
				param2 			= validatedCommand.params[1];

			if (param1.vr.metaType === wheel.compiler.command.T_STRING) {
				if (param2.metaType === wheel.compiler.command.T_STRING) {
					param2.value = compilerData.declareString(param2.value);
				} else if (param2.vr.metaType === wheel.compiler.command.T_STRING) {
					// set string, string...
				} else {
					throw compiler.createError('Type error.');
				}
			} else if (param2.vr && (param2.vr.metaType === wheel.compiler.command.T_STRING)) {
				throw compiler.createError('Type error.');
			}
			compiler.getOutput().add(validatedCommand);
		};
	})
);