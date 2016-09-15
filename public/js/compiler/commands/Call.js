(function() {
    var wheel = require('../../utils/base.js').wheel;
    var $;

    wheel(
        'compiler.commands.Call',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            this.compileConstantParameter = function(param, paramInfo, offset) {
                var compiler       = this._compiler;
                var compilerOutput = compiler.getOutput();
                var compilerData   = this._compilerData;

                if (paramInfo.metaType === $.T_META_STRING) {
                    paramInfo.value = compilerData.declareString(paramInfo.value);
                }
                compilerOutput.add(compiler.createCommand('set', [{type: $.T_NUM_L, value: offset}, paramInfo]));
            };

            this.compileLocalPoinerParam = function(param, paramInfo, offset, size) {
                var compiler       = this._compiler;
                var compilerOutput = compiler.getOutput();
                var compilerData   = this._compilerData;

                compilerOutput.a($.set.code,  $.SRC(),       $.LOCAL(paramInfo.value));
                compilerOutput.a($.set.code,  $.DEST(),      $.CONST(offset));
                compilerOutput.a($.add.code,  $.DEST(),      $.STACK());
                compilerOutput.a($.copy.code, $.CONST(size), $.CONST(0));
            };

            this.compileLocalParam = function(param, paramInfo, offset) {
                var compiler       = this._compiler;
                var compilerOutput = compiler.getOutput();
                var compilerData   = this._compilerData;
                var vr             = paramInfo.vr;

                if (vr.metaType === $.T_META_POINTER) {
                    this.compileLocalPoinerParam(param, paramInfo, offset, 1);
                } else if (paramInfo.metaType === $.T_META_POINTER) {
                    compilerOutput.a($.set.code, $.DEST(),        $.STACK());
                    compilerOutput.a($.isLocal(paramInfo) ? $.add.code : $.set.code, $.STACK(), $.CONST(paramInfo.vr.origOffset));
                    compilerOutput.a($.set.code, $.SRC(),         $.LOCAL(offset));
                    compilerOutput.a($.set.code, $.STACK(),       $.DEST());
                    compilerOutput.a($.set.code, $.LOCAL(offset), $.SRC());
                } else if (paramInfo.metaType === $.T_META_ADDRESS) {
console.log('Warning!!!');
                    paramInfo.type  = $.T_NUM_G;
                    paramInfo.value = $.REG_SRC;
                    compilerOutput.add(compiler.createCommand('set', [{type: $.T_NUM_L, value: offset}, paramInfo]));

                    if (paramInfo.value) {
                        compilerOutput.a($.set.code, [{type: $.T_NUM_L, value: offset}, {type: $.T_NUM_C, value: paramInfo.value}]);
                    }
                } else {
                    compilerOutput.add(compiler.createCommand('set', [{type: $.T_NUM_L, value: offset}, paramInfo]));
                }
            };

            this.compileLocalStructParam = function(param, paramInfo, offset, size) {
                var compiler       = this._compiler;
                var compilerOutput = compiler.getOutput();
                var compilerData   = this._compilerData;
                var vr             = paramInfo.vr;

                if (paramInfo.metaType === $.T_META_ADDRESS) {
                    compilerOutput.a($.set.code, $.DEST(),        $.STACK());
                    compilerOutput.a($.add.code, $.DEST(),        $.CONST(paramInfo.value));
                    compilerOutput.a($.set.code, $.LOCAL(offset), $.DEST());
                } else if (vr.metaType === $.T_META_POINTER) {
                    this.compileLocalPoinerParam(param, paramInfo, offset, size);
                } else {
                    if (paramInfo.value === 0) {
                        compilerOutput.a($.set.code, $.SRC(), $.STACK());
                    } else {
                        compilerOutput.a($.set.code, $.SRC(), $.CONST(paramInfo.value));
                        compilerOutput.a($.add.code, $.SRC(), $.STACK());
                    }

                    if (offset === 0) {
                        compilerOutput.a($.set.code, $.DEST(), $.STACK());
                    } else {
                        compilerOutput.a($.set.code, $.DEST(), $.CONST(offset));
                        compilerOutput.a($.add.code, $.DEST(), $.STACK());
                    }
                    compilerOutput.a($.copy.code, $.CONST(size), $.CONST(0));
                }
            };

            this.compileGlobalParam = function(param, paramInfo, offset) {
                var compiler       = this._compiler;
                var compilerOutput = compiler.getOutput();
                var compilerData   = this._compilerData;
                var vr             = paramInfo.vr;

                if (vr.metaType === $.T_META_POINTER) {
                    compilerOutput.a($.set.code,  $.SRC(),    $.GLOBAL(paramInfo.value));
                    compilerOutput.a($.set.code,  $.DEST(),   $.CONST(offset));
                    compilerOutput.a($.add.code,  $.DEST(),   $.STACK());
                    compilerOutput.a($.copy.code, $.CONST(1), $.CONST(0));
                } else if (paramInfo.metaType === $.T_META_ADDRESS) {
                    paramInfo.type = $.T_NUM_C;
                    compilerOutput.a($.set.code, [{type: $.T_NUM_L, value: offset}, paramInfo]);
                } else {
                    compilerOutput.a($.set.code, [{type: $.T_NUM_L, value: offset}, paramInfo]);
                }
            };

            this.compileGlobalStructParam = function(param, paramInfo, offset, size) {
                var compiler       = this._compiler;
                var compilerOutput = compiler.getOutput();
                var compilerData   = this._compilerData;
                var vr             = paramInfo.vr;

                if (paramInfo.value) {
                    if (paramInfo.type === $.T_NUM_G_ARRAY) {
                        if (typeof paramInfo.value === 'string') {
                            var data = wheel.compiler.compilerHelper.parseNumberArray(paramInfo.value);
                            size            = data.length;
                            paramInfo.value = compilerData.allocateGlobal(size);
                            compilerData.declareConstant(paramInfo.value, data);
                        }
                    } else if ((paramInfo.type !== $.T_STRUCT_G) && (paramInfo.type !== $.T_STRUCT_G_ARRAY)) {
                        throw compiler.createError('Type mismatch.');
                    }
                }

                if (paramInfo.metaType === $.T_META_ADDRESS) {
                    paramInfo.type = $.T_NUM_C;
                    compilerOutput.add(compiler.createCommand('set', [{type: $.T_NUM_L, value: offset}, paramInfo]));
                } else {
                    if (paramInfo.metaType === $.T_META_POINTER) {
                        compilerOutput.a($.set.code, [$.SRC(), {type: $.T_NUM_G, value: paramInfo.value}]);
                    } else {
                        compilerOutput.a($.set.code, [$.SRC(), {type: $.T_NUM_C, value: paramInfo.value}]);
                    }

                    if (offset === 0) {
                        compilerOutput.a($.set.code, [$.DEST(), $.STACK()]);
                    } else {
                        compilerOutput.a($.set.code, [$.DEST(), {type: $.T_NUM_C, value: offset}]);
                        compilerOutput.a($.add.code, [$.DEST(), $.STACK()]);
                    }
                    compilerOutput.a($.copy.code, [{type: $.T_NUM_C, value: size}]);
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

                        // If the var is declared as a pointer and passed as *varname...
                        if ((vr && vr.struct && (vr.metaType === $.T_META_POINTER)) &&
                            (paramInfo.metaType === $.T_META_POINTER)) {
                            size = vr.struct.size;
                        }

                        switch (paramInfo.type) {
                            case $.T_NUM_C:
                                this.compileConstantParameter(param, paramInfo, offset);
                                break;

                            case $.T_NUM_L:
                                this.compileLocalParam(param, paramInfo, offset);
                                break;

                            case $.T_NUM_L_ARRAY:
                            case $.T_STRUCT_L_ARRAY:
                            case $.T_STRUCT_L:
                                this.compileLocalStructParam(param, paramInfo, offset, size);
                                break;

                            case $.T_NUM_G:
                                this.compileGlobalParam(param, paramInfo, offset);
                                break;

                            case $.T_NUM_G_ARRAY:
                            case $.T_STRUCT_G_ARRAY:
                            case $.T_STRUCT_G:
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
                $ = wheel.compiler.command;

                var compiler         = this._compiler;
                var compilerOutput   = compiler.getOutput();
                var compilerData     = this._compilerData;
                var i                = line.indexOf('(');
                var procedure        = line.substr(0, i);

                if (!wheel.compiler.compilerHelper.validateString(procedure, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_.')) {
                    throw compiler.createError('Syntax error.');
                }

                var callCommand;
                var p                     = compilerData.findProcedure(procedure);
                var currentLocalStackSize = compilerData.getLocalOffset();

                if (p !== null) {
                    callCommand = {code: $.set.code, params: [$.CODE(), {type: $.T_NUM_C, value: p.index - 1}]};
                } else {
                    var local = compilerData.findLocal(procedure);
                    if (local !== null) {
                        if (local.type !== $.T_PROC_L) {
                            throw compiler.createError('Type error, can not call "' + procedure + '".');
                        }

                        // Move the code offset above the stack into the stack of the new procedure...
                        var offset = local.offset + currentLocalStackSize;
                        compilerOutput.a($.set.code, [{type: $.T_NUM_L, value: offset}, {type: $.T_NUM_L, value: local.offset}]);
                        callCommand = {
                            code: $.set.code,
                            params: [
                                {type: $.T_NUM_G, value: $.REG_CODE},
                                {type: $.T_NUM_L, value: local.offset}
                            ]
                        };
                    } else {
                        var global = compilerData.findGlobal(procedure)
                        if (global !== null) {
                            if ((global.type !== $.T_NUM_G) && (global.type !== $.T_PROC_G)) {
                                throw compiler.createError('Type error, can not call "' + procedure + '".');
                            }

                            callCommand = {
                                code: $.set.code,
                                params: [
                                    {type: $.T_NUM_G, value: $.REG_CODE},
                                    {type: $.T_NUM_G, value: global.offset}
                                ]
                            };
                        } else {
                            throw compiler.createError('Unknown procedure "' + procedure + '".');
                        }
                    }
                }
                this.compileParams(line.substr(i + 1, line.length - i - 2).trim(), currentLocalStackSize);

                // Move the code offset to the dest register...
                compilerOutput.a($.set.code, [$.DEST(),                     $.CODE()]);
                // Add 6, these are the call setup commands... (including this one!)
                compilerOutput.a($.add.code, [$.DEST(),                     {type: $.T_NUM_C, value: 6}]);

                compilerOutput.a($.set.code, [$.SRC(),                      $.STACK()]);
                compilerOutput.a($.add.code, [$.STACK(),                    {type: $.T_NUM_C, value: currentLocalStackSize}]);
                compilerOutput.a($.set.code, [{type: $.T_NUM_L, value: 0},  $.SRC()]);
                // Move the dest register value to the stack, this is the return code offset!
                compilerOutput.a($.set.code, [{type: $.T_NUM_L, value: 1},  $.DEST()]);

                compilerOutput.add(callCommand);
            };
        })
    );
})();