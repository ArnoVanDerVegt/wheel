(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.commands.JmpC',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            this.compile = function(compilerOutput, validatedCommand, splitParams, params) {
                var $    = wheel.compiler.command;
                var flag = 0;

                switch (validatedCommand.command) {
                    case 'je':  flag = $.FLAG_EQUAL;         break;
                    case 'jne': flag = $.FLAG_NOT_EQUAL;     break;
                    case 'jl':  flag = $.FLAG_LESS;          break;
                    case 'jle': flag = $.FLAG_LESS_EQUAL;    break;
                    case 'jg':  flag = $.FLAG_GREATER;       break;
                    case 'jge': flag = $.FLAG_GREATER_EQUAL; break;
                }

                validatedCommand.code      = $.jmpc.code;
                validatedCommand.params[1] = $.CONST(flag);
                compilerOutput.add(validatedCommand);
            };
        })
    );
})();