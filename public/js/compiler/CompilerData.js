var CompilerData = Class(function() {
		this.init = function(opts) {
			this._compiler 	= opts.compiler;
			this._registers = opts.registers;

			this.reset();
		};

		this.reset = function() {
			this._globalOffset 	= 0;
			this._globalList 	= {};

			this._localOffset 	= 0;
			this._localList 	= {};

			this._labelList 	= {};
			this._procedureList = {};
			this._procedure 	= null;
		};

		this._parseVariable = function(name) {
			var length 	= 1,
				i 		= name.indexOf('[');
			if (i !== -1) {
				if (name[name.length - 1] === ']') {
					length = parseInt(name.substr(i + 1, name.length - i - 2), 10);
					if (isNaN(length)) {

					}
					name = name.substr(0, i);
				} else {
					throw this._compiler.createError('"]" expected.');
				}
			}
			return {
				name: 	name,
				length: length
			}
		}

		/* Global */
		this.declareGlobal = function(name, type, arrayType) {
			var vr 			= this._parseVariable(name);
				globalList 	= this._globalList;

			if (vr.name in globalList) {
				throw this._compiler.createError('Duplicate int identifier "' + vr.name + '".');
			}

			globalList[vr.name] = {
				type: 	(vr.length === 1) ? type : arrayType,
				offset: this._globalOffset,
				size: 	1,
				length: vr.length
			};
			this._globalOffset += vr.length;
		};

		this.findGlobal = function(name) {
			var globalList = this._globalList;
			if (name in globalList) {
				return globalList[name];
			}
			return null;
		};

		/* Local */
		this.resetLocal = function() {
			this._localOffset 	= 0;
			this._localList 	= {};
		};

		this.declareLocal = function(name, type, arrayType) {
			var vr 			= this._parseVariable(name);
				localList 	= this._localList;

			if (vr.name in localList) {
				throw this._compiler.createError('Duplicate int identifier "' + vr.name + '".');
			}

			localList[vr.name] = {
				type: 	(vr.length === 1) ? type : arrayType,
				offset: 	this._localOffset,
				size: 		1,
				length: 	vr.length
			};

			this._localOffset += vr.length;
		};

		this.findLocal = function(name) {
			var localList = this._localList;
			if (name in localList) {
				return localList[name];
			}
			return null;
		};

		this.getLocalOffset = function() {
			return this._localOffset;
		};

		/* Register */
		this.findRegister = function(name) {
			if (name in this._registers) {
				return this._registers[name];
			}
			return null;
		};

		/* Label */
		this.declareLabel = function(name) {
			var labelList = this._labelList;
			if (name in labelList) {
				return true;
			}
			labelList[name] = {
				index: null,
				jumps: []
			};
			return false;
		};

		this.findLabel = function(name) {
			if (name in this._labelList) {
				return this._labelList[name];
			}
			return null;
		};

		this.getLabelList = function() {
			return this._labelList;
		};

		/* Procedure */
		this.declareProcedure = function(name, command, index) {
			var procedureList = this._procedureList;
			if (name in procedureList) {
				throw this._compiler.createError('Duplicate procedure "' + name + '".');
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