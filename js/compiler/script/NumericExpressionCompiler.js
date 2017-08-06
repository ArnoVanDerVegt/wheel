(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.script.NumericExpressionCompiler',
        wheel.Class(function() {
            this.init = function(opts) {
                this._declaredNumbers = {};
            };

            this.declareNumber = function(result, vr) {
                if (vr in this._declaredNumbers) {
                    return;
                }
                this._declaredNumbers[vr] = true;
                result.push('number ' + vr);
            };

            this.compileCompositeVar = function(result, vr, depth, forWriting) {
                depth || (depth = 0);

                var part        = '';
                var partsAdded  = {};
                var lastOffset1 = false;
                var lastOffset2 = false;
                var lastCommand = '';

                var addPart = function(resultVar, part, indent) {
                        indent || (indent = '');
                        if (part in partsAdded) {
                            return;
                        }
                        partsAdded[part] = true;
                        lastOffset1 = result.length;
                        result.push(indent + '%if_pointer ' + part);
                        result.push(indent + '    add ' + resultVar + ',%offset(' + part + ')');
                        result.push(indent + '    set REG_SRC,REG_STACK');
                        result.push(indent + '    set REG_STACK,' + resultVar);
                        result.push(indent + '    set REG_DEST,%REG_STACK');
                        result.push(indent + '    set REG_STACK,REG_SRC');
                        result.push(indent + '    set ' + resultVar + ',REG_DEST');
                        result.push(indent + '%else');
                        result.push(indent + '    add ' + resultVar + ',%offset(' + part + ')');
                        result.push(indent + '%end');

                        lastCommand = indent + '    add ' + resultVar + ',%offset(' + part + ')';
                        lastOffset2 = result.length;
                    };
                var resultVar  = wheel.compiler.helpers.expressionHelper.createTempVarName();
                var first      = true;
                var i          = 0;

                this.declareNumber(result, resultVar);

                var calculation = false;

                while (i < vr.length) {
                    var c = vr[i++];
                    switch (c) {
                        case '.':
                            calculation = false;
                            result.push('%expect_record ' + part.trim());
                            if (first) {
                                result.push('%if_global ' + part);
                                result.push('    set ' + resultVar + ',%offset(' + part + ')');
                                result.push('    %if_pointer ' + part);
                                result.push('        set REG_SRC,REG_STACK');
                                result.push('        set REG_STACK,' + resultVar);
                                result.push('        set REG_DEST,%REG_STACK');
                                result.push('        set REG_STACK,REG_SRC');
                                result.push('        set ' + resultVar + ',REG_DEST');
                                result.push('    %else');
                                result.push('    %end');
                                result.push('%else');
                                result.push('    set ' + resultVar + ',REG_STACK');
                                addPart(resultVar, part, '    ');
                                result.push('%end');
                            } else {
                                addPart(resultVar, part);
                            }

                            first = false;
                            part += c;
                            break;

                        case '[':
                            calculation = false;
                            result.push('%expect_array ' + part.trim());
                            if (first) {
                                result.push('%if_global ' + part);
                                result.push('    set ' + resultVar + ',%offset(' + part + ')');
                                result.push('%else');
                                result.push('    set ' + resultVar + ',REG_STACK');
                                addPart(resultVar, part, '    ');
                                result.push('%end');
                            } else {
                                addPart(resultVar, part);
                            }

                            var index = '';
                            var open  = 1;
                            while (open && (i < vr.length)) {
                                c = vr[i++];
                                switch (c) {
                                    case '[':
                                        index += c;
                                        open++;
                                        break;

                                    case ']':
                                        open--;
                                        open && (index += c);
                                        break;

                                    default:
                                        index += c;
                                        break;
                                }
                            }

                            calculation = wheel.compiler.helpers.expressionHelper.isCalculation(index);
                            if (calculation) {
                                var indexVar = this.compileToTempVar(result, calculation);
                                result.push('add ' + resultVar + ',' + indexVar + '_1');

                                if (depth > 0) {
                                    result.push('set REG_SRC,REG_STACK');
                                    result.push('set REG_STACK,' + resultVar);
                                    result.push('set REG_DEST,%REG_STACK');
                                    result.push('set REG_STACK,REG_SRC');
                                    result.push((first ? 'set' : 'add') + ' ' + resultVar + ',REG_DEST');
                                }
                            } else if (wheel.compiler.helpers.expressionHelper.isComposite(index)) {
                                var indexVar = this.compileCompositeVar(result, index, depth + 1);

                                if (!indexVar.calculation) {
                                    result.push('set REG_SRC,REG_STACK');
                                    result.push('set REG_STACK,' + indexVar.result);
                                    result.push('set REG_DEST,%REG_STACK');
                                    result.push('set REG_STACK,REG_SRC');
                                    result.push('set ' + indexVar.result + ',REG_DEST');
                                }
                                result.push('%if_size_1 ' + part);
                                result.push('    add ' + resultVar + ',' + indexVar.result);
                                result.push('%else');
                                result.push('    set REG_SRC,' + indexVar.result);
                                result.push('    mul REG_SRC,%sizeof(' + part + ')');
                                result.push('    add ' + resultVar + ',REG_SRC');
                                result.push('%end');
                            } else {
                                result.push('%if_size_1 ' + part);
                                result.push('    add ' + resultVar + ',' + index);
                                result.push('%else');
                                result.push('    set REG_SRC,' + index);
                                result.push('    mul REG_SRC,%sizeof(' + part + ')');
                                result.push('    add ' + resultVar + ',REG_SRC');
                                result.push('%end');
                            }

                            first = false;
                            break;

                        default:
                            part += c;
                            break;
                    }
                }
                (part.indexOf('.') === -1) || addPart(resultVar, part);

                if (forWriting && (lastOffset1 !== false) && (lastOffset2 !== false)) {
                    result.splice(lastOffset1, lastOffset2 - lastOffset1 - 1);
                    result[lastOffset1] = lastCommand;
                }

                return {
                    result:      resultVar,
                    calculation: calculation
                };
            };

            this.compileCalculation = function(result, localVr, node, depth, command) {
                var vr1 = localVr + '_' + depth;

                if (node.left && node.right) {
                    var vr2 = localVr + '_' + (depth + 1);
                    var vr3 = localVr + '_' + (depth + 2);

                    this.declareNumber(result, vr1);

                    if (!node.left.left && !node.right.left) {
                        this.compileCalculation(result, localVr, node.left,  depth + 1, 'set');
                        this.compileCalculation(result, localVr, node.right, depth + 1, node.command);
                    } else if (!node.left.left) {
                        this.compileCalculation(result, localVr, node.left,  depth,     'set');
                        this.compileCalculation(result, localVr, node.right, depth + 1, node.command);
                        result.push(node.command + ' ' + vr1 + ',' + vr3);
                        result.push('set ' + vr2 + ',' + vr1);
                    } else if (!node.right.left) {
                        this.compileCalculation(result, localVr, node.left,  depth,     'set');
                        this.compileCalculation(result, localVr, node.right, depth + 1, node.command);
                    } else {
                        this.compileCalculation(result, localVr, node.left,  depth,     'set');
                        this.compileCalculation(result, localVr, node.right, depth + 1, node.command);
                        result.push(node.command + ' ' + vr2 + ',' + vr3);
                    }
                } else if (wheel.compiler.helpers.expressionHelper.isComposite(node.value)) {
                    var recordVar = this.compileCompositeVar(result, node.value);
                    this.declareNumber(result, localVr + '_' + depth);
                    result.push('set REG_SRC,REG_STACK');
                    result.push('set REG_STACK,' + recordVar.result);
                    result.push('set REG_DEST,%REG_STACK');
                    result.push('set REG_STACK,REG_SRC');
                    result.push(command + ' ' + vr1 + ',REG_DEST');
                } else if (command === 'set') {
                    this.declareNumber(result, localVr + '_' + depth);
                    result.push('set ' + vr1 + ',' + node.value);
                } else {
                    result.push(command + ' ' + vr1 + ',' + node.value);
                }
            };

            /**
             * Compile
            **/
            this.compileToTempVar = function(result, calculation) {
                //console.log(result);
                //console.log(calculation);
                var tempVar = wheel.compiler.helpers.expressionHelper.createTempVarName();
                this.compileCalculation(result, tempVar, calculation, 0, '');
                return tempVar;
            };
        })
    );
})();