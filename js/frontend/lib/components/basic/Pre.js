/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../dom').DOMNode;

exports.Pre = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._className = opts.className || '';
        this._innerHTML = opts.innerHTML || '';
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                type:      'pre',
                className: this._className,
                innerHTML: this._innerHTML
            }
        );
    }
};
