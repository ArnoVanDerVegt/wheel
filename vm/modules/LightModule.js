(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'vm.modules.LightModule',
        wheel.Class(wheel.vm.modules.VMModule, function(supr) {
            this.run = function(commandId) {
/*
                switch (commandId) {
                    case 0: // SET LIGHT
                        break;

                    default:
                        console.error('Unknown light command "' + commandId + '".');
                        break;
                }
*/
            };
        })
    );
})();