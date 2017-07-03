/**
 * Compile a set command.
**/
(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.commands.Set',
        wheel.Class(wheel.compiler.commands.NumberOperator, function(supr) {
            this.compile = function(validatedCommand, splitParams, params) {
                var compilerData   = this._compilerData;
                var compilerOutput = this._compiler.getOutput();
                var param1         = validatedCommand.params[0];
                var param2         = validatedCommand.params[1];
                var $              = wheel.compiler.command;

                if ($.isStringConstType(param2) ||
                    (($.isStringVarMetaType(param1) && $.isStringVarMetaType(param2)))) {
                    $.isStringMetaType(param2) && (param2.value = compilerData.declareString(param2.value));
                    compilerOutput.add(validatedCommand);
                } else if ($.isSimpleNumberType(param1) && $.isPointerVarMetaType(param1)) {
                    compilerOutput.add(validatedCommand);
                } else if ($.isSimpleNumberType(param1) && $.isConst(param2)) {
                    compilerOutput.add(validatedCommand);
                } else if ($.isSimpleNumberType(param1) && $.isSimpleNumberType(param2)) {
                    compilerOutput.add(validatedCommand);
                } else if ($.isSimpleNumberType(param1) && $.isProcType(param2)) {
                    compilerOutput.add(validatedCommand);
                } else if ($.isProcType(param1) && $.isProcType(param2)) {
                    compilerOutput.add(validatedCommand);
                } else if (param1.type === $.T_STRUCT_L) {
                    param1.type = $.T_NUM_L;
                    compilerOutput.add(validatedCommand);
                } else if (param1.type === $.T_STRUCT_G) {
                    param1.type = $.T_NUM_G;
                    compilerOutput.add(validatedCommand);
                }
            };
        })
    );
})();