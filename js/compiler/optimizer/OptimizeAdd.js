(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.optimizer.OptimizeAdd',
        wheel.Class(wheel.compiler.optimizer.BasicOptimizer, function(supr) {
            this.paramIsConst = function(param) {
                return (param.type === 0);
            };

            this.optimize = function() {
                var buffer = this._buffer;
                var length = buffer.length;

                if (length <= 1) {
                    return false;
                }
                var command1 = buffer[length - 2];
                var command2 = buffer[length - 1];
                var $        = wheel.compiler.command;

                if ((command1.code === $.CMD_ADD) && (command2.code === $.CMD_ADD) &&
                    this.paramsEqual(command1.params[0], command2.params[0]) &&
                    this.paramIsConst(command1.params[1]) && this.paramIsConst(command2.params[1])) {
                    console.log('here???????');
                    //buffer.pop();
                }

                return false;
            };
        })
    );
})();