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

			switch (param1.vr.metaType) {
				case wheel.compiler.command.T_META_STRING:
					if (param2.metaType === wheel.compiler.command.T_META_STRING) {
						param2.value = compilerData.declareString(param2.value);
					} else if (param2.vr.metaType === wheel.compiler.command.T_META_STRING) {
						// set string, string...
					} else {
						throw compiler.createError('Type error.');
					}
					break;

				case wheel.compiler.command.T_META_POINTER:
					switch (param2.metaType) {
						case wheel.compiler.command.T_META_ADDRESS:
							if (wheel.compiler.command.typeToLocation(param2.type) === 'local') {
								if (wheel.compiler.command.typeToLocation(param1.type) === 'local') {
									param1.type = wheel.compiler.command.T_NUMBER_LOCAL; // Change from type like: T_STRUCT_LOCAL
								} else {
									param1.type = wheel.compiler.command.T_NUMBER_GLOBAL; // Change from type like: T_STRUCT_GLOBAL
								}
								param2.type = wheel.compiler.command.T_NUMBER_CONSTANT;
								compiler.getOutput().add(validatedCommand);

								validatedCommand 			= JSON.parse(JSON.stringify(validatedCommand));
								validatedCommand.command 	= 'add';
								validatedCommand.code 		= wheel.compiler.command.add.code;
								validatedCommand.params[1] 	= {
									type: 	wheel.compiler.command.T_NUMBER_REGISTER,
									value: 	compilerData.findRegister('REG_OFFSET_STACK').index
								};
							} else {
								if (wheel.compiler.command.typeToLocation(param1.type) === 'local') {
									param1.type = wheel.compiler.command.T_NUMBER_LOCAL; // Change from type like: T_STRUCT_LOCAL
								} else {
									param1.type = wheel.compiler.command.T_NUMBER_GLOBAL; // Change from type like: T_STRUCT_GLOBAL
								}
								param2.type = wheel.compiler.command.T_NUMBER_CONSTANT;
							}
							break;

						case wheel.compiler.command.T_META_POINTER:
							console.warn('wheel.compiler.command.T_META_POINTER');
							break;

						default:
							throw compiler.createError('Type error.');
					}
					break;

				default:
					if (param2.vr && (param2.vr.metaType === wheel.compiler.command.T_META_STRING)) {
						throw compiler.createError('Type error.');
					}
					break;
			}
			compiler.getOutput().add(validatedCommand);
		};
	})
);