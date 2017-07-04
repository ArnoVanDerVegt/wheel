(function() {
    var wheel            = require('../../../utils/base.js').wheel;
    var repeatLabelIndex = 10000;

    wheel(
        'compiler.script.statements.ScriptRepeat',
        wheel.Class(wheel.compiler.script.statements.Statement, function(supr) {
            this.compile = function(line, params, output) {
                var label  = '_____repeat_label' + (repeatLabelIndex++);

                this._stack.push({
                    label:  label,
                    breaks: []
                });
                this._scriptCompiler.throwErrorIfAsmMode().getEndStack().push('repeat');

                return [
                    label + ':'
                ];
            };

            this.compileEnd = function(output) {
                var repeatItem = this._stack.pop();
                return [
                    'jmp ' + repeatItem.label,
                    wheel.compiler.helpers.scriptHelper.addBreaks(output, repeatItem, this._scriptCompiler.getStatement('break').getBreakLabelIndex()) + ':'
                ];
            };
        })
    );
})();
