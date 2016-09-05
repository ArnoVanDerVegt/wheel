(function() {
    var wheel = require('../../utils/base.js');

    wheel(
        'compiler.commands.Ret',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            this.compile = function(validatedCommand) {
                var compilerOutput = this._compiler.getOutput();

                compilerOutput.add({
                    command: 'set',
                    code:    wheel.compiler.command.set.code,
                    params: [
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_DEST},
                        {type: wheel.compiler.command.T_NUMBER_LOCAL,  value: 1}
                    ]
                });
                compilerOutput.add({
                    command: 'set',
                    code:    wheel.compiler.command.set.code,
                    params: [
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK},
                        {type: wheel.compiler.command.T_NUMBER_LOCAL,  value: 0}
                    ]
                });
                compilerOutput.add({
                    command: 'set',
                    code:    wheel.compiler.command.set.code,
                    params: [
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_CODE},
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_DEST}
                    ]
                });
            };
        })
    );
})();