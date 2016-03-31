var CompilerData = Class(function() {
		this.init = function(opts) {
			this._registers = opts.registers;

			this.reset();
		};

		this.reset = function() {
			this._globalIndex 	= 0;
			this._globalList 	= {};

			this._localIndex 	= 0;
			this._localList 	= {};

			this._labelList 	= {};
			this._procedureList = {};
			this._procedure 	= null;
		};

		/* Global */
		this.declareGlobal = function(name) {
			var intList = this._globalList;
			if (name in intList) {
				throw new Error('Duplicate int identifier "' + name + '".');
			}
			intList[name] = this._globalIndex++;
		};

		this.findGlobal = function(name) {
			var intList = this._globalList;
			if (name in intList) {
				return intList[name];
			}
			return null;
		};

		/* Local */
		this.resetLocal = function() {
			this._localIndex 	= 0;
			this._localList 	= {};
		};

		this.declareLocal = function(name) {
			var intList = this._localList;
			if (name in intList) {
				throw new Error('Duplicate int identifier "' + name + '".');
			}
			intList[name] = this._localIndex++;
		};

		this.findLocal = function(name) {
			var intList = this._localList;
			if (name in intList) {
				return intList[name];
			}
			return null;
		};

		this.getLocalIndex = function() {
			return this._localIndex;
		};

		/* Register */
		this.findRegister = function(name) {
			if (name in this._registers) {
				return this._registers[name];
			}
			return null;
		};

		/* Label */
		this.declareLabel = function(name, index) {
			var labelList = this._labelList;
			if (name in labelList) {
				throw new Error('Duplicate label "' + name + '".');
			}
			labelList[name] = index;
		};

		this.findLabel = function(name) {
			if (name in this._labelList) {
				return this._labelList[name];
			}
			return null;
		};

		/* Procedure */
		this.declareProcedure = function(name, command, index) {
			var procedureList = this._procedureList;
			if (name in procedureList) {
				throw new Error('Duplicate procedure "' + name + '".');
			}
			this.resetLocal();
			this._procedure = {
				index: 		index,
				command: 	command
			};
			procedureList[name] = this._procedure;
		};

		this.findProcedure = function(name) {
			if (name in this._procedureList) {
				return this._procedureList[name];
			}
			return null;
		};

		this.getGlobalList = function() {
			return this._globalList;
		};
	});