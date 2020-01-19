/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const ChartDrawer = require('./ChartDrawer').ChartDrawer;

exports.PointChartDrawer = class extends ChartDrawer {
    draw(buffer, maxValue) {
        let context  = this._context;
        context.strokeStyle = '#FFFFFF';
        context.fillStyle   = 'rgba(255, 255, 255, 0.5)';

        let index = buffer.getCurrentOffset();
        let first = true;

        context.lineWidth = 1;
        for (let i = 0; i < 19; i++) {
            if (i >= buffer.getCurrentSize()) {
                break;
            }
            let value = Math.min(buffer.getValue(index), maxValue) / maxValue;
            let x     = i * 13 + 7;
            let y     = 96 - 94 * value;
            context.beginPath();
            context.arc(x, y, 3, 0, Math.PI * 2);
            context.closePath();
            context.fill();
            context.stroke();

            index++;
        }
    }
};
