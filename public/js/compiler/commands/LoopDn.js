/**
 * Compile an array read command.
 *
 *         loopdn counter, label
 *
 * Decrease the counter value and jump while greater than 0.
 *
**/
wheel(
    'compiler.commands.LoopDn',
    Class(wheel.compiler.commands.CommandCompiler, function(supr) {
        this.compile = function(validatedCommand) {
            var compilerData   = this._compilerData;
            var compilerOutput = this._compiler.getOutput();
            var counterParam   = validatedCommand.params[0];
            var labelParam     = validatedCommand.params[1];

            labelParam.label.jumps[labelParam.label.jumps.length - 1] += 2;

            compilerOutput.add({
                command: 'sub',
                code:    wheel.compiler.command.sub.code,
                params: [
                    JSON.parse(JSON.stringify(counterParam)),
                    {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: 1}
                ]
            });
            compilerOutput.add({
                command: 'cmp',
                code:    wheel.compiler.command.sub.code,
                params: [
                    JSON.parse(JSON.stringify(counterParam)),
                    {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: 0}
                ]
            });
            compilerOutput.add({
                command: 'jmpc',
                code:    wheel.compiler.command.sub.code,
                params: [
                    labelParam,
                    {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: wheel.compiler.command.FLAG_GREATER_EQUAL}
                ]
            });
        };
    })
);