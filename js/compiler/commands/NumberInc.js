(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.commands.NumberInc',
        wheel.Class(wheel.compiler.commands.NumberChange, function(supr) {
            this.compile = function(validatedCommand, splitParams, params, location) {
                supr(this, 'compile', [validatedCommand, splitParams, params, location, wheel.compiler.command.add.code]);
            };
        })
    );
})();