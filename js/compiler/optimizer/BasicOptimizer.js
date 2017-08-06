(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.optimizer.BasicOptimizer',
        wheel.Class(function() {
            this.init = function(opts) {
                this._buffer = opts.buffer;
            };

            this.paramIsConst = function(param) {
                return (param.type === 0);
            };

            this.paramsEqual = function(param1, param2) {
                return (param1.type === param2.type) && (param1.value === param2.value);
            };

            this.optimize = function() {
                return (this._buffer.length > 1) ? this._optimize() : false;
            };

            this.getCommands = function() {
                var buffer = this._buffer;
                var length = buffer.length;
                return {c1: buffer[length - 2], c2: buffer[length - 1]};
            }
        })
    );
})();