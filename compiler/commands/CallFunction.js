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
                var spacePos = line.indexOf(' ');
                var command;
                if (spacePos === -1) {
                    command = line;
                    params  = '';
                } else {
                    command = line.substr(0, spacePos),
                    params  = line.substr(spacePos - line.length + 1).trim();
                }
                var splitParams      = wheel.compiler.compilerHelper.splitParams(params);
                var validatedCommand = this._compiler.validateCommand(command, splitParams);

                if (command === 'set') {
                    this._setCompiler.compile(validatedCommand, splitParams, params);
                } else {
                    this._numberOperatorCompiler.compile(validatedCommand, splitParams, params);
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