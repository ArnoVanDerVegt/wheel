(function() {
    var wheel = require('../../utils/base.js').wheel;

	wheel(
		'vm.modules.SensorModule',
		wheel.Class(wheel.vm.modules.VMModule, function(supr) {
			this.run = function(commandId) {
			};
		})
	);
})();