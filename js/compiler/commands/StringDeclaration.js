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
        wheel.Class(wheel.compiler.commands.Declaration, function(supr) {
            this.checkWrappedString = function(global, openChar, closeChar, message, error) {
                if (!wheel.compiler.compilerHelper.getWrappedInChars(global.value, openChar, closeChar)) {
                    throw this._compiler.createError(error, message + ' "' + global.value + '".');
                }
            };

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
                                    throw compiler.createError(wheel.compiler.error.STRING_EXPECTED_IN_CONSTANT, 'String expected, found "' + value + '".');
                                }
                                var offset = compilerData.declareString(value.substr(1, value.length - 2));

                                // Set the the value at the address of the local variable...
                                this.addSetLocal(local, offset);
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
                            var value = global.value.trim();

                            if (global.type === $.T_NUM_G) { // Like: string n = "abc"
                                this.checkWrappedString(global, '"', '"', 'String expected, found', wheel.compiler.error.STRING_EXPECTED_FOUND_NUMBER);
                                compilerData.declareConstant(global.offset, [compilerData.declareString(value.substr(1, value.length - 2))]);
                            } else if (global.type === $.T_NUM_G_ARRAY) { // Like: string arr[3] = ["a", "b", "c"]
                                this.checkWrappedString(global, '[', ']', 'String array expected, found', wheel.compiler.error.STRING_ARRAY_EXPECTED);
                                compilerData.declareConstant(global.offset, wheel.compiler.compilerHelper.parseStringArray(value, compiler, compilerData));
                            }
                        }
                    }
                }
            };
        })
    );
})();