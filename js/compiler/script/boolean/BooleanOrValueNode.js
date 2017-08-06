(function() {
    var wheel = require('../../../utils/base.js').wheel;

    wheel(
        'compiler.script.boolean.BooleanOrValueNode',
        wheel.Class(wheel.compiler.script.boolean.BooleanNode, function(supr) {
            this.compile = function() {
                var jump = {je: 'jne', jg: 'jle', jl:  'jge', jge: 'jl', jle: 'jg'}[supr(this, 'compile').jump];
                this.addLine(jump + ' ' + this._label + '_' + this._parent.getIndex());
            };
        })
    );
})();

