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

            this.compile = function(command) {
                $ = wheel.compiler.command;

                command.code = $.set.code;
                command.params.unshift($.RETURN());

                this._setCompiler.compile(command);
                this._retCompiler.compile(null);
            };
        })
    );
})();