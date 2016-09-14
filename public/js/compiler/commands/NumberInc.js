(function() {
    var wheel = require('../../utils/base.js').wheel;
    var $;

    wheel(
        'compiler.commands.NumberInc',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            this.compile = function(validatedCommand) {
                $ = wheel.compiler.command;

                validatedCommand.code      = $.add.code;
                validatedCommand.params[1] = $.CONST(1);
                this._compiler.getOutput().add(validatedCommand);
            };
        })
    );
})();