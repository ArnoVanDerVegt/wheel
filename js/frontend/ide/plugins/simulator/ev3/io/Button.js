/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../../../../lib/dom').DOMNode;

exports.Button = class extends DOMNode {
    constructor(opts) {
        super(opts);
        (typeof opts.id === 'function') && opts.id(this);
        this._opts    = opts;
        this._element = null;
        this._down    = false;
        this._onClick = opts.onClick;
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: this._opts.className
            }
        );
    }

    setElement(element) {
        this._element = element;
        element.addEventListener('mousedown', this.onMouseDown.bind(this));
        element.addEventListener('mouseup',   this.onMouseUp.bind(this));
        element.addEventListener('mouseout',  this.onMouseOut.bind(this));
    }

    getDown() {
        return this._down;
    }

    onMouseDown(event) {
        event.preventDefault();
        this._down              = true;
        this._element.className = this._opts.down;
        this._onClick && this._onClick();
    }

    onMouseUp(event) {
        event.preventDefault();
        this._down              = false;
        this._element.className = this._opts.up;
    }

    onMouseOut(event) {
        event.preventDefault();
        this._down              = false;
        this._element.className = this._opts.up;
    }
};
