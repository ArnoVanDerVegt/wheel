(function() {
    var wheel = require('../../utils/base.js').wheel;
    var light = null;

    wheel(
        'vm.modules.LightModule',
        wheel.Class(wheel.vm.modules.VMModule, function(supr) {
            this.run = function(commandId) {
                if (!light) {
                    return;
                }
                var vmData = this._vmData;

                switch (commandId) {
                    case 0: // LIGHT_UPDATE
                        var settings = vmData.getRecordFromAtOffset(['color', 'flash']);
                        light.setColorAndFlash(settings.color, settings.flash);
                        break;

                    default:
                        console.error('Unknown buttons command "' + commandId + '".');
                        break;
                }
            };
        })
    );

    wheel(
        'vm.modules.LightModule.setLight',
        function(l) {
            light = l;
        }
    );
})();