wheel(
    'compiler.commands.JmpC',
    Class(wheel.compiler.commands.CommandCompiler, function(supr) {
        this.compile = function(validatedCommand) {
            var compilerData = this._compilerData;
            var command      = validatedCommand.command;

            validatedCommand.command = 'jmpc';
            validatedCommand.code    = wheel.compiler.command.jmpc.code;
            validatedCommand.params.push({
                type:  wheel.compiler.command.T_NUMBER_REGISTER,
                value: compilerData.findRegister('REG_' + command.substr(1 - command.length).toUpperCase()).index
            });
            this._compiler.getOutput().add(validatedCommand);
        };
    })
);