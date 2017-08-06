(function() {
    var wheel           = require('../../../utils/base.js').wheel;
    var whileLabelIndex = 10000;

    wheel(
        'compiler.script.statements.ScriptWhile',
        wheel.Class(wheel.compiler.script.statements.Statement, function(supr) {
            this.compile = function(line, params, output) {
                var result                    = [];
                var scriptCompiler            = this._scriptCompiler.throwErrorIfAsmMode();
                var whileLabel                = '_____while_label' + (whileLabelIndex++);
                var labels                    = [];
                var outputOffset              = output.length;
                var booleanExpressionCompiler = new wheel.compiler.script.BooleanExpressionCompiler({
                        scriptCompiler: scriptCompiler,
                        label:          whileLabel
                    });

                result.push(whileLabel + ':');

                booleanExpressionCompiler.compile(params, result, whileLabel, labels);

                var whileItem = {
                       label:  whileLabel,
                       labels: labels,
                       breaks: []
                   };

                this._stack.push(whileItem);
                scriptCompiler.getEndStack().push('while');
                wheel.compiler.helpers.scriptHelper.updateLabelOffsets(labels, outputOffset);

                result.push(whileLabel + '_true:');

                return result;
            };

            this.compileEnd = function(output) {
                var whileItem      = this._stack.pop();
                var whileExitLabel = whileItem.label + '_exit';
                whileItem.labels.forEach(function(whileLabel) {
                    switch (whileLabel.type) {
                        case 'exit':
                            output[whileLabel.offset] += whileExitLabel;
                            break;
                    }
                });
                return [
                    'jmp ' + whileItem.label,
                    whileExitLabel + ':',
                    wheel.compiler.helpers.scriptHelper.addBreaks(output, whileItem, this._scriptCompiler.getStatement('break').getBreakLabelIndex()) + ':'
                ];
            };
        })
    );
})();
