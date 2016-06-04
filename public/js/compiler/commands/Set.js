/**
 * Compile a set command.
**/
wheel(
	'compiler.commands.Set',
	Class(wheel.compiler.commands.CommandCompiler, function(supr) {
		this.compile = function(validatedCommand) {
			var compiler 		= this._compiler,
				compilerData 	= this._compilerData,
				compilerOutput 	= compiler.getOutput(),
				param1 			= validatedCommand.params[0],
				param2 			= validatedCommand.params[1],
				regDestSet 		= false,
				regDestUpdate 	= false,
				regStackSaved 	= false;

			if (param1.vr && (param1.vr.metaType === wheel.compiler.command.T_META_STRING)) {
				if (param2.metaType === wheel.compiler.command.T_META_STRING) {
					param2.value = compilerData.declareString(param2.value);
				} else if (param2.vr.metaType === wheel.compiler.command.T_META_STRING) {
					// set string, string...
				} else {
					throw compiler.createError('Type error.');
				}
			}

			if (param2.metaType === wheel.compiler.command.T_META_ADDRESS) {
				if (wheel.compiler.command.typeToLocation(param2.type) === 'local') {
					compilerOutput.add({
						command: 	'set',
						code: 		wheel.compiler.command.set.code,
						params: [
							{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
							{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_STACK').index},
						]
					});
					if (param2.value !== 0) {
						compilerOutput.add({
							command: 	'add',
							code: 		wheel.compiler.command.set.code,
							params: [
								{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
								{type: wheel.compiler.command.T_NUMBER_CONSTANT, value: param2.value}
							]
						});
					}
				} else {
					compilerOutput.add({
						command: 	'set',
						code: 		wheel.compiler.command.set.code,
						params: [
							{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
							{type: wheel.compiler.command.T_NUMBER_CONSTANT, value: param2.value}
						]
					});
				}
				regDestUpdate = true;
			} else if (param2.metaType === wheel.compiler.command.T_META_POINTER) {
				compilerOutput.add({
					command: 	'set',
					code: 		wheel.compiler.command.set.code,
					params: [
						{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index},
						{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_STACK').index}
					]
				});
				regStackSaved = true;

				if (wheel.compiler.command.typeToLocation(param2.type) === 'local') {
					compilerOutput.add({
						command: 	'set',
						code: 		wheel.compiler.command.set.code,
						params: [
							{type: wheel.compiler.command.T_NUMBER_REGISTER, 	value: compilerData.findRegister('REG_OFFSET_STACK').index},
							{type: wheel.compiler.command.T_NUMBER_LOCAL, 		value: param2.value}
						]
					});
				} else {
					compilerOutput.add({
						command: 	'set',
						code: 		wheel.compiler.command.set.code,
						params: [
							{type: wheel.compiler.command.T_NUMBER_REGISTER, 	value: compilerData.findRegister('REG_OFFSET_STACK').index},
							{type: wheel.compiler.command.T_NUMBER_GLOBAL, 		value: param2.value}
						]
					});
				}
				compilerOutput.add({
					command: 	'set',
					code: 		wheel.compiler.command.set.code,
					params: [
						{type: wheel.compiler.command.T_NUMBER_REGISTER, 	value: compilerData.findRegister('REG_OFFSET_DEST').index},
						{type: wheel.compiler.command.T_NUMBER_LOCAL,		value: 0}
					]
				});
				regDestSet = true;

				compilerOutput.add({
					command: 	'set',
					code: 		wheel.compiler.command.set.code,
					params: [
						{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_STACK').index},
						{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index}
					]
				});

				if (param1.metaType !== wheel.compiler.command.T_META_POINTER) {
					param2.type 	= wheel.compiler.command.T_NUMBER_REGISTER;
					param2.value 	= compilerData.findRegister('REG_OFFSET_DEST').index;
					compilerOutput.add(validatedCommand);
					return;
				}
			}

			if (param1.metaType === wheel.compiler.command.T_META_POINTER) {
				if (!regDestSet) {
					compilerOutput.add({
						command: 	'set',
						code: 		wheel.compiler.command.set.code,
						params: [
							{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_DEST').index},
							JSON.parse(JSON.stringify(param2))
						]
					});
				}
				if (!regStackSaved) {
					compilerOutput.add({
						command: 	'set',
						code: 		wheel.compiler.command.set.code,
						params: [
							{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index},
							{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_STACK').index}
						]
					});
				}

				if (wheel.compiler.command.typeToLocation(param1.type) === 'local') {
					compilerOutput.add({
						command: 	'set',
						code: 		wheel.compiler.command.set.code,
						params: [
							{type: wheel.compiler.command.T_NUMBER_REGISTER, 	value: compilerData.findRegister('REG_OFFSET_STACK').index},
							{type: wheel.compiler.command.T_NUMBER_LOCAL, 		value: param1.value}
						]
					});
				} else {
					compilerOutput.add({
						command: 	'set',
						code: 		wheel.compiler.command.set.code,
						params: [
							{type: wheel.compiler.command.T_NUMBER_REGISTER, 	value: compilerData.findRegister('REG_OFFSET_STACK').index},
							{type: wheel.compiler.command.T_NUMBER_GLOBAL, 		value: param1.value}
						]
					});
				}

				param1.type 	= wheel.compiler.command.T_NUMBER_LOCAL;
				param1.value 	= 0;
				param2.type 	= wheel.compiler.command.T_NUMBER_REGISTER;
				param2.value 	= compilerData.findRegister('REG_OFFSET_DEST').index;
				compilerOutput.add(validatedCommand);

				compilerOutput.add({
					command: 	'set',
					code: 		wheel.compiler.command.set.code,
					params: [
						{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_STACK').index},
						{type: wheel.compiler.command.T_NUMBER_REGISTER, value: compilerData.findRegister('REG_OFFSET_SRC').index}
					]
				});
			} else {
				if (regDestUpdate) {
					param2.type 	= wheel.compiler.command.T_NUMBER_REGISTER;
					param2.value 	= compilerData.findRegister('REG_OFFSET_DEST').index;
				}
				compilerOutput.add(validatedCommand);
			}
		};
	})
);