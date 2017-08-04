(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.commands.Ret',
        wheel.Class(wheel.compiler.commands.BasicCommand, function(supr) {
            this.compile = function(compilerOutput, validatedCommand, splitParams, params) {
                var $ = wheel.compiler.command;

                if (this._compiler.getDirective().getRet()) {
                    compilerOutput.a($.ret.code, $.CONST(0), $.CONST(0));
                } else {
                    compilerOutput.a($.set.code, $.DEST(),  $.LOCAL(1));
                    compilerOutput.a($.set.code, $.STACK(), $.LOCAL(0));
                    compilerOutput.a($.set.code, $.CODE(),  $.DEST());
                }
            };
        })
    );
})();