(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'vm.modules.ScreenModule',
        wheel.Class(wheel.vm.modules.VMModule, function(supr) {
/*
            this.run = function(commandId) {
                switch (commandId) {
                    case 0: // SCREEN_CLEAR
                        break;

                    case 1: // SCREEN_DRAW_PIXEL
                        break;

                    case 2: // SCREEN_DRAW_NUM
                        break;

                    case 3: // SCREEN_DRAW_TEXT
                        break;

                    case 4: // SCREEN_DRAW_LINE
                        break;

                    case 5: // SCREEN_DRAW_RECT
                        break;

                    case 6: // SCREEN_DRAW_CIRCLE
                        break;

                    case 7: // SCREEN_DRAW_IMAGE
                        break;

                    default:
                        console.error('Unknown drawing command "' + commandId + '".');
                        break;
                }
            };
*/
        })
    );
})();