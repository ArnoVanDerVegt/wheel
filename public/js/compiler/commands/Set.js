/**
 * Compile a set command.
**/
(function() {
    var wheel = require('../../utils/base.js').wheel;
    var $;

    wheel(
        'compiler.commands.Set',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            this.compile = function(validatedCommand) {
                $ = wheel.compiler.command;

                var compiler       = this._compiler;
                var compilerData   = this._compilerData;
                var compilerOutput = compiler.getOutput();
                var param1         = validatedCommand.params[0];
                var param2         = validatedCommand.params[1];
                var regDestSet     = false;
                var regStackSaved  = false;

                if (param1.vr && (param1.vr.metaType === $.T_META_STRING)) {
                    if (param2.metaType === $.T_META_STRING) {
                        param2.value = compilerData.declareString(param2.value);
                    } else if (param2.vr.metaType === $.T_META_STRING) {
                        // set string, string...
                    } else {
                        throw compiler.createError('Type error.');
                    }
                }

                var param2IsAddress = (param2.metaType === $.T_META_ADDRESS);
                if (param2IsAddress) {
                    if ($.typeToLocation(param2.type) === 'local') {
                        compilerOutput.a($.set.code, [$.DEST(), {type: $.T_NUM_G, value: $.REG_STACK}]);
                        (param2.value !== 0) &&
                            compilerOutput.a($.add.code, [$.DEST(), {type: $.T_NUM_C, value: param2.value}]);
                    } else {
                        compilerOutput.a($.set.code, [$.DEST(), {type: $.T_NUM_C, value: param2.value}]);
                    }
                    if (param1.vr && (param1.vr.metaType === $.T_META_POINTER)) {
                        if ($.typeToLocation(param1.type) === 'local') {
                            param1.type = $.T_NUM_L;
                        } else {
                            param1.type = $.T_NUM_G;
                        }
                    }

                    param2.type  = $.T_NUM_G;
                    param2.value = $.REG_DEST;
                } else if (param2.metaType === $.T_META_POINTER) {
                    compilerOutput.a($.set.code, [$.SRC(), $.STACK()]);
                    regStackSaved = true;

                    var paramOffset = param2.value;
                    if (param2.vr && param2.vr.origOffset) {
                        paramOffset = param2.vr.origOffset;
                    }

                    if ($.typeToLocation(param2.type) === 'local') {
                        compilerOutput.a($.add.code, [$.STACK(), {type: $.T_NUM_C, value: paramOffset}]);
                    } else {
                        compilerOutput.a($.set.code, [$.STACK(), {type: $.T_NUM_C, value: paramOffset}]);
                    }

                    compilerOutput.a($.set.code, [$.STACK(), {type: $.T_NUM_L, value: 0}]);

                    var paramOffset = 0;
                    if (param2.vr.struct) {
                        // Hacky...
                        var p      = param2.param;
                        var i      = p.lastIndexOf('.');
                        var field  = p.substr(i + 1 - p.length);
                        var paramOffset = param2.vr.struct.fields[field].offset;
                    }

                    compilerOutput.a($.set.code, [$.DEST(), {type: $.T_NUM_L,  value: paramOffset}]);
                    regDestSet = true;

                    compilerOutput.a($.set.code, [$.STACK(), $.SRC()]);

                    if (param1.metaType !== $.T_META_POINTER) {
                        param2.type  = $.T_NUM_G;
                        param2.value = $.REG_DEST;
                        compilerOutput.add(validatedCommand);
                        return;
                    }
                }

                if (param1.metaType === $.T_META_POINTER) {
                    if (!regDestSet) {
                        compilerOutput.a($.set.code, [$.DEST(), JSON.parse(JSON.stringify(param2))]);
                    }
                    if (!regStackSaved) {
                        compilerOutput.a($.set.code, [$.SRC(), $.STACK()]);
                    }

                    if ($.typeToLocation(param1.type) === 'local') {
                        var vr     = param1.vr;
                        var offset = ('origOffset' in vr) ? vr.origOffset : vr.offset;
                        compilerOutput.a($.set.code, [$.STACK(), {type: $.T_NUM_L, value: offset}]);
                    } else {
                        compilerOutput.a($.set.code, [$.STACK(), {type: $.T_NUM_G, value: param1.value}]);
                    }

                    var offset = 0;
                    if (param1.vr.struct && !param2IsAddress) {
                        // Hacky...
                        var p     = param1.param;
                        var i     = p.lastIndexOf('.');
                        var field = p.substr(i + 1 - p.length);
                        offset = param1.vr.struct.fields[field].offset;
                    }

                    param1.type  = $.T_NUM_L;
                    param1.value = offset;
                    param2.type  = $.T_NUM_G;
                    param2.value = $.REG_DEST;
                    compilerOutput.add(validatedCommand);

                    compilerOutput.a($.set.code, [$.STACK(), $.SRC()]);
                } else {
                    compilerOutput.add(validatedCommand);
                }
            };
        })
    );
})();