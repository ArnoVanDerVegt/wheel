(function() {
    var wheel = require('../../utils/base.js').wheel;
    var $;

    wheel(
        'compiler.commands.Ret',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            this.compile = function(validatedCommand) {
                $ = wheel.compiler.command;

                var compilerOutput = this._compiler.getOutput();

                compilerOutput.a($.set.code, [$.DEST(),  {type: $.T_NUM_L, value: 1}]);
                compilerOutput.a($.set.code, [$.STACK(), {type: $.T_NUM_L, value: 0}]);
                compilerOutput.a($.set.code, [$.CODE(),  $.DEST()]);
            };
        })
    );
})();