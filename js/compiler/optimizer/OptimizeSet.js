(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.optimizer.OptimizeSet',
        wheel.Class(wheel.compiler.optimizer.BasicOptimizer, function(supr) {
            this._optimize = function() {
                var c = this.getCommands();
                var $ = wheel.compiler.command;

                /**
                 * Optimize:
                 *
                 *     set var, const
                 *     set var, const
                 *
                 * To:
                 *
                 *     set var, const
                **/
                if ((c.c1.code === $.CMD_SET) && this.paramsEqual(c.c1.params[0], c.c2.params[0]) &&
                    (c.c2.code === $.CMD_SET) && this.paramsEqual(c.c1.params[1], c.c2.params[1])) {
                    this._buffer.pop();
                    return true;
                }

                /**
                 * Optimize:
                 *
                 *     set var1, const
                 *     set var2, var1
                 *
                 * To:
                 *
                 *     set var1, const
                 *     set var2, const
                **/
                if ((c.c1.code === $.CMD_SET) && (c.c2.code === $.CMD_SET) &&
                    this.paramsEqual(c.c1.params[0], c.c2.params[1]) &&
                    this.paramIsConst(c.c1.params[1])) {
                    var param = c.c1.params[1];
                    c.c2.params[1] = {type: param.type, value: param.value};
                    return true;
                }

                return false;
            };
        })
    );
})();