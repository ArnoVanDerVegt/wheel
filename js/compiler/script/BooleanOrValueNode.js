(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.script.BooleanOrValueNode',
        wheel.Class(wheel.compiler.script.BooleanNode, function(supr) {
            this.compile = function() {
                var jump = {je: 'jne', jg: 'jle', jl:  'jge', jge: 'jl', jle: 'jg'}[supr(this, 'compile').jump];
                this.addLine(jump + ' ' + this._label + '_' + this._parent.getIndex());
            };
        })
    );
})();

