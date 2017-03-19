(function() {
    var wheel = require('../../utils/base.js').wheel;

	wheel(
		'vm.modules.StandardModule',
		wheel.Class(wheel.vm.modules.VMModule, function(supr) {
			this.run = function(commandId) {
				var vmData = this._vmData;

				switch (commandId) {
					case 0: // STANDARD_PRINT_NUMBER
						var printNumber = vmData.getRecordFromAtOffset(['n']);
						this._vm.emit('Log', printNumber.n, {lineNumber: 0, filename: ''});
						break;

					case 1: // STANDARD_PRINT_STRING
						var printString = vmData.getRecordFromAtOffset(['s']);
						this._vm.emit('Log', vmData.getStringList()[printString.s], {lineNumber: 0, filename: ''});
						break;
				}
			};
		})
	);
})();