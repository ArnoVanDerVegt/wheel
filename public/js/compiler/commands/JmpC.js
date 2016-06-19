wheel(
    'compiler.commands.JmpC',
    Class(wheel.compiler.commands.CommandCompiler, function(supr) {
        this.compile = function(validatedCommand) {
            var compilerData = this._compilerData;
            var command      = validatedCommand.command;
            var flag         = 0;

            switch (command) {
                case 'je':  flag = wheel.compiler.command.FLAG_EQUAL;         break;
                case 'jne': flag = wheel.compiler.command.FLAG_NOT_EQUAL;     break;
                case 'jl':  flag = wheel.compiler.command.FLAG_LESS;          break;
                case 'jle': flag = wheel.compiler.command.FLAG_LESS_EQUAL;    break;
                case 'jg':  flag = wheel.compiler.command.FLAG_GREATER;       break;
                case 'jge': flag = wheel.compiler.command.FLAG_GREATER_EQUAL; break;
            }

            validatedCommand.command = 'jmpc';
            validatedCommand.code    = wheel.compiler.command.jmpc.code;
            validatedCommand.params.push({
                type:  wheel.compiler.command.T_NUMBER_CONSTANT,
                value: flag
            });
            this._compiler.getOutput().add(validatedCommand);
        };
    })
);