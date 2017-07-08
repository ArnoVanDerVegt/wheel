(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.optimizer.BasicOptimizer',
        wheel.Class(function() {
            this.init = function(opts) {
                this._buffer = opts.buffer;
            };

            this.paramsEqual = function(param1, param2) {
                return (param1.type === param2.type) && (param1.value === param2.value);
            };
        })
    );
})();