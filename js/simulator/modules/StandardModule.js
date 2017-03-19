(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'vm.modules.StandardModule',
        wheel.Class(wheel.vm.modules.VMModule, function(supr) {
            this.run = function(commandId) {
                var vm     = this._vm;
                var vmData = this._vmData;

                switch (commandId) {
                    case 2: // STANDARD_SLEEP
                        this._vm.pause();
                        var sleep = vmData.getRecordFromAtOffset(['milliseconds']);

                        setTimeout(
                            function() {
                                vm.resume();
                            },
                            sleep.milliseconds
                        )
                        break;
                }
            };
        })
    );
})();
