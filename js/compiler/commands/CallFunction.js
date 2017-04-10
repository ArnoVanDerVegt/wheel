(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.commands.CallFunction',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            this.init = function() {
                supr(this, 'init', arguments);

                this._callCompiler           = null;
                this._setCompiler            = null;
                this._numberOperatorCompiler = null;
            };

            this.setCallCompiler = function(callCompiler) {
                this._callCompiler = callCompiler;
            };

            this.setSetCompiler = function(setCompiler) {
                this._setCompiler = setCompiler;
            };

            this.setNumberOperatorCompiler = function(numberOperatorCompiler) {
                this._numberOperatorCompiler = numberOperatorCompiler;
            };

            this.compileSet = function(line) {
                var commandAndParams = this._compiler.getCommandAndParams(line);
                var splitParams      = wheel.compiler.compilerHelper.splitParams(this._compiler, commandAndParams.params);
                var validatedCommand = this._compiler.validateCommand(commandAndParams.command, splitParams);

                if (commandAndParams.command === 'set') {
                    this._setCompiler.compile(validatedCommand, splitParams, commandAndParams.params);
                } else {
                    this._numberOperatorCompiler.compile(validatedCommand, splitParams, commandAndParams.params);
                }
            };

            this.compile = function(line) {
                var j = line.indexOf(',');

                this._callCompiler.compile(line.substr(j + 1 - line.length).trim());
                this.compileSet(line.substr(0, j).trim() + ', _____GLOBAL_REG_RETURN_____');
            };
        })
    );
})();