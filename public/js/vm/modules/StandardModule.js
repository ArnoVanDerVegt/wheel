wheel(
	'vm.modules.StandardModule',
	Class(wheel.vm.modules.VMModule, function(supr) {
		this.run = function(commandId) {
			var vmData = this._vmData;

			switch (commandId) {
				case 0: // STANDARD_PRINT_NUMBER
					var printNumber = vmData.getRecordFromAtOffset(['n']);
					console.log(printNumber.n);
					break;

				case 1: // STANDARD_PRINT_STRING
					var printString = vmData.getRecordFromAtOffset(['s']);
					console.log(vmData.getStringList()[printString.s]);
					break;
			}
		};
	})
);
