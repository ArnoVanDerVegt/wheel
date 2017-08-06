(function() {
    var wheel = require('../utils/base.js').wheel;

    wheel(
        'compiler.CompilerOptimizer',
        wheel.Class(function() {
            this.init = function(opts) {
                var buffer = opts.buffer;
                this._buffer     = buffer;
                this._optimizers = [
                    new wheel.compiler.optimizer.OptimizeSet({buffer: buffer}),
                    new wheel.compiler.optimizer.OptimizeAdd({buffer: buffer}),
                    new wheel.compiler.optimizer.OptimizeMul({buffer: buffer})
                ];
            };

            this.optimize = function() {
                var optimizers = this._optimizers;
                var optimized  = false;

                while (!optimized) {
                    optimized = true;
                    optimizers.forEach(function(optimizer) {
                        optimizer.optimize() && (optimized = false);
                    });
                }
            };
        })
    );
})();