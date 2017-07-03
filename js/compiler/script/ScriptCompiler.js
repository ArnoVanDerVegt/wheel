(function() {
    var wheel            = require('../../utils/base.js').wheel;
    var forLabelIndex    = 10000;
    var repeatLabelIndex = 10000;
    var whileLabelIndex  = 10000;
    var ifLabelIndex     = 10000;
    var selectLabelIndex = 10000;

    wheel(
        'compiler.script.ScriptCompiler',
        wheel.Class(wheel.compiler.script.BasicScriptCompiler, function(supr) {
            this.compileProc = function(line) {
                this._endStack.push('proc');
                return [line];
            };

            this.compileEndProc = function(line) {
                this._endStack.pop();
                return [line];
            };

            this.compileRecord = function(line) {
                this._endStack.push('record');
                return [line];
            };

            this.compileEndRecord = function(line) {
                this._endStack.pop();
                return [line];
            };

            this.compileFor = function(s) {
                this.throwErrorIfAsmMode();

                var direction = 'downto';
                var j         = s.indexOf(direction);

                if (j === -1) {
                    direction = 'to';
                    j         = s.indexOf(direction);
                    if (j === -1) {
                        // throw error...
                    }
                }

                var end   = s.substr(j + direction.length - s.length);
                var start = s.substr(0, j).split('=');
                var vr    = start[0].trim();
                var label = '_____' + direction + '_label' + (forLabelIndex++);

                this._forStack.push({
                    direction: direction,
                    label:     label,
                    end:       end,
                    vr:        vr,
                    breaks:    []
                });
                this._endStack.push('for');

                return [
                    'set ' + vr + ',' + start[1].trim(),
                    label + ':'
                ];
            };

            this.compileRepeat = function(s) {
                this.throwErrorIfAsmMode();

                var label = '_____repeat_label' + (repeatLabelIndex++);

                this._repeatStack.push({
                    label:  label,
                    breaks: []
                });
                this._endStack.push('repeat');

                return [
                    label + ':'
                ];
            };

            this.compileWhile = function(s, output) {
                this.throwErrorIfAsmMode();

                var result                    = [];
                var whileLabel                = '_____while_label' + (whileLabelIndex++);
                var labels                    = [];
                var outputOffset              = output.length;
                var booleanExpressionCompiler = new wheel.compiler.script.BooleanExpressionCompiler({
                        scriptCompiler: this,
                        label:          whileLabel
                    });

                result.push(whileLabel + ':');

                booleanExpressionCompiler.compile(s, result, whileLabel, labels);

                var whileItem = {
                       label:  whileLabel,
                       labels: labels,
                       breaks: []
                   };

                this._whileStack.push(whileItem);
                this._endStack.push('while');
                this.updateLabelOffsets(labels, outputOffset);

                result.push(whileLabel + '_true:');

                return result;
            };

            this.compileBreak = function(s, outputOffset) {
                this.throwErrorIfAsmMode();

                var endStack = this._endStack;
                var loopItem = null;
                if (endStack.length) {
                    var loopList = null;
                    var found    = false;
                    var index    = endStack.length;
                    while (!found && (index > 0)) {
                        var type = endStack[--index];
                        switch (type) {
                            case 'for':
                                loopList = this._forStack;
                                found    = true;
                                break;

                            case 'repeat':
                                loopList = this._repeatStack;
                                found    = true;
                                break;

                            case 'while':
                                loopList = this._whileStack;
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

            this.compileIf = function(s, output) {
                this.throwErrorIfAsmMode();

                var result                    = [];
                var ifLabel                   = '_____if_label' + (ifLabelIndex++);
                var labels                    = [];
                var outputOffset              = output.length;
                var booleanExpressionCompiler = new wheel.compiler.script.BooleanExpressionCompiler({
                        scriptCompiler: this,
                        label:          ifLabel
                    });

                booleanExpressionCompiler.compile(s, result, ifLabel, labels);

                var ifItem = {
                       label:  ifLabel,
                       labels: labels
                   };

                this._ifStack.push(ifItem);
                this._endStack.push('if');
                this.updateLabelOffsets(labels, outputOffset);

                result.push(ifLabel + '_true:');

                return result;
            };

            this.compileElse = function(output) {
                this.throwErrorIfAsmMode();

                var ifItem = this._ifStack[this._ifStack.length - 1];
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

            this.compileSelect = function(s) {
                this.throwErrorIfAsmMode();

                this._selectStack.push({
                    label:        '_____select' + (selectLabelIndex++),
                    caseIndex:    0,
                    vr:           s.trim(),
                    outputOffset: null
                });
                this._endStack.push('select');

                return [];
            };

            this.compileCase = function(s, output) {
                this.throwErrorIfAsmMode();

                s = s.trim();
                s = s.substr(0, s.length - 1); // remove ":"

                var result = [];

                var selectItem   = this._selectStack[this._selectStack.length - 1];
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
                    'cmp ' + selectItem.vr + ',' + s,
                    'jne '
                );

                return result;
            };

            this.compileProcCall = function(line, procCall) {
                var numericExpressionCompiler = this._numericExpressionCompiler;
                var hasExpression             = false;
                var params                    = procCall.params;
                var param                     = '';
                var p                         = [];
                var i                         = 0;

                function addParam(value) {
                    var calculation = false;
                    var arrayIndex  = false;
                    var composite   = false;

                    if (!((value.substr(0, 1) === '[') && (value.substr(-1) === ']'))) {
                        calculation   = numericExpressionCompiler.isCalculation(value);
                        arrayIndex    = numericExpressionCompiler.isArrayIndex(value);
                        composite     = numericExpressionCompiler.isComposite(value);
                    }
                    hasExpression = hasExpression || !!calculation || !!arrayIndex || composite;

                    p.push({
                        value:       value.trim(),
                        calculation: calculation,
                        arrayIndex:  arrayIndex,
                        composite:   composite
                    });
                }

                var expectParam = false;
                while (i < params.length) {
                    var c = params[i++];
                    switch (c) {
                        case '[':
                        case '(':
                            var openC  = c;
                            var closeC = {'[': ']', '(': ')'}[c];
                            var count  = 1;
                            param += c;
                            while ((count > 0) && (i < params.length)) {
                                c = params[i++];
                                param += c;
                                if (c === openC) {
                                    count++;
                                } else if (c === closeC) {
                                    count--;
                                }
                            }
                            break;

                        case ',':
                            addParam(param.trim());
                            expectParam = true;
                            param       = '';
                            break;

                        default:
                            param += c;
                            break;
                    }
                }

                param = param.trim();
                if (param === '') {
                    if (expectParam) {
                        // todo: add location information...
                        throw new Error('#' + wheel.compiler.error.SYNTAX_ERROR_PARAM_EXPECTED + ' Syntax error parameter expected.');
                    }
                } else {
                    addParam(param);
                }

                //if (!hasExpression) {
                //    return [line];
                //}

                var result       = [];
                var outputParams = [];
                var tempVar;
                for (var i = 0; i < p.length; i++) {
                    param = p[i];
                    if (param.calculation) {
                        outputParams.push(numericExpressionCompiler.compileToTempVar(result, param.calculation) + '_1');
                    } else if (param.composite || param.arrayIndex) {
                        var recordVar = numericExpressionCompiler.compileCompositeVar(result, param.value);
                        tempVar = recordVar.result;
                        this.compilePointerDeref(result, tempVar);
                        result.push('set ' + tempVar + ',REG_DEST');
                        outputParams.push(tempVar);
                    } else {
                        /*var tempParamVar = numericExpressionCompiler.createTempVarName();
                        result.push('number ' + tempParamVar);
                        result.push('%if_pointer ' + param.value);
                        result.push('    set  REG_SRC, REG_STACK');
                        result.push('    set  REG_STACK,' + param.value);
                        result.push('    set  REG_DEST, %REG_STACK');
                        result.push('    set  REG_STACK,REG_SRC');
                        result.push('    set  ' + tempParamVar + ',REG_DEST');
                        result.push('%else');
                        result.push('    %if_record ' + param.value);
                        result.push('        number ' + tempParamVar);
                        result.push('    %else');
                        result.push('        set  ' + tempParamVar + ',' + param.value);
                        result.push('    %end');
                        result.push('%end');*/
                        outputParams.push(param.value);
                    }
                }
                result.push(procCall.name + '(' + outputParams.join(',') + ')');

                return result;
            };

            this.compileLineBasic = function(line, output) {
                var result  = [line];
                var command = line.trim();
                var i       = line.indexOf(' ');
                (i === -1) || (command = line.substr(0, i).trim());

                switch (command) {
                    case 'asm':
                        return this.compileAsm();

                    case 'proc':
                        return this.compileProc(line);

                    case 'endp':
                        return this.compileEndProc(line);

                    case 'record':
                        return this.compileRecord(line);

                    case 'endr':
                        return this.compileEndRecord(line);

                    case 'for':
                        return this.compileFor(line.substr(i - line.length));

                    case 'repeat':
                        return this.compileRepeat(line);

                    case 'while':
                        return this.compileWhile(line.substr(i - line.length), output);

                    case 'break':
                        return this.compileBreak(line, output.length);

                    case 'if':
                        return this.compileIf(line.substr(i - line.length), output);

                    case 'else':
                        return this.compileElse(output);

                    case 'select':
                        return this.compileSelect(line.substr(i - line.length));

                    case 'case':
                        return this.compileCase(line.substr(i - line.length), output);

                    case 'end':
                        return this.compileEnd(output);

                    default:
                        if (!this.checkAsmCommand(command)) {
                            var procCall = this._numericExpressionCompiler.isProcCall(line);
                            if (procCall) {
                                return this.compileProcCall(line, procCall);
                            } else {
                                var operator = this._numericExpressionCompiler.hasOperator(line);
                                if (operator) {
                                    return this.compileOperator(line, operator);
                                }
                            }
                        }
                        break;
                }

                return result;
            };

            this.compile = function(filename, lines) {
                var output    = [];
                var sourceMap = [];

                this._forStack.length    = 0;
                this._ifStack.length     = 0;
                this._selectStack.length = 0;
                this._endStack.length    = 0;

                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i].trim();
                    if (line === '') {
                        continue;
                    }

                    var location = {
                            filename:   filename,
                            lineNumber: i
                        };

                    var codeLines = this.compileLineBasic(line, output);
                    for (var j = 0; j < codeLines.length; j++) {
                        output.push(codeLines[j]);
                        sourceMap.push(location);
                    }
                }

                // for (var i = 129; i < output.length; i++) {
                //     console.log(i + ']', output[i]);
                // }
                return {
                    output:    output,
                    sourceMap: sourceMap
                };
            };
        })
    );
})();