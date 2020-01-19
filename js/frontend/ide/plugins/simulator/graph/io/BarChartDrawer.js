/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const ChartDrawer = require('./ChartDrawer').ChartDrawer;

exports.BarChartDrawer = class extends ChartDrawer {
    draw(buffer, maxValue) {
        let context  = this._context;
        let gradient = context.createLinearGradient(0, 0, 0, 96);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
        context.fillStyle   = gradient;
        context.strokeStyle = '#FFFFFF';
        context.lineWidth   = 0.5;

        let index = buffer.getCurrentOffset();
        for (let i = 0; i < 21; i++) {
            if (i >= buffer.getCurrentSize()) {
                break;
            }
            let value = Math.min(buffer.getValue(2 + index++), maxValue) / maxValue;
            let x     = i * 13 + 2;
            let y     = 96 * value;
            context.fillRect(x, 96 - y, 9, y);
            context.strokeRect(x + 0.5, 96 - y, 9, y);
        }
    }
};
