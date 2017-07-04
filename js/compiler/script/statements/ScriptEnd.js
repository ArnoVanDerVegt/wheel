(function() {
    var wheel = require('../../../utils/base.js').wheel;

    wheel(
        'compiler.script.statements.ScriptEnd',
        wheel.Class(wheel.compiler.script.statements.Statement, function(supr) {
            this.init = function(opts) {
                this._scriptCompiler = opts.scriptCompiler;
            };

            this.compile = function(line, params, output) {
                var scriptCompiler = this._scriptCompiler;

                if (scriptCompiler._asmMode) {
                    scriptCompiler._asmMode = false;
                    return [];
                }

                var endStack = scriptCompiler.getEndStack();
                if (!endStack.length) {
                    throw new Error('End without begin.');
                }
                var end = endStack.pop();
                return scriptCompiler._statements[end] ? scriptCompiler._statements[end].compileEnd(output) : [];
            };
        })
    );
})();
