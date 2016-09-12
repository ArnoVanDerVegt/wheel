/**
 * Compile a set command.
**/
(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.commands.Set',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            this.compile = function(validatedCommand) {
                var compiler       = this._compiler;
                var compilerData   = this._compilerData;
                var compilerOutput = compiler.getOutput();
                var param1         = validatedCommand.params[0];
                var param2         = validatedCommand.params[1];
                var regDestSet     = false;
                var regStackSaved  = false;

                if (param1.vr && (param1.vr.metaType === wheel.compiler.command.T_META_STRING)) {
                    if (param2.metaType === wheel.compiler.command.T_META_STRING) {
                        param2.value = compilerData.declareString(param2.value);
                    } else if (param2.vr.metaType === wheel.compiler.command.T_META_STRING) {
                        // set string, string...
                    } else {
                        throw compiler.createError('Type error.');
                    }
                }

                var param2IsAddress = (param2.metaType === wheel.compiler.command.T_META_ADDRESS);
                if (param2IsAddress) {
                    if (wheel.compiler.command.typeToLocation(param2.type) === 'local') {
                        compilerOutput.add({
                            code: wheel.compiler.command.set.code,
                            params: [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_DEST},
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK},
                            ]
                        });
                        if (param2.value !== 0) {
                            compilerOutput.add({
                                code: wheel.compiler.command.add.code,
                                params: [
                                    {type: wheel.compiler.command.T_NUMBER_GLOBAL,   value: wheel.compiler.command.REG_OFFSET_DEST},
                                    {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: param2.value}
                                ]
                            });
                        }
                    } else {
                        compilerOutput.add({
                            code: wheel.compiler.command.set.code,
                            params: [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL,   value: wheel.compiler.command.REG_OFFSET_DEST},
                                {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: param2.value}
                            ]
                        });
                    }
                    if (param1.vr && (param1.vr.metaType === wheel.compiler.command.T_META_POINTER)) {
                        if (wheel.compiler.command.typeToLocation(param1.type) === 'local') {
                            param1.type = wheel.compiler.command.T_NUMBER_LOCAL;
                        } else {
                            param1.type = wheel.compiler.command.T_NUMBER_GLOBAL;
                        }
                    }

                    param2.type  = wheel.compiler.command.T_NUMBER_GLOBAL;
                    param2.value = wheel.compiler.command.REG_OFFSET_DEST;
                } else if (param2.metaType === wheel.compiler.command.T_META_POINTER) {
                    compilerOutput.add({ // set src, stack
                        code: wheel.compiler.command.set.code,
                        params: [
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_SRC},
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK}
                        ]
                    });
                    regStackSaved = true;

                    var paramOffset = param2.value;
                    if (param2.vr && param2.vr.origOffset) {
                        paramOffset = param2.vr.origOffset;
                    }

                    if (wheel.compiler.command.typeToLocation(param2.type) === 'local') {
                        compilerOutput.add({ // add stack, paramOffset
                            code: wheel.compiler.command.add.code,
                            params: [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL,   value: wheel.compiler.command.REG_OFFSET_STACK},
                                {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: paramOffset}
                            ]
                        });
                    } else {
                        compilerOutput.add({ // set stack, paramOffset
                            code: wheel.compiler.command.set.code,
                            params: [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL,   value: wheel.compiler.command.REG_OFFSET_STACK},
                                {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: paramOffset}
                            ]
                        });
                    }

                    compilerOutput.add({ // set stack, [stack]
                        code: wheel.compiler.command.set.code,
                        params: [
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK},
                            {type: wheel.compiler.command.T_NUMBER_LOCAL,  value: 0}
                        ]
                    });

                    var paramOffset = 0;
                    if (param2.vr.struct) {
                        // Hacky...
                        var p      = param2.param;
                        var i      = p.lastIndexOf('.');
                        var field  = p.substr(i + 1 - p.length);
                        var paramOffset = param2.vr.struct.fields[field].offset;
                    }

                    compilerOutput.add({ // set dest, [stack + paramOffset]
                        code: wheel.compiler.command.set.code,
                        params: [
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_DEST},
                            {type: wheel.compiler.command.T_NUMBER_LOCAL,  value: paramOffset}
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
                        compilerOutput.add({
                            code: wheel.compiler.command.set.code,
                            params: [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_SRC},
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK}
                            ]
                        });
                    }

                    if (wheel.compiler.command.typeToLocation(param1.type) === 'local') {
                        var vr     = param1.vr;
                        var offset = ('origOffset' in vr) ? vr.origOffset : vr.offset;
                        compilerOutput.add({
                            code: wheel.compiler.command.set.code,
                            params: [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK},
                                {type: wheel.compiler.command.T_NUMBER_LOCAL,  value: offset}
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

                    var offset = 0;
                    if (param1.vr.struct && !param2IsAddress) {
                        // Hacky...
                        var p      = param1.param;
                        var i      = p.lastIndexOf('.');
                        var field  = p.substr(i + 1 - p.length);
                        offset = param1.vr.struct.fields[field].offset;
                    }

                    param1.type  = wheel.compiler.command.T_NUMBER_LOCAL;
                    param1.value = offset;
                    param2.type  = wheel.compiler.command.T_NUMBER_GLOBAL;
                    param2.value = wheel.compiler.command.REG_OFFSET_DEST;
                    compilerOutput.add(validatedCommand);

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