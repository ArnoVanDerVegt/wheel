(function() {
    var wheel = require('../../../utils/base.js').wheel;

    wheel(
        'compiler.script.boolean.BooleanRootNode',
        wheel.Class(wheel.compiler.script.boolean.BooleanNode, function(supr) {
            this.compile = function() {
                this.addExitLabelLine(supr(this, 'compile').jump + ' ');
            };
        })
    );
})();

