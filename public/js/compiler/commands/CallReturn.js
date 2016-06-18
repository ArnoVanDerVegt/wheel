wheel(
    'compiler.commands.CallReturn',
    Class(wheel.compiler.commands.CommandCompiler, function(supr) {
        this.init = function() {
            supr(this, 'init', arguments);

            this._setCompiler = null;
        };

        this.setSetCompiler = function(setCompiler) {
            this._setCompiler = setCompiler;
        };

        this.compile = function(command) {
            command.command = 'set';
            command.code    = wheel.compiler.command.set.code;
            command.params.unshift({type: wheel.compiler.command.T_NUMBER_REGISTER, value: this._compilerData.findRegister('REG_RETURN').index});

            this._setCompiler.compile(command);

            this._compiler.getOutput().add({
                command: 'ret',
                code:    wheel.compiler.command.ret.code
            });
        };
    })
);