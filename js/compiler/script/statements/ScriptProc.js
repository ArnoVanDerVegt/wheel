(function() {
    var wheel = require('../../../utils/base.js').wheel;

    wheel(
        'compiler.script.statements.ScriptProc',
        wheel.Class(wheel.compiler.script.statements.Statement, function(supr) {
            this.compile = function(line, params, output) {
                this._scriptCompiler.getEndStack().push('proc');
                return [line];
            };

            this.compileEnd = function(output) {
                return ['endp'];
            };
        })
    );
})();
