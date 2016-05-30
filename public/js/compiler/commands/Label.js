wheel(
	'compiler.commands.Label',
	Class(wheel.compiler.commands.CommandCompiler, function(supr) {
		/**
		 * Check if a line starts with a label...
		**/
		this.hasLabel = function(line) {
			var i = line.indexOf(':');
			if ((line.length > 1) && (i !== -1)) {
				return wheel.compiler.compilerHelper.validateString(line.substr(0, i));
			}
			return false;
		};

		/**
		 * When the compilation is done all label addresses are known,
		 * each label has a list of associated jumps, set the jump value
		 * to the correct label index...
		**/
		this.updateLabels = function() {
			var compiler 		= this._compiler,
				compilerData 	= this._compilerData,
				outputCommands 	= compiler.getOutput().getBuffer(),
				labelList 		= compilerData.getLabelList();

			for (var i in labelList) {
				var label = labelList[i],
					jumps = label.jumps;
				for (var j = 0; j < jumps.length; j++) {
					var outputCommand = outputCommands[jumps[j]];
					outputCommands[jumps[j]].params[0].value = label.index;
				}
			}
		};

		/**
		 * Collect all labels from the lines,
		 * check if they are unique and create a declaration...
		**/
		this.compile = function(lines) {
			var compiler 		= this._compiler,
				compilerData 	= this._compilerData;
			for (var i = 0; i < lines.length; i++) {
				this._lineNumber = i;
				var line 		= lines[i].trim(),
					location 	= {
						filename: 	this._filename,
						lineNumber: i
					};
				if (this.hasLabel(line)) {
					var j = line.indexOf(':');
					if (compilerData.declareLabel(line.substr(0, j), location)) {
						throw compiler.createError('Duplicate label "' + name + '".');
					}
				}
			}
		};
	})
);