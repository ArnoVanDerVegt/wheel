/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../dom').DOMNode;

exports.Ul = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._className = opts.className || '';
        this._list      = opts.list;
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        let node = {
                type:      'ul',
                className: this._className,
                children:  []
            };
        this._list.forEach((item) => {
            node.children.push({
                type:      'li',
                innerHTML: item
            });
        });
        this.create(parentNode, node);
    }
};
