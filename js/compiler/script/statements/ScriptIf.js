(function() {
    var wheel        = require('../../../utils/base.js').wheel;
    var ifLabelIndex = 10000;

    wheel(
        'compiler.script.statements.ScriptIf',
        wheel.Class(wheel.compiler.script.statements.Statement, function(supr) {
            this.compile = function(line, params, output) {
                var result                    = [];
                var scriptCompiler            = this._scriptCompiler.throwErrorIfAsmMode();
                var ifLabel                   = '_____if_label' + (ifLabelIndex++);
                var labels                    = [];
                var outputOffset              = output.length;
                var booleanExpressionCompiler = new wheel.compiler.script.BooleanExpressionCompiler({
                        scriptCompiler: scriptCompiler,
                        label:          ifLabel
                    });

                booleanExpressionCompiler.compile(params, result, ifLabel, labels);

                var ifItem = {
                       label:  ifLabel,
                       labels: labels
                   };

                this._stack.push(ifItem);
                scriptCompiler.getEndStack().push('if');
                wheel.compiler.helpers.scriptHelper.updateLabelOffsets(labels, outputOffset);

                result.push(ifLabel + '_true:');

                return result;
            };

            this.compileEnd = function(output) {
                var ifItem = this._stack.pop();
                ifItem.labels.forEach(function(ifLabel) {
                    switch (ifLabel.type) {
                        case 'exit':
                            output[ifLabel.offset] += ifItem.label;
                            break;

                        case 'else':
                            output[ifLabel.offset] += ifItem.label + '_else';
                            break;
                    }
                });
                return [ifItem.label + ':'];
            };
        })
    );
})();
