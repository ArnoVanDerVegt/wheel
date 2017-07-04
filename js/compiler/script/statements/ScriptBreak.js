(function() {
    var wheel           = require('../../../utils/base.js').wheel;
    var breakLabelIndex = 10000;

    wheel(
        'compiler.script.statements.ScriptBreak',
        wheel.Class(wheel.compiler.script.statements.Statement, function(supr) {
            this.getBreakLabelIndex = function() {
                return breakLabelIndex++;
            };

            this.compile = function(line, params, output) {
                var outputOffset   = output.length;
                var scriptCompiler = this._scriptCompiler.throwErrorIfAsmMode();
                var endStack       = scriptCompiler.getEndStack();
                var loopItem       = null;

                if (endStack.length) {
                    var loopList = null;
                    var found    = false;
                    var index    = endStack.length;
                    while (!found && (index > 0)) {
                        var type = endStack[--index];
                        switch (type) {
                            case 'for':
                                loopList = scriptCompiler.getStatement('for').setScriptBreak(this).getStack();
                                found    = true;
                                break;

                            case 'repeat':
                                loopList = scriptCompiler.getStatement('repeat').setScriptBreak(this).getStack();
                                found    = true;
                                break;

                            case 'while':
                                loopList = scriptCompiler.getStatement('while').setScriptBreak(this).getStack();
                                found    = true;
                                break;
                        }
                    }

                    if (loopList && loopList.length) {
                        loopItem = loopList[loopList.length - 1];
                    }
                }
                if (loopItem === null) {
                    throw new Error('#' + wheel.compiler.error.BREAK_WITHOUT_LOOP + ' Break without loop.');
                }
                loopItem.breaks.push(outputOffset);

                return [
                    'jmp'
                ];
            };
        })
    );
})();
