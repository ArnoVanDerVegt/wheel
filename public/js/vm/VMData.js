var VMData = Class(function() {
		this.init = function(opts) {
			this._data 				= [];
			this._stringList 		= [];
			this._regOffsetStack 	= [];
			this._registerByName	= {};
			this._registerValues 	= [];

			for (var i = 0; i < opts.registers.length; i++) {
				var register = opts.registers[i];
				switch (register.type) {
					case wheel.compiler.command.T_NUMBER_REGISTER:
						this._registerValues.push(0);
						this._registerByName[register.name] = i;
						break;
				}
			}
		};

		/* Global */
		this.setGlobalNumber = function(offset, value) {
			this._data[offset] = value;
		};

		this.getGlobalNumber = function(offset) {
			return this._data[offset];
		};

		this.setStringList = function(stringList) {
			this._stringList = JSON.parse(JSON.stringify(stringList));
		};

		this.getStringList = function() {
			return this._stringList;
		};

		/* Local */
		this.setLocalNumber = function(offset, value) {
			var offsetStack = this._registerValues[this._registerByName.REG_OFFSET_STACK];
			this._data[offsetStack + offset] = value;
		};

		this.getLocalNumber = function(offset) {
			var offsetStack = this._registerValues[this._registerByName.REG_OFFSET_STACK];
			return this._data[offsetStack + offset];
		};

		/* Registers */
		this.getRegister = function(index) {
			if (typeof index === 'number') {
				return this._registerValues[index];
			}
			throw new Error('Number expected, got ' + (typeof index) + ', "' + index + '".');
		};

		this.getRegisterByName = function(name) {
			var registerByName = this._registerByName;
			if (name in registerByName) {
				return this._registerValues[registerByName[name]];
			}
			throw new Error('Register expected, got "' + name + '".');
		};

		this.setRegister = function(index, value) {
			if (typeof index === 'string') {
				var s = index;
				index = parseInt(index, 10);
				if (isNaN(index)) {
					throw new Error('Number expected, got ' + (typeof s) + ', "' + s + '".');
				}
			}
			this._registerValues[index] = value;
		};

		this.setRegisterByName = function(name, value) {
			var index = this._registerByName[name];
			this.setRegister(index, value);
		};

		/* Local offset */
		this.pushRegOffsetStack = function(count) {
			var regIndex = this._registerByName.REG_OFFSET_STACK;
			this._regOffsetStack.push(this._registerValues[regIndex]);
			this._registerValues[regIndex] += count;
		};

		this.popRegOffsetStack = function() {
			var regIndex = this._registerByName.REG_OFFSET_STACK;
			this._registerValues[regIndex] = this._regOffsetStack.pop();
		};

		this.setGlobalConstants = function(globalConstants, stackOffset) {
			var globalData = this._data;
			for (var i = 0; i < globalConstants.length; i++) {
				var globalConstant 	= globalConstants[i],
					offset 			= globalConstant.offset,
					data 			= globalConstant.data;
				for (var j = 0; j < data.length; j++) {
					globalData[offset + j] = data[j];
				}
			}
			var regIndex = this._registerByName.REG_OFFSET_STACK;
			this._registerValues[regIndex] = stackOffset;
		};

		this.getDataFromRegOffset = function(count) {
			var regOffsetSrc 	= this.getRegisterByName('REG_OFFSET_SRC'),
				result 			= [];

			for (var i = 0; i < count; i++) {
				result[i] = this._data(regOffsetSrc + i);
			}
			return result;
		};

		this.getRecordFromRegOffset = function(recordFields) {
			var regOffsetSrc 	= this.getRegisterByName('REG_OFFSET_SRC'),
				result 			= {};

			for (var i = 0; i < recordFields.length; i++) {
				result[recordFields[i]] = this._data[regOffsetSrc + i];
			}
			return result;
		};
	});
