(function() {
    var wheel = require('../../utils/base.js');

    wheel(
        'vm.modules.VMModule',
        wheel.Class(function() {
            this.init = function(opts) {
                this._vm        = opts.vm;
                this._vmData    = opts.vmData;
                this._resources = null;
            };

            this.setResources = function(resources) {
                this._resources = resources;
            };

            this.run = function(commandId) {
            };
        })
    );
})();