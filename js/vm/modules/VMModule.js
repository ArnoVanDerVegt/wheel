(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'vm.modules.VMModule',
        wheel.Class(function() {
            this.init = function(opts) {
                this._vm     = opts.vm;
                this._vmData = opts.vmData;
            };

            this.run = function(commandId) {
            };
        })
    );
})();