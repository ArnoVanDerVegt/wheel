(function() {
    var wheel = require('../../../utils/base.js').wheel;

    wheel(
        'compiler.script.statements.ScriptCase',
        wheel.Class(wheel.compiler.script.statements.Statement, function(supr) {
            this.compile = function(line, params, output) {
                params = params.trim();
                params = params.substr(0, params.length - 1); // remove ":"

                var result       = [];
                var selectStack  = this._scriptCompiler.getStatement('select').getStack();
                var selectItem   = selectStack[selectStack.length - 1];
                var outputOffset = output.length + 1;

                if (selectItem.outputOffset !== null) {
                    var label = selectItem.label + '_' + selectItem.caseIndex;
                    selectItem.caseIndex++;
                    result.push(label + ':');
                    output[selectItem.outputOffset] += label;
                    outputOffset++;
                }

                selectItem.outputOffset = outputOffset;

                result.push(
                    'cmp ' + selectItem.vr + ',' + params,
                    'jne '
                );

                return result;
            };
        })
    );
})();
