(function() {
    var wheel = require('../../../utils/base.js').wheel;

    wheel(
        'compiler.script.statements.ScriptAsm',
        wheel.Class(wheel.compiler.script.statements.Statement, function(supr) {
            this.init = function(opts) {
                this._scriptCompiler = opts.scriptCompiler;
            };

            this.compile = function() {
                this._scriptCompiler._asmMode = true;
                return [];
            };
        })
    );
})();
