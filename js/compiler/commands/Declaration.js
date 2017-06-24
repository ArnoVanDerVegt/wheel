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
        'compiler.commands.Declaration',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            /**
             * Set the the value at the address of the local variable...
            **/
            this.addSetLocal = function(local, offset) {
                $ = wheel.compiler.command;
				this._compiler.getOutput().a($.set.code, $.LOCAL(local.offset), $.CONST(offset));
            };

            this.declareRecordFields = function(params, type, arrayType) {
                $ = wheel.compiler.command;
                for (var j = 0; j < params.length; j++) {
                    this._compilerData.declareRecordField(params[j], type, arrayType);
                }
            };
        })
    );
})();
