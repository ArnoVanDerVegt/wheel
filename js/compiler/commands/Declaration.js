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

    wheel(
        'compiler.commands.Declaration',
        wheel.Class(wheel.compiler.commands.BasicCommand, function(supr) {
            /**
             * Set the the value at the address of the local variable...
            **/
            this.addSetLocal = function(local, offset) {
                var $ = wheel.compiler.command;

				this._compiler.getOutput().a($.set.code, $.LOCAL(local.offset), $.CONST(offset));
            };

            /**
             * Copy the data from the global offset to the local offset...
            **/
            this.copyData = function(local, offset, size) {
                var compilerOutput = this._compiler.getOutput();
                var $              = wheel.compiler.command;

                compilerOutput.a($.set.code, $.SRC(), $.CONST(offset));
                compilerOutput.a($.set.code, $.DEST(), $.STACK());
                this.addToDestIfValue(local.offset);
                compilerOutput.a($.copy.code, $.CONST(size), $.CONST(0));
            };

            this.declareRecordFields = function(params, type, arrayType) {
                for (var j = 0; j < params.length; j++) {
                    this._compilerData.declareRecordField(params[j], type, arrayType);
                }
            };

            this.declareGlobalArray = function(params, callback) {
                var compilerData = this._compilerData;
                var $            = wheel.compiler.command;

                // Declare a global string or array of strings...
                params.forEach(
                    function(param) {
                        var global = compilerData.declareGlobal(param, $.T_NUM_G, $.T_NUM_G_ARRAY, null, true);
                        global.value && callback.call(this, global);
                    },
                    this
                );
            };

            this.declareLocalArray = function(local, parser) {
                var compilerData = this._compilerData;
                var size         = local.size * local.length;
                var offset       = compilerData.allocateGlobal(size); // Allocate space...

                // Store the data which should be placed at the just allocated space:
                compilerData.declareConstant(offset, parser(local.value, this._compiler, this._compilerData));
                this.copyData(local, offset, size);
            };
        })
    );
})();
