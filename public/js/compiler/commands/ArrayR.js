/**
 * Compile an array read command.
 *
 *         arrayr value, array, index
 *
 * Read an array value from a given index.
 *
**/
(function() {
    var wheel = require('../../utils/base.js').wheel;
    var $;

    wheel(
        'compiler.commands.ArrayR',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            this.compile = function(command) {
                $ = wheel.compiler.command;

                var compiler        = this._compiler;
                var compilerOutput  = this._compiler.getOutput();
                var compilerData    = this._compilerData;
                var valueParam      = command.params[0];
                var arrayParam      = command.params[1];
                var indexParam      = command.params[2];

                /**
                 * arrarr value, array, index
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
                if ($.isNumberType(valueParam) && $.isNumberType(arrayParam)) {
                    compilerOutput.a($.set.code, $.DEST(),   $.STACK());
                    compilerOutput.a($.set.code, $.SRC(),    indexParam);
                    compilerOutput.a($.add.code, $.SRC(),    $.CONST(arrayParam.value));
                    $.isLocal(arrayParam) && compilerOutput.a($.add.code, $.SRC(), $.STACK());
                    compilerOutput.a($.set.code, $.STACK(),  $.SRC());
                    compilerOutput.a($.set.code, $.SRC(),    $.LOCAL(0));
                    compilerOutput.a($.set.code, $.STACK(),  $.DEST());
                    compilerOutput.a($.set.code, valueParam, $.SRC());
                } else if ($.isProcType(valueParam) && $.isProcType(arrayParam)) {
                    console.error('Unimplemented.');
                } else if ($.isPointerVarMetaType(valueParam) && $.isPointerVarMetaType(arrayParam)) {
                    console.error('Unimplemented.');
                } else if ($.isStructVarType(valueParam) && $.isStructVarType(arrayParam)) {
                    var size = valueParam.vr.struct.size;
                    compilerOutput.a($.set.code, $.SRC(),  indexParam);
                    (size > 1) && compilerOutput.a($.mul.code, $.SRC(), $.CONST(size));

                    if ($.isPointerVarMetaType(arrayParam)) {
                        var type = $.isLocal(arrayParam) ? $.T_NUM_L : $.T_NUM_G;
                        compilerOutput.a($.add.code, $.SRC(), {type: type, value: arrayParam.value});
                    } else {
                        compilerOutput.a($.add.code, $.SRC(), $.CONST(arrayParam.value));
                        $.isLocal(arrayParam) && compilerOutput.a($.add.code, $.SRC(), $.STACK());
                    }

                    if ($.isPointerVarMetaType(valueParam)) {
                        var type = $.isLocal(valueParam) ? $.T_NUM_L : $.T_NUM_G;
                        compilerOutput.a($.add.code, $.SRC(), {type: type, value: valueParam.value});
                    } else {
                        compilerOutput.a($.set.code, $.DEST(), $.CONST(valueParam.value));
                        $.isLocal(valueParam) && compilerOutput.a($.add.code, [$.DEST(), $.STACK()]);
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