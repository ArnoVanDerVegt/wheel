var VMData = Class(function() {
		this.init = function(opts) {
			this._globalData 		= [];

			this._localOffset 	 	= 0;
			this._localOffsetStack 	= [];
			this._localData 		= [];

			this._registers			= {};

			for (var register in opts.registers) {
				switch (opts.registers[register]) {
					case T_NUMBER_REGISTER: this._registers[register] = 0; 	break;
					case T_STRING_REGISTER: this._registers[register] = ''; break;
				}
			}
		};

		/* Global */
		this.setGlobalNumber = function(offset, value) {
			this._globalData[offset] = value;
		};

		this.getGlobalNumber = function(offset) {
			return this._globalData[offset];
		};

		/* Local */
		this.setLocalNumber = function(offset, value) {
			this._localData[this._localOffset + offset] = value;
		};

		this.getLocalNumber = function(offset) {
			return this._localData[this._localOffset + offset];
		};

		/* Regigers */
		this.getRegister = function(name) {
			return this._registers[name];
		};

		this.setRegister = function(name, value) {
			this._registers[name] = value;
		};

		/* Local offset */
		this.pushLocalOffset = function(count) {
			this._localOffsetStack.push(this._localOffset);
			this._localOffset += count;
		};

		this.pushLocalOffsetRead = function(count) {
			this._localOffset += count;
		};

		this.popLocalOffset = function() {
			this._localOffset = this._localOffsetStack.pop();
		};

		this.setGlobalConstants = function(globalConstants) {
			var globalData = this._globalData;
			for (var i = 0; i < globalConstants.length; i++) {
				var globalConstant 	= globalConstants[i],
					offset 			= globalConstant.offset,
					data 			= globalConstant.data;
				for (var j = 0; j < data.length; j++) {
					globalData[offset + j] = data[offset + j];
				}
			}
		};
	});
