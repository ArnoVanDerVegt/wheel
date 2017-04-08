(function() {
    var wheel = require('../../utils/base.js').wheel;
    var $;

    wheel(
        'compiler.commands.CallReturn',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            this.init = function() {
                supr(this, 'init', arguments);

                this._setCompiler = null;
                this._retCompiler = null;
            };

            this.setSetCompiler = function(setCompiler) {
                this._setCompiler = setCompiler;
            };

            this.setRetCompiler = function(retCompiler) {
                this._retCompiler = retCompiler;
            };

            this.compile = function(validatedCommand, splitParams, params, location) {
                $ = wheel.compiler.command;

                validatedCommand.code = $.set.code;
                validatedCommand.params.unshift($.RETURN());

                this._setCompiler.compile(validatedCommand);
                this._retCompiler.compile(null);
            };
        })
    );
})();