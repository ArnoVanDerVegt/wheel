/**
 * Compile an array write command.
 *
 *         arrayw array, index, value
 *
 * Store an item in an array at a given index.
 *
 * value   | array    | size   | src   | dest
 * --------+----------+--------+-------+------
 * proc    | proc     | 1      | value | value
 * number  | number   | 1      | value | value
 * pointer | pointer  | 1      | value | value
 * struct  | struct   | struct | addr  | addr
 * struct  | pointer  | struct | addr  | addr
 * pointer | struct   | 1      | value | addr
**/
(function() {
    var wheel = require('../../utils/base.js').wheel;
    var $;

    wheel(
        'compiler.commands.ArrayW',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            this.compile = function(command) {
                $ = wheel.compiler.command;

                var compilerOutput = this._compiler.getOutput();
                var compilerData   = this._compilerData;
                var arrayParam     = command.params[0];
                var indexParam     = command.params[1];
                var valueParam     = command.params[2];

                if ($.isNumberType(valueParam) && $.isNumberType(arrayParam)) {
                    compilerOutput.a($.set.code,  $.DEST(),   indexParam);
                    compilerOutput.a($.add.code,  $.DEST(),   $.CONST(arrayParam.value));
                    $.isLocal(arrayParam) && compilerOutput.a($.add.code, $.DEST(), $.STACK());
                    compilerOutput.a($.set.code,  $.SRC(),    $.CONST(valueParam.value));
                    $.isLocal(valueParam) && compilerOutput.a($.add.code, $.SRC(), $.STACK());
                    compilerOutput.a($.copy.code, $.CONST(1), $.CONST(0));
                    return;
                } else if ($.isConst(valueParam) && $.isNumberType(arrayParam)) {
                    compilerOutput.a($.set.code, $.DEST(), indexParam);

                    if ($.isPointerVarMetaType(arrayParam)) {
                        var type = $.isLocal(arrayParam) ? $.T_NUM_L : $.T_NUM_G;
                        compilerOutput.a($.add.code, $.DEST(), {type: type, value: arrayParam.value});
                    } else {
                        compilerOutput.a($.add.code, $.DEST(), $.CONST(arrayParam.value));
                        $.isLocal(arrayParam) && compilerOutput.a($.add.code, $.DEST(), $.STACK());
                    }

                    var localOffset = compilerData.getLocalOffset();
                    compilerOutput.a($.set.code,  $.LOCAL(localOffset), valueParam);
                    compilerOutput.a($.set.code,  $.SRC(),              $.CONST(localOffset));
                    compilerOutput.a($.add.code,  $.SRC(),              $.STACK());
                    compilerOutput.a($.copy.code, $.CONST(1),           $.CONST(0));
                    return;

                } else if ($.isProcType(valueParam) && $.isProcType(arrayParam)) {
                    console.error('Unimplemented.');
                } else if ($.isPointerVarMetaType(valueParam) && $.isPointerVarMetaType(arrayParam)) {
                    console.error('Unimplemented.');
                } else if ($.isStructVarType(valueParam) && $.isStructVarType(arrayParam)) {
                    var size = valueParam.vr.struct.size;
                    compilerOutput.a($.set.code, $.DEST(), indexParam);
                    (size > 1) && compilerOutput.a($.mul.code, $.DEST(), $.CONST(size));

                    if ($.isPointerVarMetaType(arrayParam)) {
                        var type = $.isLocal(arrayParam) ? $.T_NUM_L : $.T_NUM_G;
                        compilerOutput.a($.add.code, $.DEST(), {type: type, value: arrayParam.value});
                    } else {
                        compilerOutput.a($.add.code, $.DEST(), $.CONST(arrayParam.value));
                        $.isLocal(arrayParam) && compilerOutput.a($.add.code, $.DEST(), $.STACK());
                    }

                    if ($.isPointerVarMetaType(valueParam)) {
                        var type = $.isLocal(valueParam) ? $.T_NUM_L : $.T_NUM_G;
                        compilerOutput.a($.add.code, $.SRC(), {type: type, value: valueParam.value});
                    } else {
                        compilerOutput.a($.set.code, $.SRC(), $.CONST(valueParam.value));
                        $.isLocal(valueParam) && compilerOutput.a($.add.code, [$.SRC(), $.STACK()]);
                    }

                    compilerOutput.a($.copy.code, $.CONST(size), $.CONST(0));
                } else if ($.isStructVarType(valueParam) && $.isPointerVarMetaType(arrayParam)) {
                    console.error('Unimplemented.');
                } else if ($.isPointerVarMetaType(valueParam) && $.isPointerVarMetaType(arrayParam)) {
                    console.error('Unimplemented.');
                } else {
                    console.error('Unimplemented.');
                }
            };
        })
    );
})();