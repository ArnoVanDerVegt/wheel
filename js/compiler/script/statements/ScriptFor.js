(function() {
    var wheel         = require('../../../utils/base.js').wheel;
    var forLabelIndex = 10000;

    wheel(
        'compiler.script.statements.ScriptFor',
        wheel.Class(wheel.compiler.script.statements.Statement, function(supr) {
            this.compile = function(line, params, output) {
                var scriptCompiler = this._scriptCompiler.throwErrorIfAsmMode();
                var direction      = 'downto';
                var j              = params.indexOf(direction);

                if (j === -1) {
                    direction = 'to';
                    j         = params.indexOf(direction);
                    if (j === -1) {
                        // throw error...
                    }
                }

                var end   = params.substr(j + direction.length - params.length);
                var start = params.substr(0, j).split('=');
                var vr    = start[0].trim();
                var label = '_____' + direction + '_label' + (forLabelIndex++);

                this._stack.push({
                    direction: direction,
                    label:     label,
                    end:       end,
                    vr:        vr,
                    breaks:    []
                });
                scriptCompiler.getEndStack().push('for');

                return [
                    'set ' + vr + ',' + start[1].trim(),
                    label + ':'
                ];
            };

            this.compileEnd = function(output) {
                var forItem = this._stack.pop();
                var loop = {
                        to:     {operator: 'inc', condition: 'jle'},
                        downto: {operator: 'dec', condition: 'jge'}
                    }[forItem.direction];

                return [
                    loop.operator  + ' ' + forItem.vr,
                    'cmp '               + forItem.vr + ',' + forItem.end,
                    loop.condition + ' ' + forItem.label,
                    wheel.compiler.helpers.scriptHelper.addBreaks(output, forItem, this._scriptCompiler.getStatement('break').getBreakLabelIndex()) + ':'
                ];
            };
        })
    );
})();
