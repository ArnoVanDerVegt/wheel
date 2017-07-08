(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.commands.Ret',
        wheel.Class(wheel.compiler.commands.BasicCommand, function(supr) {
            this.compile = function(compilerOutput, validatedCommand, splitParams, params) {
                var $ = wheel.compiler.command;

                compilerOutput.a($.set.code, $.DEST(),  $.LOCAL(1));
                compilerOutput.a($.set.code, $.STACK(), $.LOCAL(0));
                compilerOutput.a($.set.code, $.CODE(),  $.DEST());
            };
        })
    );
})();