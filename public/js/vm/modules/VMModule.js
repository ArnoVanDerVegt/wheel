wheel(
    'vm.modules.VMModule',
    Class(function() {
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