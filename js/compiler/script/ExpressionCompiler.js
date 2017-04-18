(function() {
    var wheel         = require('../../utils/base.js').wheel;
    var localVarIndex = 10000;

    wheel(
        'compiler.script.ExpressionCompiler',
        wheel.Class(function() {
            this.init = function(opts) {
                this._declaredNumbers = {};
            };

            this.createTempVarName = function() {
                return 'temp' + (localVarIndex++);
            };

            this.declareNumber = function(result, vr) {
                if (vr in this._declaredNumbers) {
                    return;
                }
                this._declaredNumbers[vr] = true;
                result.push('number ' + vr);
            };

            this.hasOperator = function(line) {
                var commands  = ['add', 'sub', 'mul', 'div', 'mod', 'and', 'or', 'set'];
                var operators = {
                        add: '+=',
                        sub: '-=',
                        mul: '*=',
                        div: '/=',
                        mod: '%=',
                        and: '&=',
                        or:  '|=',
                        set: '='
                    };

                if ((line.indexOf('number') === -1) && (line.indexOf('string') === -1)) {
                    for (var i = 0; i < commands.length; i++) {
                        var operator = operators[commands[i]];
                        var j        = line.indexOf(operator);
                        if (j !== -1) {
                            return {
                                command:  commands[i],
                                operator: operator,
                                pos:      j
                            };
                        }
                    }
                }

                return false;
            };

            this.isArrayIndex = function(vr) {
                var i = vr.indexOf('[');
                if (i !== -1) {
                    var j = vr.lastIndexOf(']');
                    if (j === -1) {
                        // throw error
                    }
                    if (vr.substr(-1) === ']') {
                        return {array: vr.substr(0, i), index: vr.substr(i + 1, j - 1 - i).trim()};
                    }
                }
                return false;
            };

            this.isProcCall = function(s) {
                s = s.trim();
                var i = s.indexOf('(');
                if ((i > 0) && (s.substr(-1) === ')') && wheel.compiler.compilerHelper.validateString(s.substr(0, i))) {
                    return {
                        name:   s.substr(0, i),
                        params: s.substr(i + 1, s.length - i - 2)
                    };
                }
                return false;
            };

            this.isCalculation = function(value) {
                var commands  = {
                        '*': 'mul',
                        '/': 'div',
                        '+': 'add',
                        '-': 'sub',
                        '%': 'mod'
                    };
                var operators = ['*', '/', '+', '-', '%'];

                var createNode = function(value) {
                        return {left: null, operator: null, right: null, value: value};
                    };

                var findOperatorPos = function(s) {
                        var operatorFound = null;
                        var operatorPos   = 0;

                        var i = 0;
                        while (i < s.length) {
                            var c = s[i];
                            switch (c) {
                                case '[':
                                case '(':
                                case '"':
                                    var openC  = c;
                                    var closeC = {'[': ']', '(': ')'}[c];
                                    var count  = 1;
                                    i++;
                                    while ((count > 0) && (i < s.length)) {
                                        c = s[i++];
                                        if (c === openC) {
                                            count++;
                                        } else if (c === closeC) {
                                            count--;
                                        }
                                    }
                                    break;

                                default:
                                    for (var j = 0; j < operators.length; j++) {
                                        var operator = operators[j];
                                        if (s.substr(i, operator.length) === operator) {
                                            if ((operatorFound === null) ||
                                                (operators.indexOf(operator) > operators.indexOf(operatorFound))) {
                                                // No pointers!
                                                if (!((i === 0) && (operator === '*')) &&
                                                    !((i === 0) && (operator === '-'))) {
                                                    operatorFound = operator;
                                                    operatorPos   = i;
                                                }
                                            }
                                        }
                                    }
                                    break;
                            }
                            i++;
                        }

                        if (operatorFound) {
                            return {found: operatorFound, pos: operatorPos};
                        }
                        return null;
                    };

                var parseExpression = function(node) {
                        var s   = node.value;
                        var pos = findOperatorPos(s);

                        if (pos !== null) {
                            node.left     = createNode(s.substr(0, pos.pos).trim());
                            node.operator = pos.found;
                            node.command  = commands[pos.found];
                            node.right    = createNode(s.substr(pos.pos + pos.found.length - s.length).trim());
                            parseExpression(node.left);
                            parseExpression(node.right);
                        }
                    };


                var pos = findOperatorPos(value);
                if (pos) {
                    var node = createNode(value);
                    parseExpression(node);
                    return node;
                }

/*
                for (var i = 0; i < operators.length; i++) {
                    var operator = operators[i];
                    var j        = value.indexOf(operator);
                    if (j !== -1) {
                        var node = createNode(value);
                        parseExpression(node);
                        return node;
                    }
                }
*/

                return false;
            };

            this.isComposite = function(s) {
                for (var i = 1; i < s.length; i++) {
                    if ((s[i] === '.') || (s[i] === '[')) {
                        return true;
                    }
                    if (!wheel.compiler.compilerHelper.validateString(s[i])) {
                        return false;
                    }
                }
                return false;
            };

            this.compileCompositeVar = function(result, vr, depth) {
                depth || (depth = 0);

                var part       = '';
                var partsAdded = {};
                var addPart = function(resultVar, part) {
                        if (part in partsAdded) {
                            return;
                        }
                        partsAdded[part] = true;
                        result.push('add ' + resultVar + ',%offset(' + part + ')');
                    };
                var resultVar  = this.createTempVarName();
                var first      = true;
                var i          = 0;

                this.declareNumber(result, resultVar);

                var calculation = false;

                while (i < vr.length) {
                    var c = vr[i++];
                    switch (c) {
                        case '.':
                            calculation = false;
                            result.push('%expect_struct ' + part.trim());
                            if (first) {
                                result.push('%if_global ' + part);
                                result.push('set ' + resultVar + ',%offset(' + part + ')');
                                result.push('%else');
                                result.push('set ' + resultVar + ',REG_STACK');
                                addPart(resultVar, part);
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
                                result.push('set ' + resultVar + ',%offset(' + part + ')');
                                result.push('%else');
                                result.push('set ' + resultVar + ',REG_STACK');
                                addPart(resultVar, part);
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

                            calculation = this.isCalculation(index);
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
                            } else if (this.isComposite(index)) {
                                var indexVar = this.compileCompositeVar(result, index, depth + 1);

                                if (!indexVar.calculation) {
                                    result.push('set REG_SRC,REG_STACK');
                                    result.push('set REG_STACK,' + indexVar.result);
                                    result.push('set REG_DEST,%REG_STACK');
                                    result.push('set REG_STACK,REG_SRC');
                                    result.push('set ' + indexVar.result + ',REG_DEST');
                                }
                                result.push('%if_size_1 ' + part);
                                result.push('add ' + resultVar + ',' + indexVar.result);
                                result.push('%else');
                                result.push('set REG_SRC,' + indexVar.result);
                                result.push('mul REG_SRC,%sizeof(' + part + ')');
                                result.push('add ' + resultVar + ',REG_SRC');
                                result.push('%end');
                            } else {
                                result.push('%if_size_1 ' + part);
                                result.push('add ' + resultVar + ',' + index);
                                result.push('%else');
                                result.push('set REG_SRC,' + index);
                                result.push('mul REG_SRC,%sizeof(' + part + ')');
                                result.push('add ' + resultVar + ',REG_SRC');
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
                } else if (this.isComposite(node.value)) {
                    var structVar = this.compileCompositeVar(result, node.value);
                    this.declareNumber(result, localVr + '_' + depth);
                    result.push('set REG_SRC,REG_STACK');
                    result.push('set REG_STACK,' + structVar.result);
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

            this.compileToTempVar = function(result, calculation) {
                var tempVar = this.createTempVarName();
                this.compileCalculation(result, tempVar, calculation, 0, '');
                return tempVar;
            };
        })
    );
})();