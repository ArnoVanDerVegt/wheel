/**
 * Compile a number declaration.
 *
 *         number n1 [, n2[, n3[, ...]]]
 *
 * This code compiles number declarations in three scopes: global, local and record.
 *
**/
(function() {
    var wheel          = require('../../utils/base.js').wheel;
    var compilerHelper = wheel.compiler.helpers.compilerHelper;

    wheel(
        'compiler.commands.NumberDeclaration',
        wheel.Class(wheel.compiler.commands.Declaration, function(supr) {
            this.compile = function(compilerOutput, validatedCommand, params, origParams) {
                var compiler       = this._compiler;
                var compilerData   = this._compilerData;
                var $              = wheel.compiler.command;

                if (compiler.getActiveRecord() !== null) {
                    // Declare a number of array of numbers field in a record...
                    this.declareRecordFields(params, $.T_NUM_G, $.T_NUM_G_ARRAY);
                } else if (compiler.getInProc()) {
                    // Declare a local number constant...
                    for (var j = 0; j < params.length; j++) {
                        var local = compilerData.declareLocal(params[j], $.T_NUM_L, $.T_NUM_L_ARRAY, null, true);

                        // Check if the number declaration had a constant value assigned to it...
                        if (local.value) {
                            if (local.type === $.T_NUM_L) { // Like: number n = 1
                                var value = parseFloat(local.value);
                                compilerHelper.checkNumber(compiler, value, local.value, wheel.compiler.error.NUMBER_LOCAL_CONSTANT_EXPECTED);
                                // Set the the value at the address of the local variable...
                                this.addSetLocal(local, value);
                            } else if (local.type === $.T_NUM_L_ARRAY) { // Like: number arr[3] = [0, 1, 2]
                                this.declareLocalArray(local, compilerHelper.parseNumberArray.bind(compilerHelper));
                            }
                        }
                    }
                } else {
                    this.declareGlobalArray(
                        params,
                        function(global) {
                            // Check if the number declaration had a constant value assigned to it...
                            if (global.type === $.T_NUM_G) { // Like: number n = 1
                                var value = parseFloat(global.value);
                                compilerHelper.checkNumber(compiler, value, global.value, wheel.compiler.error.NUMBER_GLOBAL_CONSTANT_EXPECTED);
                                compilerData.declareConstant(global.offset, [value]);
                            } else if (global.type === $.T_NUM_G_ARRAY) { // Like: number arr[3] = [0, 1, 2]
                                var value = global.value.trim();
                                compilerData.declareConstant(global.offset, compilerHelper.parseNumberArray(value, compiler));
                            }
                        }
                    );
                }
            };
        })
    );
})();