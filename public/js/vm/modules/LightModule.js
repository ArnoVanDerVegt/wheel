(function() {
    var wheel = require('../../utils/base.js');

    wheel(
        'vm.modules.LightModule',
        wheel.Class(wheel.vm.modules.VMModule, function(supr) {
            this.setEV3Buttons = function(ev3Buttons) {
                this._ev3Buttons = ev3Buttons;
            };

            this.run = function(commandId) {
                var vmData = this._vmData;

                switch (commandId) {
                    case 0: // SET LIGHT
                        var lightRecord = vmData.getRecordFromAtOffset(['color', 'flash']);
                        this._ev3Buttons.setLight(lightRecord.color, lightRecord.flash);
                        break;

                    default:
                        console.error('Unknown light command "' + commandId + '".');
                        break;
                }
            };
        })
    );
})();