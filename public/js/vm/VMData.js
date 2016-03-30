var VMData = Class(function() {
		this.init = function(opts) {
			this._globalData 		= [];

			this._localOffset 	 	= 0;
			this._localOffsetStack 	= [];
			this._localData 		= [];

			this._registers			= {};

			for (var register in opts.registers) {
				switch (opts.registers[register]) {
					case 'nr': this._registers[register] = 0; 	break;
					case 'br': this._registers[register] = 0; 	break;
					case 'sr': this._registers[register] = ''; 	break;
				}
			}
		};

		/* Global */
		this.setGlobalNum = function(index, value) {
			this._globalData[index] = value;
		};

		this.getGlobalNumber = function(index) {
			return this._globalData[index];
		};

		/* Local */
		this.setLocalNum = function(index, value) {
			this._localData[this._localOffset + index] = value;
		};

		this.getLocalNumber = function(index) {
			return this._localData[this._localOffset + index];
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
	});
