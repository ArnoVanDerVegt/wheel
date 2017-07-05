(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.script.BooleanAndValueNode',
        wheel.Class(wheel.compiler.script.BooleanNode, function(supr) {
            this.compile = function() {
                this.addLine(supr(this, 'compile').jump + ' ' + this._label + '_' + this._parent.getIndex());
            };
        })
    );
})();

