/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const SplineChartDrawer = require('./SplineChartDrawer').SplineChartDrawer;

exports.LineChartDrawer = class extends SplineChartDrawer {
    draw(buffer, maxValue) {
        let getValue = function(index) {
                return Math.min(buffer.getValue(index), maxValue) / maxValue;
            };
        let context = this._context;
        context.strokeStyle = '#E74C3C';

        let index = buffer.getCurrentOffset();
        let first = true;

        context.lineWidth = 2;
        context.beginPath();
        for (let i = 0; i < 22; i++) {
            let x  = i * 13 - 6;
            let y0 = 94 * getValue(index - 1);
            let y1 = 94 * getValue(index);
            let y2 = 94 * getValue(index + 1);
            let y3 = 94 * getValue(index + 2);

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

            index++;
        }
        context.stroke();
    }
};
