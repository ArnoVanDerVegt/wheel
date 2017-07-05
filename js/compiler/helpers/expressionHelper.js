(function() {
    var wheel = require('../../utils/base.js').wheel;

    var localVarIndex = 10000;

    wheel(
        'compiler.helpers.expressionHelper',
        {
            createTempVarName: function() {
                return 'temp' + (localVarIndex++);
            },

            hasOperator: function(line) {
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
            },

            isProcCall: function(s) {
                s = s.trim();
                var i = s.indexOf('(');
                if ((i > 0) && (s.substr(-1) === ')') && wheel.compiler.helpers.compilerHelper.validateString(s.substr(0, i))) {
                    return {
                        name:   s.substr(0, i),
                        params: s.substr(i + 1, s.length - i - 2)
                    };
                }
                return false;
            },

            isCalculation: function(value) {
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

                return false;
            },

            isArrayIndex: function(vr) {
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
            },

            isComposite: function(s) {
                for (var i = 1; i < s.length; i++) {
                    if (s[i] === '[') {
                        return true;
                    }
                    if ((s[i] === '.') && ('0123456789'.indexOf(s[i + 1]) === -1)) {
                        return true;
                    }
                    if (!wheel.compiler.helpers.compilerHelper.validateString(s[i])) {
                        return false;
                    }
                }
                return false;
            }
        }
    );
})();
