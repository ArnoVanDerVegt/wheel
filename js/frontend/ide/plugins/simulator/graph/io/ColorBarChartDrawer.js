/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const ChartDrawer = require('./ChartDrawer').ChartDrawer;

const colors = [
        '0,0,0',        // Black
        '0,0,0',        // Black
        '52,152,219',   // Blue
        '76,209,55',    // Green
        '241,196,15',   // Yellow
        '232,65,24',    // Red
        '255,255,255',  // White
        '150,75,0'      // Brown
    ];

exports.ColorBarChartDrawer = class extends ChartDrawer {
    draw(buffer, maxValue) {
        let context = this._context;
        let index   = buffer.getCurrentOffset();
        for (let i = 0; i < 21; i++) {
            if (i >= buffer.getCurrentSize()) {
                break;
            }
            let value = Math.min(buffer.getValue(2 + index++), maxValue);
            if (value < 1) {
                continue;
            }
            let x     = i * 13 + 2;
            let y     = 96 * value / maxValue;
            let color = colors[value];
            context.fillStyle   = 'rgb(' + color + ')';
            context.strokeStyle = 'rgba(' + color + ', 0.6)';
            context.lineWidth   = 0.5;
            context.fillRect(x, 96 - y, 9, y);
            context.strokeRect(x + 0.5, 96 - y, 9, y);
        }
    }
};
