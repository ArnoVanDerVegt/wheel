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

                var parseExpression = function(node) {
                        var s             = node.value;
                        var operatorFound = null;
                        var operatorPos   = 0;

                        for (var i = 0; i < operators.length; i++) {
                            var operator = operators[i];
                            var j        = s.indexOf(operator);
                            if (j !== -1) {
                                operatorFound = operator;
                                operatorPos   = j;
                            }
                        }

                        if (operatorFound !== null) {
                            node.left     = createNode(s.substr(0, operatorPos).trim());
                            node.operator = operatorFound;
                            node.command  = commands[operatorFound];
                            node.right    = createNode(s.substr(operatorPos + operatorFound.length - s.length).trim());
                            parseExpression(node.left);
                            parseExpression(node.right);
                        }
                    };


                for (var i = 0; i < operators.length; i++) {
                    var operator = operators[i];
                    var j        = value.indexOf(operator);
                    if (j !== -1) {
                        var node = createNode(value);
                        parseExpression(node);
                        return node;
                    }
                }

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