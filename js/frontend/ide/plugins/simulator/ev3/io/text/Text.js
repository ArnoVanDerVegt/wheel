/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.Text = class {
    constructor(opts) {
        this._display = opts.display;
        this._char    = {
            data:     [],
            dataSize: 0,
            width:    0,
            height:   0
        };
        this._onLoad = opts.onLoad;
        this._image  = new Image();
        this._image.addEventListener('load', this.onLoad.bind(this));
        this._image.src = opts.src;
    }

    onLoad(event) {
        let image   = this._image;
        let width   = image.width;
        let height  = image.height;
        let canvas  = document.createElement('canvas');
        let context = canvas.getContext('2d');
        let chr     = this._char;
        chr.width     = width;
        chr.height    = height / 94;
        chr.dataSize  = width * chr.height;
        canvas.width  = width;
        canvas.height = height;
        context.drawImage(image, 0, 0);
        let imageData = context.getImageData(0, 0, width, height);
        let data      = imageData.data;
        let offset    = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                chr.data.push(data[offset] === 0);
                offset += 4;
            }
        }
        this._onLoad && this._onLoad();
    }

    drawChar(x, y, fill, index) {
        let chr          = this._char;
        let width        = chr.width;
        let height       = chr.height;
        let display      = this._display;
        let imageData    = display.getImageData();
        let destWidth    = display.getWidth();
        let destHeight   = display.getHeight();
        let restWidth    = 0;
        let startOffset  = 0;

        if ((x >= destWidth) || (x + width < 0) || (y >= destHeight) || (y + height < 0)) {
            return;
        }

        if (x < 0) {
            restWidth = -x;
            width += x;
            x = 0;
        }
        if (y < 0) {
            startOffset = -y * width;
            height += y;
            y = 0;
        }
        if (x + width >= destWidth) {
            restWidth = (x + width) - destWidth;
            width -= restWidth;
        }
        if (y + height >= destHeight) {
            height -= (y + height) - destHeight;
        }

        let destOffset   = (y * destWidth + x) * 4;
        let sourceOffset = index * chr.dataSize + startOffset;
        let sourceData   = chr.data;
        let colorDark    = fill ? 128 : 0;
        let colorLight   = fill ? 0 : 128;

        for (let j = 0; j < height; j++) {
            for (let i = 0; i < width; i++) {
                let color = sourceData[sourceOffset] ? colorDark : colorLight;
                imageData.data[destOffset++] = color;
                imageData.data[destOffset++] = color;
                imageData.data[destOffset++] = color;

                destOffset++;
                sourceOffset++;
            }

            sourceOffset += restWidth;
            destOffset += (destWidth - width) * 4;
        }
    }

    drawText(x, y, fill, text) {
        if (!text.length) {
            return;
        }

        let chr = this._char;
        for (let i = 0; i < text.length; i++) {
            let c = text.charCodeAt(i);
            if (c === 32) {
                x += chr.width;
            } else if ((c > 32) && (c <= 126)) {
                this.drawChar(x, y, fill, c - 33);
                x += chr.width;
            }
        }
    }

    getCharWidth() {
        return this._char.width;
    }
};
