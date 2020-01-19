/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const ChartDrawer = require('./ChartDrawer').ChartDrawer;

exports.BinaryChartDrawer = class extends ChartDrawer {
    draw(buffer, maxValue) {
        let context = this._context;
        let index   = buffer.getCurrentOffset();
        for (let i = 0; i < 21; i++) {
            if (i >= buffer.getCurrentSize()) {
                break;
            }
            let x = i * 13 + 6;
            let y = 47.5;
            context.fillStyle = buffer.getValue(2 + index++) ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';
            context.beginPath();
            context.arc(x, y, 4, 0, Math.PI * 2);
            context.closePath();
            context.fill();
            context.strokeStyle = '#FFFFFF';
            context.stroke();
        }
    }

    drawValueGrid() {
        this.drawGrid(['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0)']);
        return this;
    }
};
