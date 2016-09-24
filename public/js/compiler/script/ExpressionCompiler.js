(function() {
    var wheel = require('../../utils/base.js').wheel;
    var $;

    var localVarIndex = 1;//10000;

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
                    var j = vr.indexOf(']');
                    if (j === -1) {
                        // throw error
                    }
                    return {array: vr.substr(0, i), index: vr.substr(i + 1, j - 1 - i).trim()};
                }
                return false;
            };

            this.isCalculation = function(value) {
                var commands  = {
                        '*': 'mul',
                        '/': 'div',
                        '+': 'add',
                        '-': 'sub'
                    };
                var operators = ['*', '/', '+', '-'];

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
                                    var openC  = c;
                                    var closeC = {'[': ']', '(': ')'}[c];
                                    var count  = 1;
                                    var ss =openC;
                                    i++;
                                    while ((count > 0) && (i < s.length)) {
                                        c = s[i++];
                                        ss+=c;
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
                                                operatorFound = operator;
                                                operatorPos   = i;
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
                } else {
                    var vrArray = this.isArrayIndex(node.value);
                    if (command === 'set') {
                        this.declareNumber(result, localVr + '_' + depth);
                        if (vrArray) {
                            result.push('arrayr ' + vr1 + ',' + vrArray.array + ',' + vrArray.index);
                        } else {
                            result.push(command + ' ' + vr1 + ',' + node.value);
                        }
                    } else {
                        if (vrArray) {
                            var vr2 = localVr + '_' + (depth + 1);
                            this.declareNumber(result, vr2);
                            result.push('arrayr ' + vr2 + ',' + vrArray.array + ',' + vrArray.index);
                            result.push(command + ' ' + vr1 + ',' + vr2);
                        } else {
                            result.push(command + ' ' + vr1 + ',' + node.value);
                        }
                    }
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