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
                this._src    = opts.src;
                this._parent = null;
                this._index  = labelIndex++;
                this._left   = opts.left  || false;
                this._right  = opts.right || false;
                this._value  = opts.value || false;
            };

            this.getIndex = function() {
                return this._index;
            };

            this.getParent = function() {
                return this._parent;
            };

            this.setParent = function(parent) {
                this._parent = parent;
                return this;
            };

            this.getType = function() {
                return this._type;
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
        });

    var OrNode = wheel.Class(BooleanNode, function(supr) {
            this.init = function(opts) {
                supr(this, 'init', arguments);
                this._type = 'or';
            };

            this.compile = function(indent) {
                this._left.compile(indent + '  ');
                this._right.compile(indent + '  ');
                var parent = this._parent;
                if (parent && this._right.getValue()) {
                    if (parent.getParent() && (parent.getParent().getType() === 'or')) {
                        console.log(indent + '-> label' + this._parent.getIndex());
                    } else {
                        console.log(indent + '-> false');
                    }
                }
                console.log('-> false');
                console.log(indent + 'label' + this._index + ':');
                if (this._parent) {
                    if (this._parent._type === 'or') {
                        console.log(indent + '-> label' + this._parent._index);
                    } else if ((this._parent._type === 'and') && (this._src === 'right')) {
                        console.log('-> true');
                    }
                }
            };
        });

    var OrNode = wheel.Class(BooleanNode, function(supr) {
            this.init = function(opts) {
                supr(this, 'init', arguments);
                this._type = 'and';
            };

            this.compile = function(indent) {
                this._left.compile(indent + '  ');
                if (!this._left.getValue() || !this._right.getValue()) {
                }
                this._right.compile(indent + '  ');
                if (this._right.getValue()) {
                    console.log(indent + '-> true');
                }
                console.log(indent + 'label' + this._index + ':');
                if (!this._parent) {
                    console.log('-> false');
                }
            };
        });

    var ValueNode = wheel.Class(BooleanNode, function(supr) {
            this.compile = function(indent) {
                console.log(indent + 'value ' + this._value + '-> label' + this._parent._index);
            };
        });


    var OrValueNode = wheel.Class(BooleanNode, function(supr) {
            this.compile = function(indent) {
                console.log(indent + 'iftrue ' + this._value + '-> label' + this._parent._index);
            };
        });

    var AndValueNode = wheel.Class(BooleanNode, function(supr) {
            this.compile = function(indent) {
                console.log(indent + 'iffalse ' + this._value + '-> label' + this._parent._index);
            };
        });

    wheel(
        'compiler.script.BooleanExpressionCompiler',
        wheel.Class(function() {
            this.init = function(opts) {
            };

            this.parse = function(s, ctor, src) {
                var splitInfo = split(s);
                if (splitInfo) {
                    var left  = removeParentheses(s.substr(0, splitInfo.pos).trim());
                    var right = removeParentheses(s.substr(splitInfo.pos - s.length + splitInfo.operator.length).trim());

                    switch (splitInfo.operator) {
                        case 'or':
                            var l    = this.parse(left, OrValueNode, 'left');
                            var r    = this.parse(right, OrValueNode, 'right');
                            var node = new OrNode({left: l, right: r, src: src});
                            l.setParent(node);
                            r.setParent(node);
                            return node;

                        case 'and':
                            var l    = this.parse(left, AndValueNode, 'left');
                            var r    = this.parse(right, AndValueNode, 'right');
                            var node = new AndNode({left: l, right: r, src});
                            l.setParent(node);
                            r.setParent(node);
                            return node;
                    }
                } else {
                    return new ctor({value: s, src: src});
                }
            };

            this.compile = function(s) {
                var node = this.parse('a or b');
                //var node = this.parse('a and b');
                //var node = this.parse('a and b or c');
                //var node = this.parse('a and b or c and d');
                //var node = this.parse('c or a and b');
                //var node = this.parse('a and b and c and d');
                //var node = this.parse('a or b and c or d');
                //var node = this.parse('a or b and c and d or e');
                //var node = this.parse('a and b and c and d or e and f and g and h');
                //var node = this.parse('(a or b) and c', CreateValue, 'root');
                //var node = this.parse('c and (a or b)');
                //var node = this.parse('(a or b) and (c or d)');
                //var node = this.parse('a or b and (c or d)');
                //var node = this.parse('(a or b) and c or d');
                //var node = this.parse('a and (b or c) or d');
                //var node = this.parse('(a or b) and (c or d) or e');
                node.log('  ', 0);
            };
        })
    );
})();