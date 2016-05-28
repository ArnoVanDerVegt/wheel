wheel(
	'vm.modules.StandardModule',
	Class(wheel.vm.modules.VMModule, function(supr) {
		this.run = function(commandId) {
			var vmData = this._vmData;

			switch (commandId) {
				case 0: // STANDARD_LOG_NUMBER
					var logNumber = vmData.getRecordFromRegOffset(['n']);
					console.log(logNumber.n);
					break;

				case 0: // STANDARD_LOG_STRING
					var logString = vmData.getRecordFromRegOffset(['s']);
					console.log(logNumber.s);
					break;
			}
		};
	})
);
