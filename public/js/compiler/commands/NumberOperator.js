(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.commands.NumberOperator',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            this.compile = function(validatedCommand) {
                var compiler         = this._compiler;
                var compilerData     = this._compilerData;
                var compilerOutput   = compiler.getOutput();
                var param1           = validatedCommand.params[0];
                var param2           = validatedCommand.params[1];
                var regDestSet       = false;
                var regStackSaved    = false;

                if (param2.metaType === wheel.compiler.command.T_META_POINTER) {
                    compilerOutput.add({
                        code: wheel.compiler.command.set.code,
                        params: [
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_SRC},
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK}
                        ]
                    });
                    regStackSaved = true;

                    if (wheel.compiler.command.typeToLocation(param2.type) === 'local') {
                        compilerOutput.add({
                            code: wheel.compiler.command.set.code,
                            params: [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK},
                                {type: wheel.compiler.command.T_NUMBER_LOCAL,  value: param2.value}
                            ]
                        });
                    } else {
                        compilerOutput.add({
                            code: wheel.compiler.command.set.code,
                            params: [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK},
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: param2.value}
                            ]
                        });
                    }
                    compilerOutput.add({
                        code: wheel.compiler.command.set.code,
                        params: [
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_DEST},
                            {type: wheel.compiler.command.T_NUMBER_LOCAL,  value: 0}
                        ]
                    });
                    regDestSet = true;

                    compilerOutput.add({
                        code: wheel.compiler.command.set.code,
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
                            code: wheel.compiler.command.set.code,
                            params: [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_DEST},
                                JSON.parse(JSON.stringify(param2))
                            ]
                        });
                    }
                    if (!regStackSaved) {
                        // Save the stack pointer to the source register...
                        compilerOutput.add({
                            code: wheel.compiler.command.set.code,
                            params: [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_SRC},
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK}
                            ]
                        });
                    }

                    if (wheel.compiler.command.typeToLocation(param1.type) === 'local') {
                        compilerOutput.add({
                            code: wheel.compiler.command.set.code,
                            params: [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK},
                                {type: wheel.compiler.command.T_NUMBER_LOCAL,  value: param1.value}
                            ]
                        });
                    } else {
                        compilerOutput.add({
                            code: wheel.compiler.command.set.code,
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

                    // Restore the stack register...
                    compilerOutput.add({
                        code: wheel.compiler.command.set.code,
                        params: [
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK},
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_SRC}
                        ]
                    });
                } else {
                    compilerOutput.add(validatedCommand);
                }
            };
        })
    );
})();