/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/

exports.ChartDrawer = class {
    constructor(opts) {
        this._canvas  = opts.canvas;
        this._context = opts.canvas.getContext('2d');
    }

    drawGrid(colors) {
        let context = this._context;
        context.lineWidth = 1;
        for (let i = 0; i < colors.length; i++) {
            let y = Math.floor((95 / (colors.length - 1)) * i) + 0.5;
            context.strokeStyle = colors[i];
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(260 + 13, y);
            context.stroke();
        }
    }

    clear() {
        this._context.clearRect(0, 0, 260 + 13, 96);
        return this;
    }

    drawValueGrid() {
        this.drawGrid(['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 1)']);
        return this;
    }

    draw(buffer, maxValue) {
    }
};
