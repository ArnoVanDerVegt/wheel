(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'vm.modules.VMModule',
        wheel.Class(wheel.WheelClass, function(supr) {
            this.run = function(commandId) {
            };
        })
    );
})();