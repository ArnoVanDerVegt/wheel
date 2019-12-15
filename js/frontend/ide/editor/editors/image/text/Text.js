/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
class Char {
    constructor(opts) {
        this._data   = opts.data;
        this._width  = opts.width;
        this._height = opts.height;
        this.scan();
    }

    scan() {
        let data  = this._data;
        let found = false;
        let minX  = 0;
        while ((minX < this._width) && !found) {
            for (let y = 0; (y < this._height) && !found; y++) {
                if (data[y][minX]) {
                    if (minX > 0) {
                        minX--;
                    }
                    found = true;
                }
            }
            if (!found) {
                minX++;
            }
        }
        this._minX = minX;
        found = false;
        let maxX = this._width - 1;
        while ((maxX > 0) && !found) {
            for (let y = 0; (y < this._height) && !found; y++) {
                if (data[y][maxX]) {
                    if (maxX < this._width) {
                        maxX++;
                    }
                    found = true;
                }
            }
            if (!found) {
                maxX--;
            }
        }
        this._maxX = maxX;
    }

    getWidth(monospace) {
        return monospace ? this._width : (this._maxX - this._minX);
    }

    getHeight() {
        return this._height;
    }

    putChar(data, px, monospace) {
        if (monospace) {
            for (let y = 0; y < this._height; y++) {
                for (let x = 0; x < this._width; x++) {
                    data[y][px + x] = this._data[y][x];
                }
            }
            return;
        }
        let minX = this._minX;
        let maxX = this._maxX;
        for (let y = 0; y < this._height; y++) {
            for (let x = minX; x < maxX; x++) {
                data[y][px + x - minX] = this._data[y][x];
            }
        }
    }
}

exports.Text = class {
    constructor(opts) {
        this._onLoad = opts.onLoad;
        this._image  = new Image();
        this._image.addEventListener('load', this.onLoad.bind(this));
        this._image.src = opts.src;
        this._charWidth  = 0;
        this._charHeight = 0;
    }

    onLoad() {
        let image   = this._image;
        let width   = image.width;
        let height  = image.height;
        let canvas  = document.createElement('canvas');
        let context = canvas.getContext('2d');
        canvas.width  = width;
        canvas.height = height;
        context.drawImage(image, 0, 0);
        this.loadChars(context.getImageData(0, 0, width, height).data, width, height);
    }

    loadChars(data, width, height) {
        let offset     = 0;
        let chars      = [];
        let charWidth  = width;
        let charHeight = height / 94;
        this._chars = chars;
        for (let i = 0; i < 94; i++) {
            let chr = [];
            for (let y = 0; y < charHeight; y++) {
                let line = [];
                for (let x = 0; x < width; x++) {
                    line.push(data[offset] === 0);
                    offset += 4;
                }
                chr.push(line);
            }
            chars.push(new Char({data: chr, width: charWidth, height: charHeight}));
        }
        this._chars = chars;
    }

    getChars() {
        return this._chars;
    }

    getTextWidth(s, monospace) {
        let chars = this._chars;
        let width = 0;
        for (let i = 0; i < s.length; i++) {
            let j = s.charCodeAt(i) - 33;
            if (j === -1) {
                width += chars[31].getWidth(monospace);
            }
            if ((j < 0) && !chars[j]) {
                continue;
            }
            width += chars[j].getWidth(monospace);
        }
        return width;
    }

    getTextHeight() {
        return this._chars[0].getHeight();
    }

    getData(s, monospace) {
        let result = [];
        let chars  = this._chars;
        let width  = this.getTextWidth(s, monospace);
        let height = this.getTextHeight();
        let px     = 0;
        for (let i = 0; i < height; i++) {
            result.push([]);
        }
        for (let i = 0; i < s.length; i++) {
            let j = s.charCodeAt(i) - 33;
            if (j === -1) {
                px += chars[31].getWidth(monospace);
            }
            if ((j < 0) && !chars[j]) {
                continue;
            }
            chars[j].putChar(result, px, monospace);
            px += chars[j].getWidth(monospace);
        }
        return result;
    }
};
