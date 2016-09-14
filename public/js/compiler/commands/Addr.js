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
    var $;

    wheel(
        'compiler.commands.Addr',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            this.compile = function(validatedCommand) {
                $ = wheel.compiler.command;

                var compilerData   = this._compilerData;
                var compilerOutput = this._compiler.getOutput();
                var param          = validatedCommand.params[0];

                // set src, param.value
                compilerOutput.a($.set.code, $.SRC(), $.CONST(param.value));
                $.isLocal(param) && compilerOutput.a($.add.code, $.SRC(), $.STACK());
            };
        })
    );
})();