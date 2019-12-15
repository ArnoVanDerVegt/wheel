/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const pens = [
        [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 1, 1, 1, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0]
        ],
        [
            [0, 0, 1, 0, 0],
            [0, 1, 1, 1, 0],
            [1, 1, 1, 1, 1],
            [0, 1, 1, 1, 0],
            [0, 0, 1, 0, 0]
        ],
        [
            [0, 1, 1, 1, 0],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [0, 1, 1, 1, 0]
        ]
    ];

const TRANSPARENT = 2;

exports.TRANSPARENT = TRANSPARENT;

exports.Image = class {
    constructor(opts) {
        this.initImageData(opts.value.width, opts.value.height);
        this._imageEditorState = opts.imageEditorState;
        this._canvas           = null;
        this._context          = opts.canvas.getContext('2d');
        this._currentUndo      = {};
        this.setValue(opts.value);
    }

    initImageData(width, height) {
        if (!this._canvas) {
            this._canvas = document.createElement('Canvas');
        }
        let context = this._canvas.getContext('2d');
        this._imageData = context.createImageData(width, height);
        let data   = this._imageData.data;
        let offset = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                data[offset++] = 128;
                data[offset++] = 128;
                data[offset++] = 128;
                data[offset++] = 255;
            }
        }
    }

    addPixels(result, pixels) {
        for (let i = 0; i < pixels.length; i++){
            let pixel = pixels[i];
            let s     = pixel.x + '_' + pixel.y + '_' + pixel.color;
            if (!this._currentUndo[s]) {
                this._currentUndo[s] = true;
                result.push(pixel);
            }
        }
        return this;
    }

    drawPixel(x, y, color) {
        let value = this._value;
        if ((x < 0) || (y < 0) || (x >= value.width) || (y >= value.height)) {
            return null;
        }
        let context   = this._context;
        let pixelSize = this._imageEditorState.getPixelSize();
        context.fillStyle = color ? '#000000' : '#FFFFFF';
        context.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        let result = value.image[y][x];
        value.image[y][x] = color;
        let data   = this._imageData.data;
        let offset = (y * value.width + x) * 4;
        color = color ? 0 : 128;
        data[offset++] = color;
        data[offset++] = color;
        data[offset++] = color;
        data[offset++] = 255;
        return {x: x, y: y, color: result};
    }

    drawPixels(x, y) {
        let result           = [];
        let imageEditorState = this._imageEditorState;
        let color            = imageEditorState.getStroke();
        let pen              = pens[imageEditorState.getSize()];
        x -= 2;
        y -= 2;
        for (let j = 0; j < 5; j++) {
            for (let i = 0; i < 5; i++) {
                if (pen[j][i]) {
                    let pixel = this.drawPixel(x + i, y + j, color);
                    pixel && result.push(pixel);
                }
            }
        }
        return result;
    }

    drawLastLine(lastLine) {
        for (let i = lastLine.length - 1; i >= 0; i--) {
            let pixel = lastLine[i];
            pixel && this.drawPixel(pixel.x, pixel.y, pixel.color);
        }
        return this;
    }

    drawLine(x1, y1, x2, y2) {
        let result           = [];
        let imageEditorState = this._imageEditorState;
        let color            = imageEditorState.getStroke();
        let dx               = Math.abs(x2 - x1);
        let dy               = Math.abs(y2 - y1);
        let sx               = (x1 < x2) ? 1 : -1;
        let sy               = (y1 < y2) ? 1 : -1;
        let error            = dx - dy;
        this.drawPixel(x1, y1);
        while (!((x1 === x2) && (y1 === y2))) {
            this.addPixels(result, this.drawPixels(x1, y1, color));
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
        return result;
    }

    drawLastRect(lastRect) {
        for (let i = 0; i < lastRect.length; i++) {
            this.drawLastLine(lastRect[i]);
        }
    }

    drawRect(x1, y1, x2, y2) {
        let result = [];
        let stroke = this._imageEditorState.getStroke();
        let fill   = this._imageEditorState.getFill();
        if (fill !== TRANSPARENT) {
            for (let y = y1 + 1; y < y2; y++) {
                for (let x = x1 + 1; x < x2; x++) {
                    let pixel = this.drawPixel(x, y, fill);
                    pixel && result.push(pixel);
                }
            }
        }
        if (stroke !== TRANSPARENT) {
            for (let x = x1; x <= x2; x++) {
                this
                    .addPixels(result, this.drawPixels(x, y1, stroke))
                    .addPixels(result, this.drawPixels(x, y2, stroke));
            }
            for (let y = y1 + 1; y < y2; y++) {
                this
                    .addPixels(result, this.drawPixels(x1, y, stroke))
                    .addPixels(result, this.drawPixels(x2, y, stroke));
            }
        }
        return result;
    }

    drawCircle(x1, y1, x2, y2) {
        let pixel;
        let result        = [];
        let stroke        = this._imageEditorState.getStroke();
        let fill          = this._imageEditorState.getFill();
        let x             = x1;
        let y             = y1;
        let width         = x2 - x1;
        let height        = y2 - y1;
        let radius        = Math.round(Math.sqrt(width * width + height * height));
        let a             = radius;
        let b             = 0;
        let decisionOver2 = 1 - a; // Decision criterion divided by 2 evaluated at x=r, y=0
        let minY          = 128;
        let maxY          = 0;
        while (a >= b) {
            if (fill !== TRANSPARENT) {
                for (let i = x - a; i < x - b; i++) {
                    pixel = this.drawPixel(i, y - b, fill);
                    pixel && result.push(pixel);
                    pixel = this.drawPixel(i, y + b, fill);
                    pixel && result.push(pixel);
                }
                for (let i = x + b; i < x + a; i++) {
                    pixel = this.drawPixel(i, y - b, fill);
                    pixel && result.push(pixel);
                    pixel = this.drawPixel(i, y + b, fill);
                    pixel && result.push(pixel);
                }
                for (let i = y - a; i <= y - b; i++) {
                    pixel = this.drawPixel(x - b, i, fill);
                    pixel && result.push(pixel);
                    pixel = this.drawPixel(x + b, i, fill);
                    pixel && result.push(pixel);
                }
                for (let i = y + b; i < y + a; i++) {
                    pixel = this.drawPixel(x - b, i, fill);
                    pixel && result.push(pixel);
                    pixel = this.drawPixel(x + b, i, fill);
                    pixel && result.push(pixel);
                }
            }
            if (stroke !== TRANSPARENT) {
                this
                    .addPixels(result, this.drawPixels(x + a, y + b, stroke))
                    .addPixels(result, this.drawPixels(x - a, y + b, stroke))
                    .addPixels(result, this.drawPixels(x + b, y + a, stroke))
                    .addPixels(result, this.drawPixels(x - b, y + a, stroke))
                    .addPixels(result, this.drawPixels(x - a, y - b, stroke))
                    .addPixels(result, this.drawPixels(x + a, y - b, stroke))
                    .addPixels(result, this.drawPixels(x - b, y - a, stroke))
                    .addPixels(result, this.drawPixels(x + b, y - a, stroke));
            }
            b++;
            if (decisionOver2 <= 0) {
                decisionOver2 += 2 * b + 1; // Change in decision criterion for y -> y+1
            } else {
                a--;
                decisionOver2 += 2 * (b - a) + 1; // Change for y -> y+1, x -> x-1
            }
        }
        return result;
    }

    drawData(x, y, data) {
        let result = [];
        let image  = this._value.image;
        for (let j = 0; j < data.length; j++) {
            for (let i = 0; i < data[0].length; i++) {
                let a = x + i;
                let b = y + j;
                if (this.getXInRange(a) && this.getYInRange(b)) {
                    let color0 = data[j][i];
                    let color1 = image[b][a];
                    if (color0 !== color1) {
                        let pixel = this.drawPixel(a, b, color0);
                        pixel && result.push(pixel);
                    }
                }
            }
        }
        return result.length ? result : null;
    }

    drawDataConditional(x, y, data) {
        let fill   = this._imageEditorState.getFill();
        let stroke = this._imageEditorState.getStroke();
        let result = [];
        let image  = this._value.image;
        let pixel;
        for (let j = 0; j < data.length; j++) {
            for (let i = 0; i < data[0].length; i++) {
                let a = x + i;
                let b = y + j;
                if (this.getXInRange(a) && this.getYInRange(b)) {
                    let color0 = data[j][i];
                    let color1 = image[b][a];
                    if (color0) {
                        if (stroke !== TRANSPARENT) {
                            color0 = stroke;
                            if (color0 !== color1) {
                                pixel = this.drawPixel(a, b, color0);
                                pixel && result.push(pixel);
                            }
                        }
                    } else if (fill !== TRANSPARENT) {
                        color0 = fill;
                        if (color0 !== color1) {
                            pixel = this.drawPixel(a, b, color0);
                            pixel && result.push(pixel);
                        }
                    }
                }
            }
        }
        return result.length ? result : null;
    }

    setValue(value) {
        this.initImageData(value.width, value.height);
        this._value = value;
        let image = value.image;
        for (let y = 0; y < value.height; y++) {
            let line = image[y];
            for (let x = 0; x < value.width; x++) {
                this.drawPixel(x, y, line[x]);
            }
        }
    }

    getImageData() {
        return this._imageData;
    }

    getXInRange(x) {
        return (x >= 0) && (x < this._value.width);
    }

    getYInRange(y) {
        return (y >= 0) && (y < this._value.height);
    }

    getWidth() {
        return this._value.width;
    }

    getHeight() {
        return this._value.height;
    }

    getValue() {
        let value = this._value;
        return {
            width:  value.width,
            height: value.height,
            image:  JSON.parse(JSON.stringify(value.image))
        };
    }

    getMeta(filename) {
        let value  = this._value;
        let image  = value.image;
        let result = '<span class="red italic">#image</span> <span class="green italic">"' + filename + '"</span>\n';
        for (let y = 0; y < value.height; y++) {
            result += '<span class="red italic">#data</span> <span class="green italic">"' + image[y].join('') + '"</span>\n';
        }
        return result;
    }

    getResizedImage(width, height) {
        let value = this.getValue();
        let image = value.image;
        while (image.length < height) {
            let line = [];
            for (let i = 0; i < width; i++) {
                line.push(0);
            }
            image.push(line);
        }
        while (image.length > height) {
            image.pop();
        }
        for (let y = 0; y < image.length; y++) {
            let line = image[y];
            while (line.length < width) {
                line.push(0);
            }
            while (line.length > width) {
                line.pop();
            }
            image[y] = line;
        }
        value.width  = width;
        value.height = height;
        return value;
    }

    resetLastPixels() {
        this._currentUndo = {};
    }

    copyRange(x1, y1, x2, y2) {
        let result = [];
        let image  = this._value.image;
        for (let y = y1; y < y2; y++) {
            let line = [];
            for (let x = x1; x < x2; x++) {
                line.push(image[y][x]);
            }
            result.push(line);
        }
        return result;
    }

    render() {
        let value     = this._value;
        let width     = value.width;
        let height    = value.height;
        let image     = value.image;
        let context   = this._context;
        let pixelSize = this._imageEditorState.getPixelSize();
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                context.fillStyle = image[y][x] ? '#000000' : '#FFFFFF';
                context.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
        }
    }
};
