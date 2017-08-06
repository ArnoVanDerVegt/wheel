(function() {
    var wheel = require('../../../utils/base.js').wheel;

    wheel(
        'compiler.script.statements.ScriptRecord',
        wheel.Class(wheel.compiler.script.statements.Statement, function(supr) {
            this.compile = function(line, params, output) {
                this._scriptCompiler.getEndStack().push('record');
                return [line];
            };

            this.compileEnd = function(output) {
                return ['endr'];
            };
        })
    );
})();
