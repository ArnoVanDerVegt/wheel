/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const LineChartDrawer = require('./LineChartDrawer').LineChartDrawer;

exports.FillChartDrawer = class extends LineChartDrawer {
    draw(buffer, maxValue) {
        let getValue = function(index) {
                return Math.min(buffer.getValue(index), maxValue) / maxValue;
            };
        let context = this._context;
        let index   = buffer.getCurrentOffset();

        context.lineWidth   = 2;
        context.fillStyle   = '#000000';
        context.strokeStyle = '#000000';
        context.globalAlpha = 0.5;
        for (let i = 0; i < 19; i++) {
            if (i >= buffer.getCurrentSize()) {
                break;
            }
            let x  = i * 13 + 6;
            let y0 = 94 * getValue(index - 1);
            let y1 = 94 * getValue(index);
            let y2 = 94 * getValue(index + 1);
            let y3 = 94 * getValue(index + 2);

            context.beginPath();
            let first = true;
            for (let j = 0; j < 14; j++) {
                let xx = x + j;
                let y  = this.spline(y0, y1, y2, y3, j / 13);
                if (first) {
                    context.moveTo(xx, 96 - y);
                    first = false;
                } else {
                    context.lineTo(xx, 96 - y);
                }
            }
            context.lineTo(x + 13, 96);
            context.lineTo(x, 96);
            context.closePath();
            context.fill();

            index++;
        }
        context.globalAlpha = 1;

        super.draw(buffer);
    }
};
