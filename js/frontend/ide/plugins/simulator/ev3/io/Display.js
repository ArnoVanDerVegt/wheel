/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../../../lib/dispatcher').dispatcher;
const TextLarge  = require('./text/TextLarge').TextLarge;
const TextMedium = require('./text/TextMedium').TextMedium;
const TextSmall  = require('./text/TextSmall').TextSmall;
const WIDTH      = 178;
const HEIGHT     = 128;

exports.Display = class {
    constructor(opts) {
        let canvas  = opts.canvas;
        let context = canvas.getContext('2d');
        canvas.width      = WIDTH;
        canvas.height     = HEIGHT;
        this._canvas      = canvas;
        this._context     = context;
        this._loadedCount = 3;
        this._vm          = null;
        this.reset();
        let onLoad = this.onLoad.bind(this);
        this._text = [
            new TextSmall({display: this, onLoad: onLoad}),
            new TextMedium({display: this, onLoad: onLoad}),
            new TextLarge({display: this, onLoad: onLoad})
        ];
        this.clearScreen();
        dispatcher
            .on('VM',               this, this.onVM)
            .on('Screen.ImageData', this, this.onImageData)
            .on('Screen.Ready',     this, this.onReady);
    }

    reset() {
        this._textSize  = 0;
        this._textAlign = 0; // 0 = left, center = 1, right = 2
        this._fill      = false;
        this._fillColor = 1;
        return this;
    }

    onVM(vm) {
        this._vm = vm;
    }

    onImageData(imageData) {
        if (!this._vm || !this._vm.running()) {
            this.clearScreen();
            this._context.putImageData(imageData, 0, 0);
        }
    }

    onReady() {
        if (!this._vm || !this._vm.running()) {
            this.drawReady();
        }
    }

    onLoad() {
        this._loadedCount--;
        if (this._loadedCount) {
            return;
        }
        this.drawCenterText(56, 1, 'Simulator ready.');
        this.render();
    }

    clearScreen() {
        let context   = this._context;
        let fillColor = 128;
        context.fillStyle = 'rgb(' + fillColor + ',' + fillColor + ',' + fillColor + ')';
        context.fillRect(0, 0, WIDTH, HEIGHT);
        this._imageData = context.getImageData(0, 0, WIDTH, HEIGHT);
        this.render();
        return this;
    }

    drawText(x, y, text) {
        let charWidth = this._text[this._textSize].getCharWidth();
        text = text + '';
        switch (this._textAlign) {
            case 0: // Left
                this._text[this._textSize].drawText(x, y, this._fill, text);
                break;
            case 1: // Center
                this._text[this._textSize].drawText(Math.floor(x - text.length * charWidth * 0.5), y, this._fill, text);
                break;
            case 2: // Right
                this._text[this._textSize].drawText(Math.floor(x - text.length * charWidth), y, this._fill, text);
                break;
        }
        this.render();
    }

    drawCenterText(y, size, text) {
        this._text[size].drawText(~~((178 - text.length * 8) * 0.5), y, 0, text);
        this.render();
    }

    drawReady() {
        this.reset();
        this.clearScreen();
        this.drawCenterText(56, 1, 'Simulator ready.');
        this.render();
    }

    drawLoaded(title) {
        if (!title) {
            return;
        }
        if (title.length > 18) {
            title = title.substr(0, 18).trim() + '...';
        }
        this.reset();
        this.clearScreen();
        this.drawCenterText(51, 0, 'Loaded');
        this.drawCenterText(68, 1, title);
        this.render();
    }

    drawPixel(x, y) {
        x = Math.round(x);
        y = Math.round(y);
        if ((x < 0) || (y < 0) || (x >= WIDTH) || (y >= HEIGHT)) {
            return;
        }
        let data   = this._imageData.data;
        let offset = (y * WIDTH + x) * 4;
        let color  = this.getColor();
        data[offset++] = color;
        data[offset++] = color;
        data[offset++] = color;
        data[offset++] = 255;
        this.render();
    }

    drawLine(x1, y1, x2, y2) {
        x1 = Math.round(x1);
        y1 = Math.round(y1);
        x2 = Math.round(x2);
        y2 = Math.round(y2);
        let dx    = Math.abs(x2 - x1);
        let dy    = Math.abs(y2 - y1);
        let sx    = (x1 < x2) ? 1 : -1;
        let sy    = (y1 < y2) ? 1 : -1;
        let error = dx - dy;
        this.drawPixel(x1, y1);
        while (!((x1 === x2) && (y1 === y2))) {
            this.drawPixel(x1, y1);
            let e2 = error << 1;
            if (e2 > -dy) {
                error -= dy;
                x1 += sx;
            }
            if (e2 < dx) {
                error += dx;
                y1 += sy;
            }
        }
    }

    drawLineHorizontal(x, y, width) {
        x     = Math.round(x);
        y     = Math.round(y);
        width = Math.round(width);
        if ((y < 0) || (y >= HEIGHT) || (x >= WIDTH) || (x + WIDTH < 0) || (width <= 0)) {
            return;
        }
        if (x + width >= WIDTH) {
            width -= x + width - WIDTH;
        }
        if (x < 0) {
            width += x;
            x = 0;
        }
        let data   = this._imageData.data;
        let offset = (y * WIDTH + x) * 4;
        let color  = this.getColor();
        for (let i = 0; i < width; i++) {
            data[offset++] = color;
            data[offset++] = color;
            data[offset++] = color;
            data[offset++] = 255;
        }
    }

    drawLineVertical(x, y, height) {
        x      = Math.round(x);
        y      = Math.round(y);
        height = Math.round(height);
        if ((x < 0) || (x >= WIDTH) || (y >= HEIGHT) || (y + HEIGHT < 0) || (height <= 0)) {
            return;
        }
        if (y + height >= HEIGHT) {
            height -= y + height - HEIGHT;
        }
        if (y < 0) {
            height += y;
            y = 0;
        }
        let data   = this._imageData.data;
        let offset = (y * WIDTH + x) * 4;
        let color  = this.getColor();
        for (let i = 0; i < height; i++) {
            data[offset++] = color;
            data[offset++] = color;
            data[offset++] = color;
            data[offset++] = 255;
            offset += (WIDTH - 1) * 4;
        }
    }

    drawStrokeRect(x, y, width, height) {
        this.drawLineHorizontal(x, y, width);
        this.drawLineVertical(x, y, height);
        this.drawLineHorizontal(x, y + height - 1, width);
        this.drawLineVertical(x + width - 1, y, height);
    }

    drawFillRect(x, y, width, height) {
        if ((x >= WIDTH) ||
            (x + width < 0) ||
            (y >= HEIGHT) ||
            (y + height < 0) ||
            (width <= 0) ||
            (height <= 0)) {
            return;
        }
        if (y < 0) {
            height += y;
            y = 0;
        }
        if (y + height >= HEIGHT) {
            height -= y + height - HEIGHT;
        }
        for (let i = y; i < y + height; i++) {
            this.drawLineHorizontal(x, i, width);
        }
    }

    drawRect(x, y, width, height) {
        x      = Math.round(x);
        y      = Math.round(y);
        width  = Math.round(width);
        height = Math.round(height);
        this._fill ?
            this.drawFillRect(x, y, width, height) :
            this.drawStrokeRect(x, y, width, height);
        this.render();
    }

    drawStrokeCircle(x, y, radius) {
        if ((x + radius < 0) || (y + radius < 0) || (x - radius >= WIDTH) || (y - radius >= HEIGHT)) {
            return;
        }
        let a             = radius;
        let b             = 0;
        let decisionOver2 = 1 - a;   // Decision criterion divided by 2 evaluated at x=r, y=0
        while (a >= b) {
            this.drawPixel(x + a, y + b);
            this.drawPixel(x - a, y + b);

            this.drawPixel(x + b, y + a);
            this.drawPixel(x - b, y + a);

            this.drawPixel(x - a, y - b);
            this.drawPixel(x + a, y - b);

            this.drawPixel(x - b, y - a);
            this.drawPixel(x + b, y - a);
            b++;
            if (decisionOver2 <= 0) {
                decisionOver2 += 2 * b + 1; // Change in decision criterion for y -> y+1
            } else {
                a--;
                decisionOver2 += 2 * (b - a) + 1; // Change for y -> y+1, x -> x-1
            }
        }
    }

    drawFillCircle(x, y, radius) {
        if ((x + radius < 0) || (y + radius < 0) || (x - radius >= WIDTH) || (y - radius >= HEIGHT)) {
            return;
        }
        let a             = radius;
        let b             = 0;
        let decisionOver2 = 1 - a;   // Decision criterion divided by 2 evaluated at x=r, y=0
        let lines         = [];
        let minY          = HEIGHT;
        let maxY          = 0;
        let addPoints = function(x1, x2, y) {
                if ((y >= 0) && (y < HEIGHT)) {
                    if (x1 > x2) {
                        let i = x1;
                        x1 = x2;
                        x2 = i;
                    }
                    minY = Math.min(y, minY);
                    maxY = Math.max(y, maxY);
                    lines[y] = {
                        x1: x1,
                        x2: x2
                    };
                }
            };

        while (a >= b) {
            addPoints(x - a, x + a, y + b);
            addPoints(x - b, x + b, y + a);
            addPoints(x - a, x + a, y - b);
            addPoints(x - b, x + b, y - a);

            b++;
            if (decisionOver2 <= 0) {
                decisionOver2 += 2 * b + 1; // Change in decision criterion for y -> y+1
            } else {
                a--;
                decisionOver2 += 2 * (b - a) + 1; // Change for y -> y+1, x -> x-1
            }
        }

        for (y = minY; y <= maxY; y++) {
            let line = lines[y];
            this.drawLineHorizontal(line.x1, y, line.x2 - line.x1);
        }
    }

    drawCircle(x, y, radius) {
        x      = Math.round(x);
        y      = Math.round(y);
        radius = Math.round(radius);
        this._fill ?
            this.drawFillCircle(x, y, radius) :
            this.drawStrokeCircle(x, y, radius);
        this.render();
    }

    drawImage(x, y, data) {
        x = Math.round(x);
        y = Math.round(y);
        let fillColor = (this._fillColor + 1) & 1;
        let imageData = this._imageData.data;
        for (let j = 0; j < data.length; j++) {
            let line   = data[j];
            let offset = ((y + j) * WIDTH + x) * 4;
            for (let i = 0; i < line.length; i++) {
                let b = y + j;
                let a = x + i;
                if ((a >= 0) && (b >=0) && (x < WIDTH) && (b <= HEIGHT)) {
                    let color = ((line[i] + fillColor) & 1) ? 0 : 128;
                    imageData[offset++] = color;
                    imageData[offset++] = color;
                    imageData[offset++] = color;
                    imageData[offset++] = 255;
                } else {
                    offset += 4;
                }
            }
        }
        this.render();
    }

    render() {
        let context = this._context;
        context.clearRect(0, 0, WIDTH, HEIGHT);
        context.putImageData(this._imageData, 0, 0);
    }

    getColor() {
        return this._fillColor ? 0 : 128;
    }

    getWidth() {
        return WIDTH;
    }

    getHeight() {
        return HEIGHT;
    }

    getImageData() {
        return this._imageData;
    }

    setFill(fill) {
        this._fill = fill;
    }

    setFillColor(fillColor) {
        this._fillColor = fillColor;
    }

    setTextSize(textSize) {
        this._textSize = textSize % 3;
    }

    setTextAlign(textAlign) {
        this._textAlign = textAlign % 3;
    }
};
