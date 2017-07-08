(function() {
    var wheel = require('../utils/base.js').wheel;

    wheel(
        'compiler.CompilerOptimizer',
        wheel.Class(function() {
            this.init = function(opts) {
                var buffer = opts.buffer;
                this._buffer     = buffer;
                this._optimizers = [
                    new wheel.compiler.optimizer.OptimizeSet({buffer: buffer})
                ];
            };

            this.optimize = function() {
                var index      = 0;
                var optimized  = false;
                var optimizers = this._optimizers;

                while (!optimized) {
                    optimized = true;
                    var optimizer = optimizers[index];
                    index = (index + 1) % optimizers.length;
                    optimizer.optimize() && (optimized = false);
                }
            };
        })
    );
})();