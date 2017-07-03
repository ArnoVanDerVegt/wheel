(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.commands.Addr',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            this.compile = function(validatedCommand, splitParams, params) {
                var compilerOutput = this._compiler.getOutput();
                var param          = validatedCommand.params[0];

                // set src, param.value
                var $ = wheel.compiler.command;
                compilerOutput.a($.set.code, $.SRC(), $.CONST(param.value));
                $.isLocal(param) && compilerOutput.a($.add.code, $.SRC(), $.STACK());
            };
        })
    );
})();