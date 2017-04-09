/**
 * Compile a set command.
**/
(function() {
    var wheel = require('../../utils/base.js').wheel;
    var $;

    wheel(
        'compiler.commands.Set',
        wheel.Class(wheel.compiler.commands.NumberOperator, function(supr) {
            this.compile = function(validatedCommand, splitParams, params, location) {
                $ = wheel.compiler.command;

                var compilerData   = this._compilerData;
                var compilerOutput = this._compiler.getOutput();
                var param1         = validatedCommand.params[0];
                var param2         = validatedCommand.params[1];
                var offset;

                if ($.isStringConstType(param2) ||
                    (($.isStringVarMetaType(param1) && $.isStringVarMetaType(param2)))) {
                    $.isStringMetaType(param2) && (param2.value = compilerData.declareString(param2.value));
                    compilerOutput.add(validatedCommand);
                } else if ($.isPointerVarMetaType(param1) && $.isAddressMetaType(param2)) {
                    compilerOutput.a($.set.code, $.DEST(), $.CONST(param2.value));
                    $.isLocal(param2) && compilerOutput.a($.add.code, $.DEST(), $.STACK());
                    param1.type  = $.isLocal(param1) ? $.T_NUM_L : $.T_NUM_G;
                    param2.type  = $.T_NUM_G;
                    param2.value = $.REG_DEST;
                    compilerOutput.add(validatedCommand);
                } else if ($.isSimpleNumberType(param1) && $.isPointerVarMetaType(param1)) {
                    compilerOutput.a($.set.code, $.DEST(),        param2);
                    compilerOutput.a($.set.code, $.SRC(),         $.STACK());
                    this.addSetStackParam1(param1);
                    compilerOutput.a($.set.code, $.LOCAL(0),      $.DEST());
                    compilerOutput.a($.set.code, $.STACK(),       $.SRC());
                } else if ($.isPointerMetaType(param1)) {
                    offset = compilerData.getStructOffset(param1);
                    compilerOutput.a($.set.code, $.DEST(),        param2);
                    compilerOutput.a($.set.code, $.SRC(),         $.STACK());
                    this.addSetStackParam1(param1);
                    compilerOutput.a($.set.code, $.LOCAL(offset), $.DEST());
                    compilerOutput.a($.set.code, $.STACK(),       $.SRC());
                } else if ($.isSimpleNumberType(param1) && $.isPointerMetaType(param2)) {
                    compilerOutput.a($.set.code, $.SRC(), $.STACK());
                    this.addAddStackParam2(param2, compilerData.getOffset(param2));
                    compilerOutput.a($.set.code, $.STACK(), $.LOCAL(0));
                    compilerOutput.a($.set.code, $.DEST(),  $.LOCAL(compilerData.getStructOffset(param2)));
                    compilerOutput.a($.set.code, $.STACK(), $.SRC());
                    compilerOutput.a($.set.code, param1,    $.DEST());
                } else if ($.isSimpleNumberType(param1) && $.isConst(param2)) {
                    compilerOutput.add(validatedCommand);
                } else if ($.isSimpleNumberType(param1) && $.isSimpleNumberType(param2)) {
                    compilerOutput.add(validatedCommand);
                } else if ($.isSimpleNumberType(param1) && $.isProcType(param2)) {
                    compilerOutput.add(validatedCommand);
                } else if ($.isProcType(param1) && $.isProcType(param2)) {
                    compilerOutput.add(validatedCommand);
                }
            };
        })
    );
})();