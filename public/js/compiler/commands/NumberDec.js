(function() {
    var wheel = require('../../utils/base.js').wheel;
    var $;

    wheel(
        'compiler.commands.NumberDec',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            this.compile = function(validatedCommand) {
                $ = wheel.compiler.command;

                validatedCommand.code      = $.sub.code;
                validatedCommand.params[1] = $.CONST(1);
                this._compiler.getOutput().add(validatedCommand);
            };
        })
    );
})();