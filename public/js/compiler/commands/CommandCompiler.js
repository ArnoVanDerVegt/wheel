wheel(
	'compiler.commands.CommandCompiler',
	Class(function() {
		this.init = function(opts) {
			this._compiler 		= opts.compiler;
			this._compilerData 	= opts.compilerData;
			this._filename 		= '';
			this._lineNumber	= 0;
		};

		this.setLocation = function(location) {
			this._filename 		= location.filename;
			this._lineNumber 	= location.lineNumber;
		};
	})
);