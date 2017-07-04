(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.script.ScriptCompiler',
        wheel.Class(function() {
            this.init = function(opts) {
                this._asmMode                   = false;
                this._numericExpressionCompiler = new wheel.compiler.script.NumericExpressionCompiler({scriptCompiler: this});
                this._endStack                  = [];

                var namespace  = wheel.compiler.script.statements;
                var statements = ['End', 'Asm', 'Record', 'Proc', 'If', 'Else', 'Select', 'Case', 'For', 'Repeat', 'While', 'Break'];
                this._statements = {};
                statements.forEach(
                    function(statement) {
                        this._statements[statement.toLowerCase()] = new namespace['Script' + statement]({scriptCompiler: this});
                    },
                    this
                );
            };

            this.getStatement = function(statement) {
                return this._statements[statement];
            };

            this.getEndStack = function() {
                return this._endStack;
            };

            this.throwErrorIfScriptMode = function() {
                if (!this._asmMode) {
                    throw new Error('#' + wheel.compiler.error.INVALID_SCRIPT_COMMAND + ' Invalid script command.');
                }
                return this;
            };

            this.throwErrorIfAsmMode = function() {
                if (this._asmMode) {
                    throw new Error('#' + wheel.compiler.error.INVALID_ASM_COMMAND + ' Invalid asm command.');
                }
                return this;
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
                        wheel.compiler.helpers.scriptHelper.compilePointerDeref(result, tempRecordVar.result);
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

                    var tempVar   = recordVar.result;
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

            this.checkAsmCommand = function(command) {
                var asmCommands = ['set', 'add', 'sub', 'mul', 'div', 'mod', 'inc', 'dec', 'copy', 'cmp', 'jmpc', 'module', 'addr'];
                (asmCommands.indexOf(command) === -1) || this.throwErrorIfScriptMode();
                return false;
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
                        wheel.compiler.helpers.scriptHelper.compilePointerDeref(result, tempVar);
                        result.push('set ' + tempVar + ',REG_DEST');
                        outputParams.push(tempVar);
                    } else {
                        outputParams.push(param.value);
                    }
                }
                result.push(procCall.name + '(' + outputParams.join(',') + ')');

                return result;
            };

            this.compileLineBasic = function(line, output) {
                var command = line.trim();
                var i       = line.indexOf(' ');
                (i === -1) || (command = line.substr(0, i).trim());
                var params  = line.substr(i - line.length);

                if (command in this._statements) {
                    return this._statements[command].compile(line, params, output);
                } else {
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
                }

                return [line];
            };

            this.compile = function(filename, lines) {
                var output    = [];
                var sourceMap = [];

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