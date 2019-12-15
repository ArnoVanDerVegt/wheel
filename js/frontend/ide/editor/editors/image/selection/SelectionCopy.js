/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Selection = require('./Selection').Selection;

exports.SelectionCopy = class extends Selection {
    constructor(opts) {
        opts.elementType = 'canvas';
        opts.className   = 'selection';
        super(opts);
        this._data = null;
    }

    show(x1, y1, x2, y2) {
        this._x1 = x1;
        this._y1 = y1;
        this._x2 = x2;
        this._y2 = y2;
        if (!this._data) {
            return;
        }
        let element   = this._selectionElement;
        let pixelSize = this._imageEditorState.getPixelSize();
        x1 *= pixelSize;
        y1 *= pixelSize;
        x2 *= pixelSize;
        y2 *= pixelSize;
        if ((x2 - x1 - 1 <= 0) || (y2 - y1 - 1 <= 0)) {
            return;
        }
        element.style.left    = x1 + 'px';
        element.style.top     = y1 + 'px';
        element.style.display = 'block';
    }

    copy(image) {
        this.setData({
            x1:   this._x1,
            y1:   this._y1,
            x2:   this._x2,
            y2:   this._y2,
            data: image.copyRange(this._x1, this._y1, this._x2, this._y2)
        });
    }

    hide() {
        let element = this._selectionElement;
        element.style.display = 'none';
        element.width         = 0;
        element.height        = 0;
        this._data            = null;
        super.hide();
    }

    getData() {
        return {
            x1:   this._x1,
            y1:   this._y1,
            x2:   this._x2,
            y2:   this._y2,
            data: this._data
        };
    }

    getHasSelection() {
        return this._data;
    }

    setData(data) {
        this._x1 = data.x1;
        this._y1 = data.y1;
        this._x2 = data.x2;
        this._y2 = data.y2;
        this.show(data.x1, data.y1, data.x2, data.y2);
        let element   = this._selectionElement;
        let pixelSize = this._imageEditorState.getPixelSize();
        let x1        = this._x1 * pixelSize;
        let y1        = this._y1 * pixelSize;
        let x2        = this._x2 * pixelSize;
        let y2        = this._y2 * pixelSize;
        if ((x2 - x1 - 1 <= 0) || (y2 - y1 - 1 <= 0)) {
            return;
        }
        let width  = x2 - x1;
        let height = y2 - y1;
        element.width         = width;
        element.height        = height;
        element.style.left    = x1 + 'px';
        element.style.top     = y1 + 'px';
        element.style.width   = width  + 'px';
        element.style.height  = height + 'px';
        element.style.display = 'block';
        let context   = element.getContext('2d');
        for (let y = 0; y < this._y2 - this._y1; y++) {
            let b = y * pixelSize;
            for (let x = 0; x < this._x2 - this._x1; x++) {
                let a = x * pixelSize;
                context.fillStyle = data.data[y][x] ? '#000000' : '#FFFFFF';
                context.fillRect(a, b, pixelSize, pixelSize);
            }
        }
        this._data = data.data;
    }
};
