(function() {
    var wheel = require('../utils/base.js').wheel;
    var $;

    wheel(
        'compiler.BasicCompiler',
        wheel.Class(function() {
            this.init = function(opts) {
                this._forStack         = [];
                this._forLabelIndex    = 10000;
                this._ifStack          = [];
                this._ifLabelIndex     = 10000;
                this._selectStack      = [];
                this._selectLabelIndex = 10000;
                this._endStack         = [];
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
                var label = '_____' + direction + '_label' + (this._forLabelIndex++);

                this._forStack.push({
                    direction: direction,
                    label:     label,
                    end:       end,
                    vr:        vr
                });

                return [
                    'set ' + vr + ',' + start[1].trim(),
                    label + ':'
                ];
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

            this.compileNext = function() {
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
                    label:        '_____if_label' + (this._ifLabelIndex++)
                });

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

            this.compileEndIf = function(output) {
                var ifItem = this._ifStack.pop();
                output[ifItem.outputOffset] += ' ' + ifItem.label;

                return [
                    ifItem.label + ':'
                ];
            };

            this.compileSelect = function(s) {
                this._selectStack.push({
                    label:        '_____select' + (this._selectLabelIndex++),
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
                    case 'select':
                        var selectItem = this._selectStack.pop();
                        var result     = [];

                        if (selectItem.outputOffset !== null) {
                            var label = selectItem.label + '_' + selectItem.caseIndex;
                            result.push(label + ':');
                            output[selectItem.outputOffset] += label;
                        }

                        return result;

                    case 'struct':
                        return ['ends'];

                    case 'proc':
                        return ['endp'];
                }

                return [];
                // throw error!
            };

            this.compileOperator = function(line, operator) {
                var parts = line.split(operator.operator);
                return [
                    operator.command + ' ' + parts[0].trim() + ',' + parts[1].trim()
                ];
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

                    case 'next':
                        return this.compileNext();

                    case 'if':
                        return this.compileIf(line.substr(i - line.length), output);

                    case 'else':
                        return this.compileElse(output);

                    case 'endif':
                        return this.compileEndIf(output);

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

                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i].trim();
                    if (line === '') {
                        continue;
                    }

                    this._lineNumber    = i;
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