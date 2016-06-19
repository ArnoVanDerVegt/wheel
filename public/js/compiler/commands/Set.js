/**
 * Compile a set command.
**/
wheel(
    'compiler.commands.Set',
    Class(wheel.compiler.commands.CommandCompiler, function(supr) {
        this.compile = function(validatedCommand) {
            var compiler         = this._compiler;
            var compilerData     = this._compilerData;
            var compilerOutput   = compiler.getOutput();
            var param1           = validatedCommand.params[0];
            var param2           = validatedCommand.params[1];
            var regDestSet       = false;
            var regDestUpdate    = false;
            var regStackSaved    = false;

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
                        command: 'set',
                        code:    wheel.compiler.command.set.code,
                        params: [
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_DEST},
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK},
                        ]
                    });
                    if (param2.value !== 0) {
                        compilerOutput.add({
                            command: 'add',
                            code:    wheel.compiler.command.set.code,
                            params: [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL,   value: wheel.compiler.command.REG_OFFSET_DEST},
                                {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: param2.value}
                            ]
                        });
                    }
                } else {
                    compilerOutput.add({
                        command: 'set',
                        code:    wheel.compiler.command.set.code,
                        params: [
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL,   value: wheel.compiler.command.REG_OFFSET_DEST},
                            {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: param2.value}
                        ]
                    });
                }
                regDestUpdate = true;
            } else if (param2.metaType === wheel.compiler.command.T_META_POINTER) {
                compilerOutput.add({
                    command: 'set',
                    code:    wheel.compiler.command.set.code,
                    params: [
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_SRC},
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK}
                    ]
                });
                regStackSaved = true;

                if (wheel.compiler.command.typeToLocation(param2.type) === 'local') {
                    compilerOutput.add({
                        command: 'set',
                        code:    wheel.compiler.command.set.code,
                        params: [
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK},
                            {type: wheel.compiler.command.T_NUMBER_LOCAL,  value: param2.value}
                        ]
                    });
                } else {
                    compilerOutput.add({
                        command: 'set',
                        code:    wheel.compiler.command.set.code,
                        params: [
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK},
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: param2.value}
                        ]
                    });
                }
                compilerOutput.add({
                    command: 'set',
                    code:    wheel.compiler.command.set.code,
                    params: [
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_DEST},
                        {type: wheel.compiler.command.T_NUMBER_LOCAL,  value: 0}
                    ]
                });
                regDestSet = true;

                compilerOutput.add({
                    command: 'set',
                    code:    wheel.compiler.command.set.code,
                    params: [
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK},
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_SRC}
                    ]
                });

                if (param1.metaType !== wheel.compiler.command.T_META_POINTER) {
                    param2.type  = wheel.compiler.command.T_NUMBER_GLOBAL;
                    param2.value = wheel.compiler.command.REG_OFFSET_DEST;
                    compilerOutput.add(validatedCommand);
                    return;
                }
            }

            if (param1.metaType === wheel.compiler.command.T_META_POINTER) {
                if (!regDestSet) {
                    compilerOutput.add({
                        command: 'set',
                        code:    wheel.compiler.command.set.code,
                        params: [
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_DEST},
                            JSON.parse(JSON.stringify(param2))
                        ]
                    });
                }
                if (!regStackSaved) {
                    compilerOutput.add({
                        command: 'set',
                        code:    wheel.compiler.command.set.code,
                        params: [
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_SRC},
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK}
                        ]
                    });
                }

                if (wheel.compiler.command.typeToLocation(param1.type) === 'local') {
                    compilerOutput.add({
                        command: 'set',
                        code:    wheel.compiler.command.set.code,
                        params: [
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK},
                            {type: wheel.compiler.command.T_NUMBER_LOCAL,  value: param1.value}
                        ]
                    });
                } else {
                    compilerOutput.add({
                        command: 'set',
                        code:    wheel.compiler.command.set.code,
                        params: [
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK},
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: param1.value}
                        ]
                    });
                }

                param1.type  = wheel.compiler.command.T_NUMBER_LOCAL;
                param1.value = 0;
                param2.type  = wheel.compiler.command.T_NUMBER_GLOBAL;
                param2.value = wheel.compiler.command.REG_OFFSET_DEST;
                compilerOutput.add(validatedCommand);

                compilerOutput.add({
                    command: 'set',
                    code:    wheel.compiler.command.set.code,
                    params: [
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK},
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_SRC}
                    ]
                });
            } else {
                if (regDestUpdate) {
                    param2.type  = wheel.compiler.command.T_NUMBER_GLOBAL;
                    param2.value = wheel.compiler.command.REG_OFFSET_DEST;
                }
                compilerOutput.add(validatedCommand);
            }
        };
    })
);