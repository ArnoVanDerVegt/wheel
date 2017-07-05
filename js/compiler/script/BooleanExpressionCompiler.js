(function() {
    var wheel = require('../../utils/base.js').wheel;

    function removeParentheses(s) {
        s = s.trim();
        var change = true;
        while (change) {
            change = false;
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
                change = true;
                s      = result;
            } else {
                return s;
            }
        }
    }

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

                var splitInfo = wheel.compiler.helpers.expressionHelper.findBooleanOperator(s);
                if (splitInfo) {
                    var left  = removeParentheses(s.substr(0, splitInfo.pos).trim());
                    var right = removeParentheses(s.substr(splitInfo.pos - s.length + splitInfo.operator.length).trim());
                    var info  = {
                            or: {
                                node:      wheel.compiler.script.BooleanOrNode,
                                valueNode: wheel.compiler.script.BooleanOrValueNode
                            },
                            and: {
                                node:      wheel.compiler.script.BooleanAndNode,
                                valueNode: wheel.compiler.script.BooleanAndValueNode
                            }
                        }[splitInfo.operator];

                    var l    = this.parse(left,  info.valueNode, 'left',  result);
                    var r    = this.parse(right, info.valueNode, 'right', result);
                    var node = createNode(info.node, l, r, false);
                    l.setParent(node);
                    r.setParent(node);
                    return node;
                } else if (src === 'root') {
                    return createNode(wheel.compiler.script.BooleanRootNode, false, false, s);
                } else {
                    return createNode(ctor, false, false, s);
                }
            };

            this.compile = function(s, result, label, labels) {
                this._label  = label;
                this._labels = labels;
                var node = this.parse(removeParentheses(s), null, 'root', result);
                node.compile(0);
            };
        })
    );
})();