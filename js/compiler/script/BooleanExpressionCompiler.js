(function() {
    var wheel = require('../../utils/base.js').wheel;

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
                    var left  = wheel.compiler.helpers.expressionHelper.removeParentheses(s.substr(0, splitInfo.pos).trim());
                    var right = wheel.compiler.helpers.expressionHelper.removeParentheses(s.substr(splitInfo.pos - s.length + splitInfo.operator.length).trim());
                    var info  = {
                            or: {
                                node:      wheel.compiler.script.boolean.BooleanOrNode,
                                valueNode: wheel.compiler.script.boolean.BooleanOrValueNode
                            },
                            and: {
                                node:      wheel.compiler.script.boolean.BooleanAndNode,
                                valueNode: wheel.compiler.script.boolean.BooleanAndValueNode
                            }
                        }[splitInfo.operator];

                    var l    = this.parse(left,  info.valueNode, 'left',  result);
                    var r    = this.parse(right, info.valueNode, 'right', result);
                    var node = createNode(info.node, l, r, false);
                    l.setParent(node);
                    r.setParent(node);
                    return node;
                } else if (src === 'root') {
                    return createNode(wheel.compiler.script.boolean.BooleanRootNode, false, false, s);
                } else {
                    return createNode(ctor, false, false, s);
                }
            };

            this.compile = function(s, result, label, labels) {
                this._label  = label;
                this._labels = labels;
                var node = this.parse(wheel.compiler.helpers.expressionHelper.removeParentheses(s), null, 'root', result);
                node.compile(0);
            };
        })
    );
})();