(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.optimizer.OptimizeSet',
        wheel.Class(function() {
            this.init = function(opts) {
                this._buffer = opts.buffer;
            };

            this.paramsEqual = function(param1, param2) {
                return (param1.type === param2.type) && (param1.value === param2.value);
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

                if ((command1.code === $.CMD_SET) && this.paramsEqual(command1.params[0], command2.params[0]) &&
                    (command2.code === $.CMD_SET) && this.paramsEqual(command1.params[1], command2.params[1])) {
                    buffer.pop();
                }

                return false;
            };
        })
    );
})();