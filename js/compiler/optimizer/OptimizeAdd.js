(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.optimizer.OptimizeAdd',
        wheel.Class(wheel.compiler.optimizer.BasicOptimizer, function(supr) {
            this._optimize = function() {
                var c = this.getCommands();
                var $ = wheel.compiler.command;

                /**
                 * Optimize:
                 *
                 *     add var, const1
                 *     add var, const2
                 *
                 * To:
                 *
                 *     add var, const1 + const2
                **/
                if ((c.c1.code === $.CMD_ADD) && (c.c2.code === $.CMD_ADD) &&
                    this.paramsEqual(c.c1.params[0], c.c2.params[0]) &&
                    this.paramIsConst(c.c1.params[1]) && this.paramIsConst(c.c2.params[1])) {
                    c.c1.params[1].value += c.c2.params[1].value;
                    this._buffer.pop();
                    return true;
                }

                return false;
            };
        })
    );
})();