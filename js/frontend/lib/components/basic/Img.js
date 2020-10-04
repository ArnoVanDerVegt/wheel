/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../dom').DOMNode;

exports.Img = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._src       = opts.src;
        this._className = opts.className || '';
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('image'),
                type:      'img',
                src:       this._src || '',
                className: this._className
            }
        );
    }

    setSrc(src) {
        this._refs.image.src = src;
    }
};
