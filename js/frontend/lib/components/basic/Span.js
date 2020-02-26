/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../dom').DOMNode;

exports.Span = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._innerHTML = opts.innerHTML || '';
        this._title     = opts.title     || '';
        this._className = opts.className || '';
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                type:      'span',
                innerHTML: this._innerHTML,
                title:     this._title,
                className: this._className
            }
        );
    }
};
