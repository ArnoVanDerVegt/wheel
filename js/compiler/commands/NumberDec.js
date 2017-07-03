(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.commands.NumberDec',
        wheel.Class(wheel.compiler.commands.NumberChange, function(supr) {
            this.compile = function(validatedCommand, splitParams, params) {
                supr(this, 'compile', [validatedCommand, splitParams, params, wheel.compiler.command.sub.code]);
            };
        })
    );
})();