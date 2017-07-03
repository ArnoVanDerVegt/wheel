(function() {
    var wheel           = require('../../utils/base.js').wheel;
    var breakLabelIndex = 10000;

    wheel(
        'compiler.script.BasicScriptCompiler',
        wheel.Class(function() {
            this.init = function(opts) {
                this._asmMode                   = false;
                this._forStack                  = [];
                this._repeatStack               = [];
                this._whileStack                = [];
                this._ifStack                   = [];
                this._selectStack               = [];
                this._endStack                  = [];
                this._numericExpressionCompiler = new wheel.compiler.script.NumericExpressionCompiler({scriptCompiler: this});
            };

            this.throwErrorIfScriptMode = function() {
                if (!this._asmMode) {
                    throw new Error('#' + wheel.compiler.error.INVALID_SCRIPT_COMMAND + ' Invalid script command.');
                }
            };

            this.throwErrorIfAsmMode = function() {
                if (this._asmMode) {
                    throw new Error('#' + wheel.compiler.error.INVALID_ASM_COMMAND + ' Invalid asm command.');
                }
            };

            this.updateLabelOffsets = function(labels, outputOffset) {
                for (var i = 0; i < labels.length; i++) {
                    labels[i].offset += outputOffset;
                }
            };

            this.compileAsm = function() {
                this._asmMode = true;
                return [];
            };

            this.compileEnd = function(output) {
                if (this._asmMode) {
                    this._asmMode = false;
                    return [];
                }

                if (!this._endStack.length) {
                    throw new Error('End without begin.');
                }
                var end       = this._endStack.pop();
                var addBreaks = function(loopItem) {
                        var label = '_____break' + (breakLabelIndex++);
                        loopItem.breaks.forEach(function(item) {
                            output[item] = 'jmp ' + label;
                        });
                        return label;
                    };

                switch (end) {
                    case 'if':
                        var ifItem = this._ifStack.pop();
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

                    case 'while':
                        var whileItem      = this._whileStack.pop();
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
                            addBreaks(whileItem) + ':'
                        ];

                    case 'select':
                        var selectItem = this._selectStack.pop();
                        var result     = [];
                        var label      = selectItem.label + '_' + selectItem.caseIndex;
                        result.push(label + ':');
                        output[selectItem.outputOffset] += label;
                        return result;

                    case 'for':
                        var forItem = this._forStack.pop();
                        var loop = {
                                to:     {operator: 'inc', condition: 'jle'},
                                downto: {operator: 'dec', condition: 'jge'}
                            }[forItem.direction];

                        return [
                            loop.operator  + ' ' + forItem.vr,
                            'cmp '               + forItem.vr + ',' + forItem.end,
                            loop.condition + ' ' + forItem.label,
                            addBreaks(forItem) + ':'
                        ];

                    case 'repeat':
                        var repeatItem = this._repeatStack.pop();
                        return [
                            'jmp ' + repeatItem.label,
                            addBreaks(repeatItem) + ':'
                        ];

                    case 'record':
                        return ['endr'];

                    case 'proc':
                        return ['endp'];
                }
            };

            this.compileOperator = function(line, operator) {
                this.throwErrorIfAsmMode();

                var result                    = [];
                var numericExpressionCompiler = this._numericExpressionCompiler;
                var parts                     = line.split(operator.operator);
                var vr                        = parts[0].trim();
                var value                     = parts[1].trim();
                var valueCalculation          = numericExpressionCompiler.isCalculation(value);
                var tempVar;

                var addOffsetToDest = function(value) {
                        if (value.substr(0, 1) === '&') {
                            result.push('        %if_global ' + value);
                            result.push('            set REG_DEST,%offset(' + value + ')');
                            result.push('        %else');
                            result.push('            set REG_DEST,REG_STACK');
                            result.push('            add REG_DEST,%offset(' + value + ')');
                            result.push('        %end');
                        } else {
                            result.push('    set REG_DEST,' + value);
                        }
                    };

                if (numericExpressionCompiler.isComposite(vr)) {
                    var recordVar = numericExpressionCompiler.compileCompositeVar(result, vr, 0, true);
                    if (valueCalculation) {
                        tempVar = numericExpressionCompiler.compileToTempVar(result, valueCalculation);
                        result.push('set REG_DEST,' + tempVar + '_1');
                    } else if (numericExpressionCompiler.isComposite(value)) {
                        var tempRecordVar = numericExpressionCompiler.compileCompositeVar(result, value);
                        tempVar = tempRecordVar.result;

                        result.push('set REG_SRC,REG_STACK');
                        result.push('set REG_STACK,' + tempVar);
                        result.push('set REG_DEST,%REG_STACK');
                        result.push('set REG_STACK,REG_SRC');
                    } else {
                        result.push('%if_pointer ' + vr);
                        addOffsetToDest(value);
                        result.push('%else');
                        result.push('    %if_record ' + vr);
                        result.push('        %if_global ' + vr);
                        result.push('            set REG_DEST,%offset(' + vr + ')');
                        result.push('        %else');
                        result.push('            set REG_DEST,REG_STACK');
                        result.push('            add REG_DEST,%offset(' + vr + ')');
                        result.push('        %end');
                        result.push('    %else');
                        addOffsetToDest(value);
                        result.push('    %end');
                        result.push('%end');
                    }

                    result.push('%if_pointer ' + vr);
                    result.push('    %rem operator ' + operator.command); // Rem test, should be ignored...
                    result.push('    set REG_SRC,REG_STACK');
                    result.push('    set REG_STACK,' + recordVar.result);
                    result.push('    ' + operator.command + ' %REG_STACK,REG_DEST');
                    result.push('    set REG_STACK,REG_SRC');
                    result.push('%else');
                    result.push('    %if_record ' + vr);
                    result.push('        set REG_SRC,' + recordVar.result);
                    result.push('        copy %sizeof(' + vr + ')');
                    result.push('    %else');
                    result.push('        set REG_SRC,REG_STACK');
                    result.push('        set REG_STACK,' + recordVar.result);
                    result.push('        ' + operator.command + ' %REG_STACK,REG_DEST');
                    result.push('        set REG_STACK,REG_SRC');
                    result.push('    %end');
                    result.push('%end');
                } else if (valueCalculation) {
                    tempVar = numericExpressionCompiler.compileToTempVar(result, valueCalculation);
                    result.push('set ' + vr + ',' + tempVar + '_1');
                } else if (numericExpressionCompiler.isComposite(value)) {
                    var recordVar = numericExpressionCompiler.compileCompositeVar(result, value);
                    var tempVar = recordVar.result;
                    result.push('set REG_SRC,REG_STACK');
                    result.push('set REG_STACK,' + tempVar);
                    result.push('set REG_DEST,%REG_STACK');
                    result.push('set REG_STACK,REG_SRC');
                    result.push('set ' + tempVar + ',REG_DEST');
                    result.push('set ' + vr + ',' + tempVar);
                } else {
                    vr = vr.trim();
                    result.push('%if_pointer ' + vr);

                    if (value.substr(0, 1) === '&') {
                        result.push('    %if_global ' + value);
                        result.push('        set REG_DEST,%offset(' + value + ')');
                        result.push('    %else');
                        result.push('        set REG_DEST,REG_STACK');
                        result.push('        add REG_DEST,%offset(' + value + ')');
                        result.push('    %end');
                        result.push('    ' + operator.command + ' ' + vr + ',REG_DEST');
                    } else {
                        result.push('    set REG_SRC,REG_STACK');
                        result.push('    set REG_STACK,' + vr);
                        result.push('    ' + operator.command + ' %REG_STACK,' + value);
                        result.push('    set REG_STACK,REG_SRC');
                    }

                    result.push('%else');
                    result.push('    %if_pointer ' + value);
                    result.push('        set REG_SRC,REG_STACK');
                    result.push('        set REG_STACK,' + value);
                    result.push('        set REG_DEST,%REG_STACK');
                    result.push('        set REG_STACK,REG_SRC');
                    result.push('        ' + operator.command + ' ' + vr + ',REG_DEST');
                    result.push('    %else');
                    result.push('        %if_record ' + vr);
                    result.push('            %if_global ' + vr);
                    result.push('                set REG_DEST,%offset(' + vr + ')');
                    result.push('            %else');
                    result.push('                set REG_DEST,REG_STACK');
                    result.push('                add REG_DEST,%offset(' + vr + ')');
                    result.push('            %end');
                    result.push('            %if_global ' + value);
                    result.push('                set REG_SRC,%offset(' + value + ')');
                    result.push('            %else');
                    result.push('                set REG_SRC,REG_STACK');
                    result.push('                add REG_SRC,%offset(' + value + ')');
                    result.push('            %end');
                    result.push('            copy %sizeof(' + vr + ')');
                    result.push('        %else');
                    result.push('        ' + operator.command + ' ' + vr + ',' + value);
                    result.push('        %end');
                    result.push('    %end');
                    result.push('%end');
                }

                return result;
            };
        })
    );
})();