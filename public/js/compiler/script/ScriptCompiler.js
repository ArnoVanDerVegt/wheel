(function() {
    var wheel = require('../../utils/base.js').wheel;
    var $;

    var forLabelIndex    = 10000;
    var ifLabelIndex     = 10000;
    var selectLabelIndex = 10000;

    wheel(
        'compiler.script.ScriptCompiler',
        wheel.Class(function() {
            this.init = function(opts) {
                this._forStack           = [];
                this._ifStack            = [];
                this._selectStack        = [];
                this._endStack           = [];
                this._expressionCompiler = new wheel.compiler.script.ExpressionCompiler({scriptCompiler: this});
            };

            this.compileProc = function(line) {
                this._endStack.push('proc');
                return [line];
            };

            this.compileEndProc = function(line) {
                this._endStack.pop();
                return [line];
            };

            this.compileStruct = function(line) {
                this._endStack.push('struct');
                return [line];
            };

            this.compileEndStruct = function(line) {
                this._endStack.pop();
                return [line];
            };

            this.compileFor = function(s) {
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
                    vr:        vr
                });
                this._endStack.push('for');

                return [
                    'set ' + vr + ',' + start[1].trim(),
                    label + ':'
                ];
            };

            this.compileIf = function(s, output) {
                var compare = {
                        je:  '!=',
                        jne: '==',
                        jl:  '>=',
                        jg:  '<=',
                        jle: '>',
                        jge: '<'
                    };
                var jumps   = ['je', 'jne', 'jl', 'jg', 'jle', 'jge'];

                var j;
                var jump;
                for (j = 0; j < jumps.length; j++) {
                    jump = jumps[j];
                    var k = s.indexOf(compare[jump]);
                    if (k !== -1) {
                        break;
                    }
                }
                var parts = s.split(compare[jump]);
                var start = parts[0].trim();
                var end   = parts[1].trim();

                this._ifStack.push({
                    outputOffset: output.length + 1,
                    label:        '_____if_label' + (ifLabelIndex++)
                });
                this._endStack.push('if');

                return [
                    'cmp ' + start + ',' + end,
                    jump
                ];
            };

            this.compileElse = function(output) {
                var ifItem = this._ifStack[this._ifStack.length - 1];
                var label  = ifItem.label;
                output[ifItem.outputOffset] += ' ' + label;
                ifItem.outputOffset = output.length;
                ifItem.label += '_else';

                return [
                    'jmp ',
                    label + ':'
                ];
            };

            this.compileSelect = function(s) {
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

            this.compileEnd = function(output) {
                var end = this._endStack.pop();
                switch (end) {
                    case 'if':
                        var ifItem = this._ifStack.pop();
                        output[ifItem.outputOffset] += ' ' + ifItem.label;
                        return [ifItem.label + ':'];

                    case 'select':
                        var selectItem = this._selectStack.pop();
                        var result     = [];

                        if (selectItem.outputOffset !== null) {
                            var label = selectItem.label + '_' + selectItem.caseIndex;
                            result.push(label + ':');
                            output[selectItem.outputOffset] += label;
                        }
                        return result;

                    case 'for':
                        var forItem = this._forStack.pop();
                        switch (forItem.direction) {
                            case 'to':
                                return [
                                    'inc ' + forItem.vr,
                                    'cmp ' + forItem.vr + ',' + forItem.end,
                                    'jle ' + forItem.label
                                ];

                            case 'downto':
                                return [
                                    'dec ' + forItem.vr,
                                    'cmp ' + forItem.vr + ',' + forItem.end,
                                    'jge ' + forItem.label
                                ];
                        }
                        break;

                    case 'struct':
                        return ['ends'];

                    case 'proc':
                        return ['endp'];
                }

                return [];
                // throw error!
            };

            /**
             * Compile setting an array index...
            **/
            this.compileSetIndex = function(result, vrArray, value) {
                var expressionCompiler = this._expressionCompiler;

                var calculation = expressionCompiler.isCalculation(vrArray.index);
                if (calculation) {
                    tempVar = expressionCompiler.compileToTempVar(result, calculation);
                    result.push('arrayw ' + vrArray.array + ',' + tempVar + '_1,' + value);
                } else {
                    var vrIndexArray = expressionCompiler.isArrayIndex(vrArray.index);
                    if (vrIndexArray) {
                        var tempVar = expressionCompiler.createTempVarName();
                        expressionCompiler.declareNumber(result, tempVar);

                        function compileVrArray(vrArray) {
                            var varIndexArray = expressionCompiler.isArrayIndex(vrArray.index);
                            var calculation   = expressionCompiler.isCalculation(vrArray.index);
                            if (calculation) {
                                var tempIndexVar = expressionCompiler.compileToTempVar(result, calculation);
                                result.push('arrayr ' + tempVar + ',' + vrArray.array + ',' + tempIndexVar + '_1');
                            } else if (varIndexArray) {
                                compileVrArray(varIndexArray);
                                result.push('arrayr ' + tempVar + ',' + vrArray.array + ',' + tempVar);
                            } else {
                                result.push('arrayr ' + tempVar + ',' + vrArray.array + ',' + vrArray.index);
                            }
                        }

                        compileVrArray(vrIndexArray);
                        result.push('arrayw ' + vrArray.array + ',' + tempVar + ',' + value);
                    } else {
                        result.push('arrayw ' + vrArray.array + ',' + vrArray.index + ',' + value);
                    }
                }
            };

            this.compileGetIndex = function(result, valueArray, vr) {
                var expressionCompiler = this._expressionCompiler;

                var calculation = expressionCompiler.isCalculation(valueArray.index);
                if (calculation) {
                    tempVar = expressionCompiler.compileToTempVar(result, calculation);
                    result.push('arrayr ' + vr + ',' + valueArray.array + ',' + tempVar + '_1');
                } else {
                    var varIndexArray = expressionCompiler.isArrayIndex(valueArray.index);
                    if (varIndexArray) {
                        var tempVar = expressionCompiler.createTempVarName();
                        expressionCompiler.declareNumber(result, tempVar);

                        function compileValueArray(valueArray) {
                            var varIndexArray = expressionCompiler.isArrayIndex(valueArray.index);
                            var calculation   = expressionCompiler.isCalculation(valueArray.index);
                            if (calculation) {
                                var tempIndexVar = expressionCompiler.compileToTempVar(result, calculation);
                                result.push('arrayr ' + tempVar + ',' + valueArray.array + ',' + tempIndexVar + '_1');
                            } else if (varIndexArray) {
                                compileValueArray(varIndexArray);
                                result.push('arrayr ' + tempVar + ',' + valueArray.array + ',' + tempVar);
                            } else {
                                result.push('arrayr ' + tempVar + ',' + valueArray.array + ',' + valueArray.index);
                            }
                        }

                        compileValueArray(valueArray);
                        result.push('set ' + vr + ',' + tempVar);
                    } else {
                        result.push('arrayr ' + vr + ',' + valueArray.array + ',' + valueArray.index);
                    }
                }
            };

            this.compileOperator = function(line, operator) {
                var result             = [];
                var expressionCompiler = this._expressionCompiler;
                var parts              = line.split(operator.operator);
                var vr                 = parts[0].trim();
                var vrArray            = this._expressionCompiler.isArrayIndex(vr);
                var value              = parts[1].trim();
                var valueArray         = this._expressionCompiler.isArrayIndex(value);
                var tempVar;

                var calculation = expressionCompiler.isCalculation(value);
                if (calculation) {
                    tempVar = expressionCompiler.compileToTempVar(result, calculation);
                    if (vrArray) {
                        var indexCalculation = expressionCompiler.isCalculation(vrArray.index);
                        if (indexCalculation) {
                            var indexTempVar = expressionCompiler.compileToTempVar(result, indexCalculation);
                            result.push('arrayw ' + vrArray.array + ',' + indexTempVar + '_1,' + tempVar + '_1');
                        } else {
                            result.push('arrayw ' + vrArray.array + ',' + vrArray.index + ',' + tempVar + '_0');
                        }
                    } else {
                        result.push('set ' + vr + ',' + tempVar + '_1');
                    }
                } else if (vrArray && valueArray) {
                    var vr = expressionCompiler.createTempVarName();
                    expressionCompiler.declareNumber(result, vr);
                    this.compileGetIndex(result, valueArray, vr);
                    this.compileSetIndex(result, vrArray, vr);
                } else if (vrArray) {
                    this.compileSetIndex(result, vrArray, value);
                } else if (valueArray) {
                    this.compileGetIndex(result, valueArray, vr);
                } else {
                    result.push(operator.command + ' ' + vr.trim() + ',' + value);
                }

                return result;
            };

            this.compileProcCall = function(line, procCall) {
                var expressionCompiler = this._expressionCompiler;
                var hasExpression      = false;
                var params             = procCall.params;
                var param              = '';
                var p                  = [];
                var i                  = 0;

                function addParam(value) {
                    var calculation = false;
                    var arrayIndex  = false;
                    if (!((value.substr(0, 1) === '[') && (value.substr(-1) === ']'))) {
                        calculation = expressionCompiler.isCalculation(value);
                        arrayIndex  = expressionCompiler.isArrayIndex(value);
                        (calculation || arrayIndex) && (hasExpression = true);
                    }

                    p.push({
                        value:       value,
                        calculation: calculation,
                        arrayIndex:  arrayIndex
                    });
                }

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
                            param = '';
                            break;

                        default:
                            param += c;
                            break;
                    }
                }
                (param.trim() !== '') && addParam(param);

                if (!hasExpression) {
                    return [line];
                }

                var result       = [];
                var outputParams = [];
                for (var i = 0; i < p.length; i++) {
                    var param = p[i];
                    if (param.arrayIndex) {
                        var calculation = expressionCompiler.isCalculation(param.arrayIndex.index);
                        var tempVar;
                        if (calculation) {
                            tempVar = expressionCompiler.compileToTempVar(result, calculation);
                            result.push('arrayr ' + tempVar + ',' + param.arrayIndex.array + ',' + tempVar + '_1');
                            outputParams.push(tempVar + '_1');
                        } else {
                            tempVar = expressionCompiler.createTempVarName();
                            expressionCompiler.declareNumber(result, tempVar);
                            result.push('arrayr ' + tempVar + ',' + param.arrayIndex.array + ',' + param.arrayIndex.index);
                            outputParams.push(tempVar);
                        }
                    } else if (param.calculation) {
                        outputParams.push(expressionCompiler.compileToTempVar(result, param.calculation) + '_1');
                    } else {
                        outputParams.push(param.value);
                    }
                }

                result.push(procCall.name + '(' + outputParams.join(',') + ')');

                return result;
            };

            this.compileLineBasic = function(line, location, output) {
                var result  = [line];
                var command = line.trim();
                var i       = line.indexOf(' ');
                (i === -1) || (command = line.substr(0, i).trim());

                switch (command) {
                    case 'proc':
                        return this.compileProc(line);

                    case 'endp':
                        return this.compileEndProc(line);

                    case 'struct':
                        return this.compileStruct(line);

                    case 'ends':
                        return this.compileEndStruct(line);

                    case 'for':
                        return this.compileFor(line.substr(i - line.length));

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
                        var procCall = this._expressionCompiler.isProcCall(line);
                        if (procCall) {
                            return this.compileProcCall(line, procCall);
                        } else {
                            var operator = this._expressionCompiler.hasOperator(line);
                            if (operator) {
                                return this.compileOperator(line, operator);
                            }
                        }
                        break;
                }

                return result;
            };

            this.compile = function(lines) {
                var output   = [];
                var location = {
                        filename:   this._filename,
                        lineNumber: 0
                    };

                this._forStack.length    = 0;
                this._ifStack.length     = 0;
                this._selectStack.length = 0;
                this._endStack.length    = 0;

                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i].trim();
                    if (line === '') {
                        continue;
                    }

                    location.lineNumber = i;

                    var codeLines = this.compileLineBasic(line, location, output);
                    for (var j = 0; j < codeLines.length; j++) {
                        output.push(codeLines[j]);
                    }
                }

                return output;
            };
        })
    );
})();