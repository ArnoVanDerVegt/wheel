(function() {
    var wheel = require('../../utils/base.js');

    wheel(
        'compiler.commands.Call',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            this.compileConstantParameter = function(param, paramInfo, offset) {
                var compiler       = this._compiler;
                var compilerOutput = compiler.getOutput();
                var compilerData   = this._compilerData;

                if (paramInfo.metaType === wheel.compiler.command.T_META_STRING) {
                    paramInfo.value = compilerData.declareString(paramInfo.value);
                }
                destParam = {
                    type:  wheel.compiler.command.T_NUMBER_LOCAL,
                    value: offset,
                    param: param
                };
                compilerOutput.add(compiler.createCommand('set', [destParam, paramInfo]));
            };

            this.compileLocalPoinerParam = function(param, paramInfo, offset, size) {
                var compiler       = this._compiler;
                var compilerOutput = compiler.getOutput();
                var compilerData   = this._compilerData;

                compilerOutput.add(compiler.createCommand(
                    'set',
                    [
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_SRC},
                        {type: wheel.compiler.command.T_NUMBER_LOCAL,  value: paramInfo.value}
                    ]
                ));
                compilerOutput.add(compiler.createCommand(
                    'set',
                    [
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL,   value: wheel.compiler.command.REG_OFFSET_DEST},
                        {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: offset}
                    ]
                ));
                compilerOutput.add(compiler.createCommand(
                    'add',
                    [
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_DEST},
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK}
                    ]
                ));
                compilerOutput.add(compiler.createCommand(
                    'copy',
                    [
                        {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: size}
                    ]
                ));
            };

            this.compileLocalParam = function(param, paramInfo, offset) {
                var compiler       = this._compiler;
                var compilerOutput = compiler.getOutput();
                var compilerData   = this._compilerData;
                var vr             = paramInfo.vr;

                if (vr.metaType === wheel.compiler.command.T_META_POINTER) {
                    this.compileLocalPoinerParam(param, paramInfo, offset, 1);
                } else if (paramInfo.metaType === wheel.compiler.command.T_META_ADDRESS) {
                    var localOffset = paramInfo.value;
                    destParam = {
                        type:  wheel.compiler.command.T_NUMBER_LOCAL,
                        value: offset,
                        param: param
                    };
                    paramInfo.type  = wheel.compiler.command.T_NUMBER_GLOBAL;
                    paramInfo.value = wheel.compiler.command.REG_OFFSET_SRC;
                    compilerOutput.add(compiler.createCommand('set', [destParam, paramInfo]));

                    if (localOffset) {
                        destParam = {
                            type:  wheel.compiler.command.T_NUMBER_LOCAL,
                            value: offset,
                            param: param
                        };
                        compilerOutput.add(compiler.createCommand(
                            'set',
                            [
                                destParam,
                                {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: localOffset} // Offset of local parameter value
                            ]
                        ));
                    }
                } else {
                    var destParam = {
                            type:  wheel.compiler.command.T_NUMBER_LOCAL,
                            value: offset,
                            param: param
                        };
                    compilerOutput.add(compiler.createCommand('set', [destParam, paramInfo]));
                }
            };

            this.compileLocalStructParam = function(param, paramInfo, offset, size) {
                var compiler       = this._compiler;
                var compilerOutput = compiler.getOutput();
                var compilerData   = this._compilerData;
                var vr             = paramInfo.vr;

                if (vr.metaType === wheel.compiler.command.T_META_POINTER) {
                    this.compileLocalPoinerParam(param, paramInfo, offset, size);
                } else {
                    if (paramInfo.value === 0) {
                        compilerOutput.add(compiler.createCommand(
                            'set',
                            [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_SRC},
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK}
                            ]
                        ));
                    } else {
                        compilerOutput.add(compiler.createCommand(
                            'set',
                            [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL,   value: wheel.compiler.command.REG_OFFSET_SRC},
                                {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: paramInfo.value} // Offset of local parameter value
                            ]
                        ));
                        compilerOutput.add(compiler.createCommand(
                            'add',
                            [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_SRC},
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK}
                            ]
                        ));
                    }

                    if (offset === 0) {
                        compilerOutput.add(compiler.createCommand(
                            'set',
                            [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_DEST},
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK}
                            ]
                        ));
                    } else {
                        compilerOutput.add(compiler.createCommand(
                            'set',
                            [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL,   value: wheel.compiler.command.REG_OFFSET_DEST},
                                {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: offset}
                            ]
                        ));
                        compilerOutput.add(compiler.createCommand(
                            'add',
                            [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_DEST},
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK}
                            ]
                        ));
                    }
                    compilerOutput.add(compiler.createCommand(
                        'copy',
                        [
                            {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: size}
                        ]
                    ));
                }
            };

            this.compileGlobalParam = function(param, paramInfo, offset) {
                var compiler       = this._compiler;
                var compilerOutput = compiler.getOutput();
                var compilerData   = this._compilerData;
                var vr             = paramInfo.vr;

                if (vr.metaType === wheel.compiler.command.T_META_POINTER) {
                    compilerOutput.add(compiler.createCommand(
                        'set',
                        [
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_SRC},
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: paramInfo.value}
                        ]
                    ));
                    compilerOutput.add(compiler.createCommand(
                        'set',
                        [
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL,   value: wheel.compiler.command.REG_OFFSET_DEST},
                            {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: offset}
                        ]
                    ));
                    compilerOutput.add(compiler.createCommand(
                        'add',
                        [
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_DEST},
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK}
                        ]
                    ));
                    compilerOutput.add(compiler.createCommand(
                        'copy',
                        [
                            {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: 1}
                        ]
                    ));
                } else if (paramInfo.metaType === wheel.compiler.command.T_META_ADDRESS) {
                    destParam = {
                        type:  wheel.compiler.command.T_NUMBER_LOCAL,
                        value: offset,
                        param: param
                    };
                    paramInfo.type = wheel.compiler.command.T_NUMBER_CONSTANT;
                    compilerOutput.add(compiler.createCommand('set', [destParam, paramInfo]));
                } else {
                    destParam = {
                        type:  wheel.compiler.command.T_NUMBER_LOCAL,
                        value: offset,
                        param: param
                    };
                    compilerOutput.add(compiler.createCommand('set', [destParam, paramInfo]));
                }
            };

            this.compileGlobalStructParam = function(param, paramInfo, offset, size) {
                var compiler       = this._compiler;
                var compilerOutput = compiler.getOutput();
                var compilerData   = this._compilerData;
                var vr             = paramInfo.vr;

                if (paramInfo.value) {
                    if (paramInfo.type === wheel.compiler.command.T_NUMBER_GLOBAL_ARRAY) {
                        if (typeof paramInfo.value === 'string') {
                            var data = wheel.compiler.compilerHelper.parseNumberArray(paramInfo.value);
                            size            = data.length;
                            paramInfo.value = compilerData.allocateGlobal(size);
                            compilerData.declareConstant(paramInfo.value, data);
                        }
                    } else {
                        throw compiler.createError('Type mismatch.');
                    }
                }

                if (paramInfo.metaType === wheel.compiler.command.T_META_ADDRESS) {
                    destParam = {
                        type:  wheel.compiler.command.T_NUMBER_LOCAL,
                        value: offset,
                        param: param
                    };
                    paramInfo.type = wheel.compiler.command.T_NUMBER_CONSTANT;
                    compilerOutput.add(compiler.createCommand('set', [destParam, paramInfo]));
                } else {
                    compilerOutput.add(compiler.createCommand(
                        'set',
                        [
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL,   value: wheel.compiler.command.REG_OFFSET_SRC},
                            {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: paramInfo.value} // Offset of local parameter value
                        ]
                    ));

                    if (offset === 0) {
                        compilerOutput.add(compiler.createCommand(
                            'set',
                            [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_DEST},
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK}
                            ]
                        ));
                    } else {
                        compilerOutput.add(compiler.createCommand(
                            'set',
                            [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL,   value: wheel.compiler.command.REG_OFFSET_DEST},
                                {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: offset}
                            ]
                        ));
                        compilerOutput.add(compiler.createCommand(
                            'add',
                            [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_DEST},
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK}
                            ]
                        ));
                    }
                    compilerOutput.add(compiler.createCommand(
                        'copy',
                        [
                            {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: size}
                        ]
                    ));
                }
            };

            this.compileParams = function(params, currentLocalStackSize) {
                var compiler       = this._compiler;
                var compilerOutput = compiler.getOutput();
                var compilerData   = this._compilerData;

                params = wheel.compiler.compilerHelper.splitParams(params);

                // The local offset is the stack size used in the current procedure...
                var offset = currentLocalStackSize + 2;
                for (var i = 0; i < params.length; i++) {
                    var param = params[i].trim();
                    if (param !== '') {
                        var paramInfo    = compilerData.paramInfo(param);
                        var destParam;
                        var vr           = paramInfo.vr;
                        var size         = vr ? (vr.size * vr.length) : 1;
                        switch (paramInfo.type) {
                            case wheel.compiler.command.T_NUMBER_CONSTANT:
                                this.compileConstantParameter(param, paramInfo, offset);
                                break;

                            case wheel.compiler.command.T_NUMBER_LOCAL:
                                this.compileLocalParam(param, paramInfo, offset);
                                break;

                            case wheel.compiler.command.T_NUMBER_LOCAL_ARRAY:
                            case wheel.compiler.command.T_STRUCT_LOCAL_ARRAY:
                            case wheel.compiler.command.T_STRUCT_LOCAL:
                                this.compileLocalStructParam(param, paramInfo, offset, size);
                                break;

                            case wheel.compiler.command.T_NUMBER_GLOBAL:
                                this.compileGlobalParam(param, paramInfo, offset);
                                break;

                            case wheel.compiler.command.T_NUMBER_GLOBAL_ARRAY:
                            case wheel.compiler.command.T_STRUCT_GLOBAL_ARRAY:
                            case wheel.compiler.command.T_STRUCT_GLOBAL:
                                this.compileGlobalStructParam(param, paramInfo, offset, size);
                                break;

                            default:
                                throw compiler.createError('Type mismatch.');
                        }

                        offset += size;
                    }
                }
            };

            this.compile = function(line) {
                var compiler         = this._compiler;
                var compilerOutput   = compiler.getOutput();
                var compilerData     = this._compilerData;
                var i                = line.indexOf('(');
                var procedure        = line.substr(0, i);

                if (!wheel.compiler.compilerHelper.validateString(procedure)) {
                    throw compiler.createError('Syntax error.');
                }

                var callCommand;
                var p                     = compilerData.findProcedure(procedure);
                var currentLocalStackSize = compilerData.getLocalOffset();

                if (p !== null) {
                    callCommand = {
                        command: 'set',
                        code:    wheel.compiler.command.set.code,
                        params: [
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL,   value: wheel.compiler.command.REG_OFFSET_CODE},
                            {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: p.index - 1}
                        ]
                    };
                } else {
                    var local = compilerData.findLocal(procedure);
                    if (local !== null) {
                        if (local.type !== wheel.compiler.command.T_PROC_LOCAL) {
                            throw compiler.createError('Type error, can not call "' + procedure + '".');
                        }

                        console.warn('Check global proc offset!');
                        callCommand = {
                            command: 'set',
                            code:    wheel.compiler.command.set.code,
                            params: [
                                {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_CODE},
                                {type: wheel.compiler.command.T_NUMBER_LOCAL,  value: local.offset}
                            ]
                        };
                    } else {
                        var global = compilerData.findGlobal(procedure)
                        if (global !== null) {
                            if (global.type !== wheel.compiler.command.T_PROC_GLOBAL) {
                                throw compiler.createError('Type error, can not call "' + procedure + '".');
                            }

                            console.warn('Check global proc offset!');
                            callCommand = {
                                command: 'set',
                                code:    wheel.compiler.command.set.code,
                                params: [
                                    {type: wheel.compiler.command.T_NUMBER_GLOBAL,   value: wheel.compiler.command.REG_OFFSET_CODE},
                                    {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: global.offset}
                                ]
                            };
                        } else {
                            throw compiler.createError('Unknown procedure "' + procedure + '".');
                        }
                    }
                }

                this.compileParams(line.substr(i + 1, line.length - i - 2).trim(), currentLocalStackSize);


                compilerOutput.add(compiler.createCommand(
                    'set',
                    [
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_DEST},
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_CODE}
                    ]
                ));
                compilerOutput.add(compiler.createCommand(
                    'add',
                    [
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL,   value: wheel.compiler.command.REG_OFFSET_DEST},
                        {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: 6}
                    ]
                ));
                compilerOutput.add(compiler.createCommand(
                    'set',
                    [
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_SRC},
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK}
                    ]
                ));
                compilerOutput.add(compiler.createCommand(
                    'add',
                    [
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL,   value: wheel.compiler.command.REG_OFFSET_STACK},
                        {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: currentLocalStackSize}
                    ]
                ));
                compilerOutput.add(compiler.createCommand(
                    'set',
                    [
                        {type: wheel.compiler.command.T_NUMBER_LOCAL,  value: 0},
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_SRC}
                    ]
                ));
                compilerOutput.add(compiler.createCommand(
                    'set',
                    [
                        {type: wheel.compiler.command.T_NUMBER_LOCAL,  value: 1},
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_DEST}
                    ]
                ));

                compilerOutput.add(callCommand);
            };
        })
    );
})();