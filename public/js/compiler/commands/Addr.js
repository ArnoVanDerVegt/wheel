/**
 * Compile an array read command.
 *
 *         arrayr value, array, index
 *
 * Read an array value from a given index.
 *
**/
(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.commands.Addr',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            this.compile = function(validatedCommand) {
                var compilerData     = this._compilerData;
                var compilerOutput   = this._compiler.getOutput();
                var param            = validatedCommand.params[0];

                compilerOutput.add({
                    command: 'set',
                    code:    wheel.compiler.command.set.code,
                    params: [
                        {type: wheel.compiler.command.T_NUMBER_GLOBAL,   value: wheel.compiler.command.REG_OFFSET_SRC},
                        {type: wheel.compiler.command.T_NUMBER_CONSTANT, value: param.value}
                    ]
                });
                if (wheel.compiler.command.typeToLocation(param.type) === 'local') {
                    compilerOutput.add({
                        command: 'add',
                        code:    wheel.compiler.command.add.code,
                        params: [
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_SRC},
                            {type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_OFFSET_STACK}
                        ]
                    });
                }
            };
        })
    );
})();