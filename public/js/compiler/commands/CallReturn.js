(function() {
    var wheel = require('../../utils/base.js');

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
                command.command = 'set';
                command.code    = wheel.compiler.command.set.code;
                command.params.unshift({type: wheel.compiler.command.T_NUMBER_GLOBAL, value: wheel.compiler.command.REG_RETURN});

                this._setCompiler.compile(command);
                this._retCompiler.compile(null);
            };
        })
    );
})();