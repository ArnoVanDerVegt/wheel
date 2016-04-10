var CompilerOutput = Class(function() {
		this.init = function(opts) {
			this._buffer 	= [];
			this._mainIndex = 0;
		};

		this.add = function(outputCommand) {
			if (!outputCommand.params) {
				outputCommand.params = [];
			}
			while (outputCommand.params.length < 2) {
				outputCommand.params.push({type: '', value: 0});
			}
			this._buffer.push(outputCommand);
		};

		this.reset = function() {
			this._buffer.length = 0;
			this._mainIndex 	= 0;
		};

		this.getBuffer = function() {
			return this._buffer;
		};

		this.getLength = function() {
			return this._buffer.length;
		};

		this.getMainIndex = function() {
			return this._mainIndex;
		};

		this.setMainIndex = function(mainIndex) {
			this._mainIndex = mainIndex;
		};

		this.optimizeTypes = function() {
			var buffer = this._buffer;
			for (var i = 0; i < buffer.length; i++) {
				var outputCommand 	= buffer[i],
					params 			= outputCommand.params;
				for (var j = 0; j < params.length; j++) {
					switch (params[j].type) {
						case T_PROC:
							params[j].type = T_NUMBER_CONSTANT;
							break;

						case T_PROC_GLOBAL:
							params[j].type = T_NUMBER_GLOBAL;
							break;

						case T_PROC_GLOBAL_ARRAY:
							params[j].type = T_NUMBER_GLOBAL_ARRAY;
							break;

						case T_PROC_LOCAL:
							params[j].type = T_NUMBER_LOCAL;
							break;

						case T_PROC_LOCAL_ARRAY:
							params[j].type = T_NUMBER_LOCAL_ARRAY;
							break;
					}
				}
			}
		};
	});