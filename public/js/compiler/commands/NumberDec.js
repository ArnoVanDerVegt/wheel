(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.commands.NumberDec',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            this.compile = function(validatedCommand) {
                validatedCommand.command = 'sub';
                validatedCommand.code    = wheel.compiler.command.add.code;
                validatedCommand.params.push({
                    type:  wheel.compiler.command.T_NUM_C,
                    value: 1
                });
                this._compiler.getOutput().add(validatedCommand);
            };
        })
    );
})();