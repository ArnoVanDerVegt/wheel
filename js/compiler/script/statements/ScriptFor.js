(function() {
    var wheel         = require('../../../utils/base.js').wheel;
    var forLabelIndex = 10000;
    var tempVarIndex  = 10000;

    wheel(
        'compiler.script.statements.ScriptFor',
        wheel.Class(wheel.compiler.script.statements.Statement, function(supr) {
            this.compile = function(line, params, output) {
                var direction = 'downto';
                var j         = params.indexOf(direction);

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
                this._scriptCompiler.throwErrorIfAsmMode().getEndStack().push('for');

                var tempVar  = wheel.compiler.helpers.expressionHelper.createTempVarName();
                var operator = { command: 'set', operator: '=', pos: tempVar.length }
                var s        = tempVar + '=' + start[1].trim();
                var result   = this._scriptCompiler.compileOperator(s, operator);

                result.unshift('number ' + tempVar);
                result.push(
                    'set ' + vr + ',' + tempVar,
                    label + ':'
                );

                return result;
            };

            this.compileEnd = function(output) {
                var tempVar = wheel.compiler.helpers.expressionHelper.createTempVarName();
                var forItem = this._stack.pop();
                var loop = {
                        to:     {operator: 'inc', condition: 'jle'},
                        downto: {operator: 'dec', condition: 'jge'}
                    }[forItem.direction];

                var s        = tempVar + '=' + forItem.end;
                var operator = { command: 'set', operator: '=', pos: tempVar.length }
                var result   = this._scriptCompiler.compileOperator(s, operator);

                result.unshift('number ' + tempVar);
                result.push(
                    loop.operator  + ' ' + forItem.vr,
                    'cmp '               + forItem.vr + ',' + tempVar,
                    loop.condition + ' ' + forItem.label,
                    wheel.compiler.helpers.scriptHelper.addBreaks(output, forItem, this._scriptCompiler.getStatement('break').getBreakLabelIndex()) + ':'
                );

                return result;
            };
        })
    );
})();
