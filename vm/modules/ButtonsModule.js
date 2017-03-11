(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'vm.modules.ButtonsModule',
        wheel.Class(wheel.vm.modules.VMModule, function(supr) {
            this.setEV3Buttons = function(ev3Buttons) {
                this._ev3Buttons = ev3Buttons;
            };

            this.run = function(commandId) {
                switch (commandId) {
                    case 0: // READ BUTTON
                        break;

                    default:
                        console.error('Unknown button command "' + commandId + '".');
                        break;
                }
            };
        })
    );
})();