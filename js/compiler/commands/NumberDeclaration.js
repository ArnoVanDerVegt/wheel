/**
 * Compile a number declaration.
 *
 *         number n1 [, n2[, n3[, ...]]]
 *
 * This code compiles number declarations in three scopes: global, local and record.
 *
**/
(function() {
    var wheel = require('../../utils/base.js').wheel;
    var $;

    wheel(
        'compiler.commands.NumberDeclaration',
        wheel.Class(wheel.compiler.commands.Declaration, function(supr) {
            this.compile = function(validatedCommand, params, origParams, location) {
                $ = wheel.compiler.command;

                var compiler       = this._compiler;
                var compilerOutput = compiler.getOutput();
                var compilerData   = this._compilerData;

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
                                wheel.compiler.compilerHelper.checkNumber(compiler, value, local.value, wheel.compiler.error.NUMBER_LOCAL_CONSTANT_EXPECTED);
                                // Set the the value at the address of the local variable...
                                this.addSetLocal(local, value);
                            } else if (local.type === $.T_NUM_L_ARRAY) { // Like: number arr[3] = [0, 1, 2]
                                var size   = local.size * local.length;
                                var offset = compilerData.allocateGlobal(size); // Allocate space...
                                // Store the data which should be placed at the just allocated space:
                                compilerData.declareConstant(offset, wheel.compiler.compilerHelper.parseNumberArray(local.value, compiler));

                                // Copy the data from the global offset to the local offset...
                                compilerOutput.a($.set.code, $.SRC(),  $.CONST(offset));
                                compilerOutput.a($.set.code, $.DEST(), $.STACK());
                                (local.offset === 0) || compilerOutput.a($.add.code, $.DEST(), $.CONST(local.offset));
                                compilerOutput.a($.copy.code, $.CONST(size), $.CONST(0));
                            }
                        }
                    }
                } else {
                    // Declare a global number or array of numbers...
                    for (var i = 0; i < params.length; i++) {
                        var global = compilerData.declareGlobal(params[i], $.T_NUM_G, $.T_NUM_G_ARRAY, null, true);

                        // Check if the number declaration had a constant value assigned to it...
                        if (global.value) {
                            if (global.type === $.T_NUM_G) { // Like: number n = 1
                                var value = parseFloat(global.value);
                                wheel.compiler.compilerHelper.checkNumber(compiler, value, global.value, wheel.compiler.error.NUMBER_GLOBAL_CONSTANT_EXPECTED);
                                compilerData.declareConstant(global.offset, [value]);
                            } else if (global.type === $.T_NUM_G_ARRAY) { // Like: number arr[3] = [0, 1, 2]
                                var value = global.value.trim();
                                compilerData.declareConstant(global.offset, wheel.compiler.compilerHelper.parseNumberArray(value, compiler));
                            }
                        }
                    }
                }
            };
        })
    );
})();