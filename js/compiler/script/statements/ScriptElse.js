(function() {
    var wheel = require('../../../utils/base.js').wheel;

    wheel(
        'compiler.script.statements.ScriptElse',
        wheel.Class(wheel.compiler.script.statements.Statement, function(supr) {
            this.compile = function(line, params, output) {
                var scriptCompiler = this._scriptCompiler.throwErrorIfAsmMode();
                var stack          = scriptCompiler.getStatement('if').getStack();
                var ifItem         = stack[stack.length - 1];
                var label          = ifItem.label;

                ifItem.labels.forEach(function(ifLabel) {
                    ifLabel.type = 'else';
                });
                ifItem.labels.push({offset: output.length, type: 'exit'});

                return [
                    'jmp ',
                    label + '_else:'
                ];
            };
        })
    );
})();
