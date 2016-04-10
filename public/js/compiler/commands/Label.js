var Label = Class(CommandCompiler, function(supr) {
		this.hasLabel = function(line) {
			var i = line.indexOf(':');
			if ((line.length > 1) && (i !== -1)) {
				for (var j = 0; j < i; j++) {
					if ('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_'.indexOf(line[j]) === -1) {
						return false;
					}
				}
				return true;
			}
			return false;
		};

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
					if (outputCommand.code === commands.loop.code) {
						outputCommands[jumps[j]].params[1].value = label.index;
					} else {
						outputCommands[jumps[j]].params[0].value = label.index;
					}
				}
			}
		};

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
	});