/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Selection   = require('./Selection').Selection;
const TRANSPARENT = require('./../Image').TRANSPARENT;

exports.SelectionText = class extends Selection {
    constructor(opts) {
        opts.elementType = 'canvas';
        opts.className   = 'selection';
        super(opts);
        this._hasCopy = false;
        this._data    = null;
    }

    show(x1, y1, x2, y2) {
        this._x1 = x1;
        this._y1 = y1;
        this._x2 = x2;
        this._y2 = y2;
        if (!this._hasCopy) {
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

    hide() {
        let element = this._selectionElement;
        element.style.display = 'none';
        element.width         = 0;
        element.height        = 0;
        this._data            = null;
        super.hide();
    }

    getData() {
        return this._data;
    }

    setText(s, text) {
        let imageEditorState = this._imageEditorState;
        let fill             = imageEditorState.getFill();
        let stroke           = imageEditorState.getStroke();
        let pixelSize        = imageEditorState.getPixelSize();
        let monospace        = imageEditorState.getMonospace();
        let element          = this._selectionElement;
        let x1               = this._x1 * pixelSize;
        let y1               = this._y1 * pixelSize;
        let x2               = this._x2 * pixelSize;
        let y2               = this._y2 * pixelSize;
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
        let context = element.getContext('2d');
        let data    = text.getData(s, monospace);
        for (let y = 0; y < data.length; y++) {
            for (let x = 0; x < data[y].length; x++) {
                let a = x * pixelSize;
                let b = y * pixelSize;
                if (data[y][x]) {
                    if (stroke !== TRANSPARENT) {
                        context.fillStyle = stroke ? '#000000' : '#FFFFFF';
                        context.fillRect(a, b, pixelSize, pixelSize);
                    }
                } else {
                    if (fill !== TRANSPARENT) {
                        context.fillStyle = fill ? '#000000' : '#FFFFFF';
                        context.fillRect(a, b, pixelSize, pixelSize);
                    }
                }
            }
        }
        this._data    = data;
        this._hasCopy = true;
    }
};
