(function() {
    var wheel              = require('../utils/base.js').wheel;
    var compilerMetaHelper = wheel.compiler.helpers.compilerMetaHelper;

    wheel(
        'compiler.CompilerDirective',
        wheel.Class(wheel.WheelClass, function(supr) {
            this.init = function() {
                this._ret      = true;
                this._call     = true;
                this._optimize = true;
            };

            this.getRet = function() {
                return this._ret;
            };

            this.setRet = function(ret) {
                this._ret = ret;
            };

            this.getCall = function() {
                return this._call;
            };

            this.setCall = function(call) {
                this._call = call;
            };

            this.getOptimize = function() {
                return this._optimize;
            };

            this.setOptimize = function(optimize) {
                this._optimize = optimize;
            };
        })
    );
})();