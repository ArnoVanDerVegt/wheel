(function() {
    var wheel = require('../../utils/base.js').wheel;

	wheel(
		'vm.modules.MathModule',
		wheel.Class(wheel.vm.modules.VMModule, function(supr) {
			this.run = function(commandId) {
				var vmData = this._vmData;
				switch (commandId) {
					case 0: // MATH_ROUND
						vmData.setNumberAtRegOffset(Math.round(vmData.getNumberAtRegOffset()));
						break;

					case 1: // MATH_FLOOR
						vmData.setNumberAtRegOffset(Math.floor(vmData.getNumberAtRegOffset()));
						break;

					case 2: // MATH_CEIL
						vmData.setNumberAtRegOffset(Math.ceil(vmData.getNumberAtRegOffset()));
						break;

					case 3: // MATH_ABS
						vmData.setNumberAtRegOffset(Math.abs(vmData.getNumberAtRegOffset()));
						break;

					case 4: // MATH_NEG
						vmData.setNumberAtRegOffset(-vmData.getNumberAtRegOffset());
						break;
				}
			};
		})
	);
})();