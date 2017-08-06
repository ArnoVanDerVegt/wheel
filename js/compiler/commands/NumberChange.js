(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.commands.NumberChange',
        wheel.Class(wheel.compiler.commands.BasicCommand, function(supr) {
            this.compile = function(compilerOutput, validatedCommand, splitParams, params, code) {
                validatedCommand.code      = code;
                validatedCommand.params[1] = wheel.compiler.command.CONST(1);
                compilerOutput.add(validatedCommand);
            };
        })
    );
})();