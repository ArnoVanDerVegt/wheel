(function() {
    var wheel   = require('../../utils/base.js').wheel;
    var display = null;

    wheel(
        'vm.modules.ScreenModule',
        wheel.Class(wheel.vm.modules.VMModule, function(supr) {
            this.init = function(opts) {
                supr(this, 'init', [opts]);
            };

            this.run = function(commandId) {
                if (!display) {
                    return;
                }
                var vmData = this._vmData;

                switch (commandId) {
                    case 0: // SCREEN_CLEAR
                        break;

                    case 1: // SCREEN_DRAW_PIXEL
                        var drawPixel = vmData.getRecordFromAtOffset(['x', 'y']);
                        display.drawPixel(drawPixel.x, drawPixel.y);
                        display.render();
                        break;

                    case 2: // SCREEN_DRAW_NUM
                        var drawNum = vmData.getRecordFromAtOffset(['x', 'y', 'n']);
                        display.drawText(drawNum.x, drawNum.y, 0, drawNum.n + '');
                        display.render();
                        break;

                    case 3: // SCREEN_DRAW_TEXT
                        var drawText = vmData.getRecordFromAtOffset(['x', 'y', 's']);
                        display.drawText(drawText.x, drawText.y, 0, vmData.getStringList()[drawText.s]);
                        display.render();
                        break;

                    case 4: // SCREEN_DRAW_LINE
                        var drawLine = vmData.getRecordFromAtOffset(['x1', 'y1', 'x2', 'y2']);
                        display.drawLine(drawLine.x1, drawLine.y1, drawLine.x2, drawLine.y2);
                        display.render();
                        break;

                    case 5: // SCREEN_DRAW_RECT
                        var drawLine = vmData.getRecordFromAtOffset(['x', 'y', 'width', 'height']);
                        display.drawRect(drawLine.x, drawLine.y, drawLine.width, drawLine.height);
                        display.render();
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
        })
    );

    wheel(
        'vm.modules.ScreenModule.setDisplay',
        function(d) {
            display = d;
        }
    );
})();