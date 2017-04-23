/**
 * Compile a set command.
**/
(function() {
    var wheel = require('../../utils/base.js').wheel;
    var $;

    wheel(
        'compiler.commands.NumberOperator',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            this.compile = function(validatedCommand, splitParams, params, location) {
                $ = wheel.compiler.command;

                var compilerData   = this._compilerData;
                var compilerOutput = this._compiler.getOutput();
                var code           = validatedCommand.code;
                var param1         = validatedCommand.params[0];
                var param2         = validatedCommand.params[1];
                var offset;

                if ($.isStringVarMetaType(param1) || $.isStringVarMetaType(param2)) {
                    throw this._compiler.createError(wheel.compiler.error.INVALID_OPERATION_WITH_STRING, 'Invalid operation "' + param1.param + '".');
                }

                if ($.isSimpleNumberType(param1) && $.isConst(param2)) {
                    if ($.isStringConstType(param2)) {
                        throw this._compiler.createError(wheel.compiler.error.INVALID_OPERATION_WITH_STRING, 'Invalid operation "' + param2.param + '".');
                    }
                    compilerOutput.add(validatedCommand);
                } else {
                    if (wheel.compiler.command.isAddressMetaType(param2)) {
                        throw this._compiler.createError(wheel.compiler.error.INVALID_OPERATION, 'Invalid operation "' + param2.param + '".');
                    }
                    compilerOutput.add(validatedCommand);
                }
            };
        })
    );
})();