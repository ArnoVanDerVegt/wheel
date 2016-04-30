wheel(
	'vm.modules.VMModule',
	Class(function() {
		this.init = function(opts) {
			this._vm 		= opts.vm;
			this._vmData 	= opts.vmData;
		};

		this.run = function(commandId) {
		};
	})
);