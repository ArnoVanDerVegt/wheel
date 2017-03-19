(function() {
    var wheel   = require('../../utils/base.js').wheel;
    var buttons = null;

    wheel(
        'vm.modules.ButtonsModule',
        wheel.Class(wheel.vm.modules.VMModule, function(supr) {
            this.run = function(commandId) {
                if (!buttons) {
                    return;
                }
                var vmData = this._vmData;

                switch (commandId) {
                    case 0: // BUTTON_READ
                        vmData.setNumberAtRegOffset(buttons.readButton());
                        break;

                    default:
                        console.error('Unknown buttons command "' + commandId + '".');
                        break;
                }
            };
        })
    );

    wheel(
        'vm.modules.ButtonsModule.setButtons',
        function(b) {
            buttons = b;
        }
    );
})();