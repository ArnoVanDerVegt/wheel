/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const ChartDrawer = require('./ChartDrawer').ChartDrawer;

const colors = [
        '0,0,0',        // 0 Black
        '0,0,0',        // 1 Black
        '0,50,255',     // 2 Blue
        '76,209,55',    // 3 Green
        '241,196,15',   // 4 Yellow
        '232,65,24',    // 5 Red
        '255,255,255',  // 6 White
        '150,75,0',     // 7 Brown
        '238,130,238',  // 8 Violet
        '50,127,200'    // 9 Azure
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
            if (value in colors) {
                let color = colors[value];
                let x     = i * 13 + 2;
                let y     = 48 - 12;
                context.fillStyle   = 'rgb(' + color + ')';
                context.strokeStyle = 'rgba(' + color + ', 0.6)';
                context.lineWidth   = 0.5;
                context.fillRect(x, y, 9, 24);
                context.strokeRect(x + 0.5, y, 9, 24);
            }
        }
    }
};
