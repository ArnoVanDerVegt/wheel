(function() {
    var wheel            = require('../../../utils/base.js').wheel;
    var selectLabelIndex = 10000;

    wheel(
        'compiler.script.statements.ScriptSelect',
        wheel.Class(wheel.compiler.script.statements.Statement, function(supr) {
            this.compile = function(line, params, output) {
                var scriptCompiler = this._scriptCompiler.throwErrorIfAsmMode();

                this._stack.push({
                    label:        '_____select' + (selectLabelIndex++),
                    caseIndex:    0,
                    vr:           params.trim(),
                    outputOffset: null
                });
                scriptCompiler.getEndStack().push('select');

                return [];
            };

            this.compileEnd = function(output) {
                var result     = [];
                var selectItem = this._stack.pop();
                var label      = selectItem.label + '_' + selectItem.caseIndex;

                result.push(label + ':');
                output[selectItem.outputOffset] += label;

                return result;
            };
        })
    );
})();
