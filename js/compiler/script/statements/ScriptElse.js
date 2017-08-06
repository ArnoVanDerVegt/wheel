(function() {
    var wheel = require('../../../utils/base.js').wheel;

    wheel(
        'compiler.script.statements.ScriptElse',
        wheel.Class(wheel.compiler.script.statements.Statement, function(supr) {
            this.compile = function(line, params, output) {
                var stack  = this._scriptCompiler.throwErrorIfAsmMode().getStatement('if').getStack();
                var ifItem = stack[stack.length - 1];
                var label  = ifItem.label;

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
