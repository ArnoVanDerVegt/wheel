/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../../../lib/dom').DOMNode;

exports.Grid = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._opts             = opts;
        this._imageEditorState = opts.imageEditorState;
        this.create(
            opts.parentNode,
            {
                id:        this.setCanvasElement.bind(this),
                type:      'canvas',
                className: 'resource'
            }
        );
        opts.id && opts.id(this);
    }

    initElement() {
        let pixelSize = this._imageEditorState.getPixelSize();
        let width     = this._value.width  * pixelSize;
        let height    = this._value.height * pixelSize;
        let element   = this._element;
        element.width        = width;
        element.height       = height;
        element.style.width  = width  + 'px';
        element.style.height = height + 'px';
    }

    setCanvasElement(element) {
        this._element = element;
        let opts = this._opts;
        element.addEventListener('mousemove', opts.onMouseMove);
        element.addEventListener('mouseout',  opts.onMouseOut);
        element.addEventListener('mousedown', opts.onMouseDown);
        element.addEventListener('mouseup',   opts.onMouseUp);
        return this;
    }

    setVisible(visible) {
        this._element.style.opacity = visible ? 1 : 0;
    }

    setValue(value) {
        this._value = value;
        let pixelSize = this._imageEditorState.getPixelSize();
        let context   = this._element.getContext('2d');
        this.initElement();
        context.strokeStyle = '#D0D4D8';
        for (let x = 1; x < value.width; x++) {
            context.beginPath();
            context.moveTo(x * pixelSize + 0.5, 0);
            context.lineTo(x * pixelSize + 0.5, value.height * pixelSize);
            context.stroke();
        }
        for (let y = 1; y < value.height; y++) {
            context.beginPath();
            context.moveTo(0,                       y * pixelSize + 0.5);
            context.lineTo(value.width * pixelSize, y * pixelSize + 0.5);
            context.stroke();
        }
        return this;
    }
};
