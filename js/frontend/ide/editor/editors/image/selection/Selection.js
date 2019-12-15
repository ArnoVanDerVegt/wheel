/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../../../../lib/dom').DOMNode;

exports.Selection = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._imageEditorState = opts.imageEditorState;
        this.create(
            opts.parentNode,
            {
                id:        this.setElement.bind(this),
                className: 'resource-overlay',
                children: [
                    {
                        id:        this.setSelectionElement.bind(this),
                        type:      opts.elementType || 'div',
                        className: opts.className   || 'selection with-border'
                    }
                ]
            }
        );
        this._x1 = 0;
        this._y1 = 0;
        this._x2 = 0;
        this._y2 = 0;
        opts.id && opts.id(this);
    }

    getElement() {
        return this._element;
    }

    setElement(element) {
        this._element = element;
    }

    setSelectionElement(element) {
        this._selectionElement = element;
    }

    getInside(x, y) {
        return (x >= this._x1) && (y >= this._y1) && (x <= this._x2) && (y <= this._y2);
    }

    getX1() {
        return this._x1;
    }

    getY1() {
        return this._y1;
    }

    show(x1, y1, x2, y2) {
        let element   = this._selectionElement;
        let pixelSize = this._imageEditorState.getPixelSize();
        this._x1 = x1;
        this._y1 = y1;
        this._x2 = x2;
        this._y2 = y2;
        x1 *= pixelSize;
        y1 *= pixelSize;
        x2 *= pixelSize;
        y2 *= pixelSize;
        if ((x2 - x1 - 1 <= 0) || (y2 - y1 - 1 <= 0)) {
            return false;
        }
        element.style.left    = x1 + 'px';
        element.style.top     = y1 + 'px';
        element.style.width   = (x2 - x1 - 1) + 'px';
        element.style.height  = (y2 - y1 - 1) + 'px';
        element.style.display = 'block';
        return true;
    }

    showRect(rect) {
        this.show(rect.x1, rect.y1, rect.x2, rect.y2);
    }

    move(x, y) {
        this._x1 += x;
        this._y1 += y;
        this._x2 += x;
        this._y2 += y;
        this.show(this._x1, this._y1, this._x2, this._y2);
    }

    hide() {
        this._selectionElement.style.display = 'none';
        this._x1 = -1;
        this._y1 = -1;
        this._x2 = -1;
        this._y2 = -1;
    }
};
