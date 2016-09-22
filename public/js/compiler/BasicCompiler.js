(function() {
    var wheel = require('../utils/base.js').wheel;
    var $;

    forLabelIndex    = 10000;
    ifLabelIndex     = 10000;
    selectLabelIndex = 10000;
    localVarIndex    = 1;//10000;

    wheel(
        'compiler.BasicCompiler',
        wheel.Class(function() {
            this.init = function(opts) {
                this._forStack        = [];
                this._ifStack         = [];
                this._selectStack     = [];
                this._endStack        = [];
                this._declaredNumbers = {};
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

            this.compileCalculation = function(result, localVr, node, depth, command) {
                var vr1 = localVr + '_' + depth;

                if (node.left && node.right) {
                    var vr2 = localVr + '_' + (depth + 1);
                    var vr3 = localVr + '_' + (depth + 2);

                    this.declareNumber(result, vr1);

                    if (!node.left.left && !node.right.left) {
                        this.compileCalculation(result, localVr, node.left, depth + 1, 'set');
                        this.compileCalculation(result, localVr, node.right, depth + 1, node.command);
                    } else if (!node.left.left) {
                        this.compileCalculation(result, localVr, node.left, depth, 'set');
                        this.compileCalculation(result, localVr, node.right, depth + 1, node.command);
                        result.push(node.command + ' ' + vr1 + ',' + vr3);
                        result.push('set ' + vr2 + ',' + vr1);
                    } else if (!node.right.left) {
                        this.compileCalculation(result, localVr, node.left, depth, 'set');
                        this.compileCalculation(result, localVr, node.right, depth + 1, node.command);
                    } else {
                        this.compileCalculation(result, localVr, node.left, depth, 'set');
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

            this.compileOperator = function(line, operator) {
                var result     = [];
                var parts      = line.split(operator.operator);
                var vr         = parts[0].trim();
                var vrArray    = this.isArrayIndex(vr);
                var value      = parts[1].trim();
                var valueArray = this.isArrayIndex(value);
                var i          = vr.indexOf('[');

                var calculation = this.isCalculation(value);
                if (calculation) {
                    var localVr = 'local' + (localVarIndex++);
                    this.compileCalculation(result, localVr, calculation, 0, '');
                    if (vrArray) {
                        result.push('arrayw ' + vrArray.array + ',' + vrArray.index + ',' + localVr + '_0');
                    } else {
                        result.push('set ' + vr + ',' + localVr + '_1');
                    }
                } else if (vrArray && valueArray) {
                    var localVr = '_____local' + (localVarIndex++);
                    return [
                        '@typeof(' + valueArray.array + ') ' + localVr,
                        'arrayr ' + localVr + ',' + valueArray.array + ',' + valueArray.index,
                        'arrayw ' + vrArray.array + ',' + vrArray.index + ',' + localVr
                    ];
                } else if (vrArray) {
                    return [
                        'arrayw ' + vrArray.array + ',' + vrArray.index + ',' + value
                    ];
                } else if (valueArray) {
                    return [
                        'arrayr ' + vr + ',' + valueArray.array + ',' + valueArray.index
                    ];
                } else {
                    return [
                        operator.command + ' ' + vr.trim() + ',' + value
                    ];
                }

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
                        var operator = this.hasOperator(line);
                        if (operator) {
                            return this.compileOperator(line, operator);
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