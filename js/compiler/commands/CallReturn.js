(function() {
    var wheel = require('../../utils/base.js').wheel;

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

            this.compile = function(compilerOutput, validatedCommand, splitParams, params) {
                var $ = wheel.compiler.command;

                validatedCommand.code = $.set.code;
                validatedCommand.params.unshift($.RETURN());

                var compilerOutput = this._compiler.getOutput();
                this._setCompiler.compile(compilerOutput, validatedCommand);
                this._retCompiler.compile(compilerOutput, null);
            };
        })
    );
})();