(function() {
    var wheel = require('../../utils/base.js').wheel;

    function split(s) {
        var word  = '';
        var found = null;

        /**
         * Skip open and close characters ("(", ")" or "[", "]"),
         * count open and close until every open was closed.
        **/
        var skipChars = function(openChar, closeChar) {
                var open = 1;
                while (open && (i < s.length)) {
                    var c = s[i++];
                    if (c === openChar) {
                        open++;
                    } else if (c === closeChar) {
                        open--;
                    }
                }
            };

        /**
         * Add a word, check if it's an operator and the weight of the operator.
        **/
        var addWord = function() {
                switch (word) {
                    case 'or':
                        if ((found === null) || (found.operator === 'and')) {
                            found = {operator: 'or', pos: i - 3};
                        }
                        break;

                    case 'and':
                        if (found === null) {
                            found = {operator: 'and', pos: i - 4};
                        }
                        break;
                }
                word = '';
            };

        var i = 0;
        while (i < s.length) {
            var c = s[i++];
            switch (c) {
                case ' ':
                    addWord();
                    break;

                case '(':
                    skipChars('(', ')');
                    break;

                case '[':
                    skipChars('[', ']');
                    break;

                default:
                    word += c;
                    break;
            }
        }
        addWord();

        return found;
    }

    function removeParentheses(s) {
        if ((s.length && (s[0] === '(')) && (s[s.length - 1] === ')')) {
            var result = s.substr(1, s.length - 2);
            for (var i = 0; i < result.length; i++) {
                var c = result[i];
                if (c === '(') {
                    break;
                } else if (c === ')') {
                    return s;
                }
            }
            return result;
        }
        return s;
    }

    var labelIndex = 0;

    var BooleanNode = wheel.Class(function() {
            this.init = function(opts) {
                this._scriptCompiler = opts.scriptCompiler;
                this._result         = opts.result;
                this._label          = opts.label;
                this._labels         = opts.labels;
                this._src            = opts.src;
                this._parent         = null;
                this._index          = labelIndex++;
                this._left           = opts.left  || false;
                this._right          = opts.right || false;
                this._value          = opts.value || false;
            };

            this.getIndex = function() {
                return this._index;
            };

            this.getRightSrc = function() {
                return (this._src === 'right');
            };

            this.getParent = function() {
                return this._parent;
            };

            this.setParent = function(parent) {
                this._parent = parent;
                return this;
            };

            this.getOrType = function() {
                return (this._type === 'or');
            };

            this.getAndType = function() {
                return (this._type === 'and');
            };

            this.getLeft = function() {
                return this._left;
            };

            this.getRight = function() {
                return this._right;
            };

            this.getValue = function() {
                return this._value;
            };

            this.compileJumpParts = function(s) {
                var compare = {
                        je:  '!=',
                        jne: '==',
                        jl:  '>=',
                        jg:  '<=',
                        jle: '>',
                        jge: '<'
                    };
                var jumps = ['je', 'jne', 'jl', 'jg', 'jle', 'jge'];
                var jump  = null;
                var cmp;
                var k;
                for (var j = 0; j < jumps.length; j++) {
                    jump = jumps[j];
                    cmp  = compare[jump];
                    k    = s.indexOf(cmp);
                    if (k !== -1) {
                        break;
                    }
                }
                var parts;
                if (k === -1) {
                    parts = [s, '0'];
                    jump  = 'je';
                    cmp   = '==';
                } else {
                    parts = s.split(compare[jump]);
                }
                return {
                    start: parts[0].trim(),
                    end:   parts[1].trim(),
                    jump:  jump,
                    cmp:   cmp
                };
            };

            this.addLines = function(lines) {
                lines.forEach(function(line) { this.addLine(line); }, this);
            };

            this.addLine = function(line) {
                this._result.push(line);
            };

            this.addJumpTrue = function() {
                this.addLine('jmp ' + this._label + '_true');
            };

            this.addExitLabelLine = function(line) {
                this._labels.push({offset: this._result.length, type: 'exit'});
                this._result.push(line);
            };

            this.addIndexLabel = function() {
                this.addLine(this._label + '_' + this._index + ':');
            };

            this.compile = function() {
                var jumpParts = this.compileJumpParts(this._value);
                var ifLine    = jumpParts.start + jumpParts.cmp + jumpParts.end;
                var operator  = {command: 'cmp', operator: jumpParts.cmp, pos: jumpParts.start.length};
                var result    = this._scriptCompiler.compileOperator(ifLine, operator);
                this.addLines(result);

                return jumpParts;
            };
        });

    var OrNode = wheel.Class(BooleanNode, function(supr) {
            this.init = function(opts) {
                supr(this, 'init', arguments);
                this._type = 'or';
            };

            this.addJumpToParentIndex = function() {
                this.addLine('jmp ' + this._label + '_' + this._parent.getIndex());
            };

            this.compile = function() {
                var left   = this._left;
                var right  = this._right;
                var parent = this._parent;

                left.compile();
                right.compile();
                if (parent && right.getValue()) {
                    if (parent.getParent() && parent.getParent().getOrType()) {
                        this.addJumpToParentIndex();
                    } else {
                        this.addExitLabelLine('jmp ');
                    }
                }
                this.addExitLabelLine('jmp ');
                this.addIndexLabel();
                if (parent) {
                    if (parent.getOrType()) {
                        this.addJumpToParentIndex();
                    } else if (parent.getAndType() && this.getRightSrc()) {
                        this.addJumpTrue();
                    }
                }
            };
        });

    var AndNode = wheel.Class(BooleanNode, function(supr) {
            this.init = function(opts) {
                supr(this, 'init', arguments);
                this._type = 'and';
            };

            this.compile = function() {
                var left  = this._left;
                var right = this._right;

                left.compile();
                right.compile();
                right.getValue() && this.addJumpTrue();
                this.addIndexLabel();
                this._parent || this.addExitLabelLine('jmp ');
            };
        });

    var OrValueNode = wheel.Class(BooleanNode, function(supr) {
            this.compile = function() {
                var jump = {je: 'jne', jg: 'jle', jl:  'jge', jge: 'jl', jle: 'jg'}[supr(this, 'compile').jump];
                this.addLine(jump + ' ' + this._label + '_' + this._parent.getIndex());
            };
        });

    var AndValueNode = wheel.Class(BooleanNode, function(supr) {
            this.compile = function() {
                this.addLine(supr(this, 'compile').jump + ' ' + this._label + '_' + this._parent.getIndex());
            };
        });

    var RootNode = wheel.Class(BooleanNode, function(supr) {
            this.compile = function() {
                this.addExitLabelLine(supr(this, 'compile').jump + ' ');
            };
        });

    wheel(
        'compiler.script.BooleanExpressionCompiler',
        wheel.Class(function() {
            this.init = function(opts) {
                this._scriptCompiler = opts.scriptCompiler;
            };

            this.parse = function(s, ctor, src, result) {
                var createNode = (function(ctor, left, right, value) {
                        return new ctor({
                            scriptCompiler: this._scriptCompiler,
                            label:          this._label,
                            labels:         this._labels,
                            left:           left,
                            right:          right,
                            value:          value,
                            src:            src,
                            result:         result,
                        });
                    }).bind(this);

                var splitInfo = split(s);
                if (splitInfo) {
                    var left  = removeParentheses(s.substr(0, splitInfo.pos).trim());
                    var right = removeParentheses(s.substr(splitInfo.pos - s.length + splitInfo.operator.length).trim());
                    var info  = {
                            or: {
                                node:      OrNode,
                                valueNode: OrValueNode
                            },
                            and: {
                                node:      AndNode,
                                valueNode: AndValueNode
                            }
                        }[splitInfo.operator];

                    var l    = this.parse(left,  info.valueNode, 'left',  result);
                    var r    = this.parse(right, info.valueNode, 'right', result);
                    var node = createNode(info.node, l, r, false);
                    l.setParent(node);
                    r.setParent(node);
                    return node;
                } else if (src === 'root') {
                    return createNode(RootNode, false, false, s);
                } else {
                    return createNode(ctor, false, false, s);
                }
            };

            this.compile = function(s, result, label, labels) {
                this._label  = label;
                this._labels = labels;
                var node = this.parse(s, null, 'root', result);
                node.compile(0);
            };
        })
    );
})();