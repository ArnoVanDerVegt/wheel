(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.script.BooleanRootNode',
        wheel.Class(wheel.compiler.script.BooleanNode, function(supr) {
            this.compile = function() {
                this.addExitLabelLine(supr(this, 'compile').jump + ' ');
            };
        })
    );
})();

