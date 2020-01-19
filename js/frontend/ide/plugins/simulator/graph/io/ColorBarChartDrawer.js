/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const ChartDrawer = require('./ChartDrawer').ChartDrawer;

const colors = [
        '0,0,0',        // Black
        '0,0,0',        // Black
        '0,0,255',      // Blue
        '0,128,0',      // Green
        '255,255,0',    // Yellow
        '255,0,0',      // Red
        '255,255,255',  // White
        '139,69,19'     // Brown
    ];

exports.ColorBarChartDrawer = class extends ChartDrawer {
    draw(buffer, maxValue) {
        let context = this._context;
        let index   = buffer.getCurrentOffset();
        for (let i = 0; i < 20; i++) {
            if (i >= buffer.getCurrentSize()) {
                break;
            }
            let value = Math.min(buffer.getValue(index++), maxValue);
            if (value < 1) {
                continue;
            }
            let x        = i * 13 + 2;
            let y        = 96 * value / maxValue;
            let color    = colors[value];
            let gradient = context.createLinearGradient(0, 0, 0, 96);
            gradient.addColorStop(0, 'rgba(' + color + ', 0.6)');
            gradient.addColorStop(1, 'rgba(' + color + ', 0.1)');
            context.fillStyle   = gradient;
            context.strokeStyle = 'rgb(' + color + ')';
            context.lineWidth   = 0.5;
            context.fillRect(x, 96 - y, 9, y);
            context.strokeRect(x + 0.5, 96 - y, 9, y);
        }
    }
};
