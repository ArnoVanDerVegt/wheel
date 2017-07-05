(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.script.BooleanOrNode',
        wheel.Class(wheel.compiler.script.BooleanNode, function(supr) {
            this.init = function(opts) {
                supr(this, 'init', arguments);
                this._type = 'or';
            };

            this.addJumpToParentIndex = function() {
                this.addLine('jmp ' + this._label + '_' + this._parent.getIndex());
            };

            this.compile = function() {
                var left   = this._left;
                var right  = this._right;
                var parent = this._parent;

                left.compile();
                right.compile();
                if (parent && right.getValue()) {
                    if (parent.getParent() && parent.getParent().getOrType()) {
                        this.addJumpToParentIndex();
                    } else {
                        this.addExitLabelLine('jmp ');
                    }
                }
                this.addExitLabelLine('jmp ');
                this.addIndexLabel();
                if (parent) {
                    if (parent.getOrType()) {
                        this.addJumpToParentIndex();
                    } else if (parent.getAndType() && this.getRightSrc()) {
                        this.addJumpTrue();
                    }
                }
            };
        })
	);
})();

