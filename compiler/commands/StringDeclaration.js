/**
 * Compile a string declaration.
 *
 *         string n1 [, n2[, n3[, ...]]]
 *
 * This code compiles string declarations in three scopes: global, local and struct.
 *
**/
(function() {
    var wheel = require('../../utils/base.js').wheel;
    var $;

    wheel(
        'compiler.commands.StringDeclaration',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            this.compile = function(validatedCommand, params, location) {
                $ = wheel.compiler.command;

                var compiler       = this._compiler;
                var compilerOutput = compiler.getOutput();
                var compilerData   = this._compilerData;

                if (compiler.getActiveStruct() !== null) {
                    // Declare a string of array of strings field in a struct...
                    for (var i = 0; i < params.length; i++) {
                        var structField = compilerData.declareStructField(params[i], $.T_NUM_G, $.T_NUM_G_ARRAY);
                        structField && (structField.metaType = $.T_META_STRING);
                    }
                } else if (compiler.getInProc()) {
                    // Declare a local string constant...
                    for (var j = 0; j < params.length; j++) {
                        var local = compilerData.declareLocal(params[j], $.T_NUM_L, $.T_NUM_L_ARRAY, null, true);
                        local.metaType = $.T_META_STRING;

                        // Check if the string declaration had a constant value assigned to it...
                        if (local.value) {
                            if (local.type === $.T_NUM_L) { // Like: string s = "abc"
                                var value = local.value;
                                if ((value.length < 2) || (value[0] !== '"') || (value.substr(-1) !== '"')) {
                                    throw compiler.createError(5, 'String expected, found "' + value + '".');
                                }
                                var offset = compilerData.declareString(value.substr(1, value.length - 2));
                                // Set the the value at the address of the local variable...
                                compilerOutput.a($.set.code, $.LOCAL(local.offset), $.CONST(offset));
                            } else if (local.type === $.T_NUM_L_ARRAY) { // Like: string arr[3] = ["a", "b", "c"]
                                var size   = local.size * local.length;
                                var offset = compilerData.allocateGlobal(size); // Allocate space...

                                // Store the data which should be placed at the just allocated space:
                                compilerData.declareConstant(offset, wheel.compiler.compilerHelper.parseStringArray(local.value, compiler, compilerData));

                                // Copy the data from the global offset to the local offset...
                                compilerOutput.a($.set.code, $.SRC(), $.CONST(offset));
                                compilerOutput.a($.set.code, $.DEST(), $.STACK());
                                (local.offset === 0) || compilerOutput.a($.add.code, $.DEST(), $.CONST(local.offset));

                                compilerOutput.a($.copy.code, $.CONST(size), $.CONST(0));
                            }
                        }
                    }
                } else {
                    // Declare a global string or array of strings...
                    for (var i = 0; i < params.length; i++) {
                        var global = compilerData.declareGlobal(params[i], $.T_NUM_G, $.T_NUM_G_ARRAY, null, location, true);
                        global.metaType = $.T_META_STRING;
                        // Check if the string declaration had a constant value assigned to it...
                        if (global.value) {
                            if (global.type === $.T_NUM_G) { // Like: string n = "abc"
                                if (!wheel.compiler.compilerHelper.getWrappedInChars(global.value, '"', '"')) {
                                    throw compiler.createError(6, 'String expected, found "' + global.value + '".');
                                }

                                var value  = global.value;
                                var offset = compilerData.declareString(value.substr(1, value.length - 2));
                                compilerData.declareConstant(global.offset, [offset]);
                            } else if (global.type === $.T_NUM_G_ARRAY) { // Like: string arr[3] = ["a", "b", "c"]
                                if (!wheel.compiler.compilerHelper.getWrappedInChars(global.value, '[', ']')) {
                                    throw compiler.createError(7, 'String array expected, found "' + global.value + '".');
                                }

                                var value = global.value.trim();
                                var data  = wheel.compiler.compilerHelper.parseStringArray(value, compiler, compilerData);
                                compilerData.declareConstant(global.offset, data);
                            }
                        }
                    }
                }
            };
        })
    );
})();