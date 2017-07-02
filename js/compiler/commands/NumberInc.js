(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.commands.NumberInc',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            this.compile = function(validatedCommand, splitParams, params, location) {
                validatedCommand.code      = wheel.compiler.command.add.code;
                validatedCommand.params[1] = wheel.compiler.command.CONST(1);
                this._compiler.getOutput().add(validatedCommand);
            };
        })
    );
})();