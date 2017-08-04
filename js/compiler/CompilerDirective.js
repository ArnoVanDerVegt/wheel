(function() {
    var wheel              = require('../utils/base.js').wheel;
    var compilerMetaHelper = wheel.compiler.helpers.compilerMetaHelper;

    wheel(
        'compiler.CompilerDirective',
        wheel.Class(wheel.WheelClass, function(supr) {
            this.init = function() {
                this._ret = false;
            };

            this.getRet = function() {
                return this._ret;
            };

            this.setRet = function(ret) {
                this._ret = ret;
            };
        })
    );
})();