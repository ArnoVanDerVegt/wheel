(function() {
    var wheel = require('../../../utils/base.js').wheel;

    wheel(
        'compiler.script.statements.Statement',
        wheel.Class(function() {
            this.init = function(opts) {
                this._scriptCompiler = opts.scriptCompiler;
                this._stack          = [];
                this._scriptBreak    = null;
            };

            this.getStack = function() {
                return this._stack;
            };

            this.setScriptBreak = function(scriptBreak) {
                this._scriptBreak = scriptBreak;
                return this;
            };

            this.compile = function(line, params, output) {
                return [];
            };

            this.compileEnd = function(output) {
                return [];
            };
        })
    );
})();
