(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.script.BooleanAndNode',
        wheel.Class(wheel.compiler.script.BooleanNode, function(supr) {
            this.init = function(opts) {
                supr(this, 'init', arguments);
                this._type = 'and';
            };

            this.compile = function() {
                var left  = this._left;
                var right = this._right;

                left.compile();
                right.compile();
                right.getValue() && this.addJumpTrue();
                this.addIndexLabel();
                this._parent || this.addExitLabelLine('jmp ');
            };
        })
    );
})();

