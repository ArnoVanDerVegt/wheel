/**
 * Compile a string declaration.
 *
 *         string n1 [, n2[, n3[, ...]]]
 *
 * This code compiles string declarations in three scopes: global, local and record.
 *
**/
(function() {
    var wheel          = require('../../utils/base.js').wheel;
    var compilerHelper = wheel.compiler.helpers.compilerHelper;

    wheel(
        'compiler.commands.StringDeclaration',
        wheel.Class(wheel.compiler.commands.Declaration, function(supr) {
            this.checkWrappedString = function(global, openChar, closeChar, message, error) {
                if (!compilerHelper.getWrappedInChars(global.value, openChar, closeChar)) {
                    throw this._compiler.createError(error, message + ' "' + global.value + '".');
                }
            };

            this.compile = function(compilerOutput, validatedCommand, params) {
                var compiler     = this._compiler;
                var compilerData = this._compilerData;
                var $            = wheel.compiler.command;

                if (compiler.getActiveRecord() !== null) {
                    // Declare a string of array of strings field in a record...
                    for (var i = 0; i < params.length; i++) {
                        var recordField = compilerData.declareRecordField(params[i], $.T_NUM_G, $.T_NUM_G_ARRAY);
                        recordField && (recordField.metaType = $.T_META_STRING);
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

                                // Set the the value at the address of the local variable...
                                this.addSetLocal(local, compilerData.declareString(value.substr(1, value.length - 2)));
                            } else if (local.type === $.T_NUM_L_ARRAY) { // Like: string arr[3] = ["a", "b", "c"]
                                this.declareLocalArray(local, compilerHelper.parseStringArray.bind(compilerHelper));
                            }
                        }
                    }
                } else {
                    this.declareGlobalArray(
                        params,
                        function(global) {
                            global.metaType = $.T_META_STRING;
                            var value = global.value.trim();

                            if (global.type === $.T_NUM_G) { // Like: string n = "abc"
                                this.checkWrappedString(global, '"', '"', 'String expected, found', wheel.compiler.error.STRING_EXPECTED_FOUND_NUMBER);
                                compilerData.declareConstant(global.offset, [compilerData.declareString(value.substr(1, value.length - 2))]);
                            } else if (global.type === $.T_NUM_G_ARRAY) { // Like: string arr[3] = ["a", "b", "c"]
                                this.checkWrappedString(global, '[', ']', 'String array expected, found', wheel.compiler.error.STRING_ARRAY_EXPECTED);
                                compilerData.declareConstant(global.offset, compilerHelper.parseStringArray(value, compiler, compilerData));
                            }
                        }
                    );
                }
            };
        })
    );
})();