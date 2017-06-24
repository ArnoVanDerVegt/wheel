(function() {
    var wheel = require('./utils/base.js').wheel;

    wheel(
        'WheelClass',
        wheel.Class(function() {
            this.init = function(opts) {
                this._compiler     = opts.compiler;
                this._compilerData = opts.compilerData;
                this._vm           = opts.vm;
                this._vmData       = opts.vmData;
            };
        })
    );
})();