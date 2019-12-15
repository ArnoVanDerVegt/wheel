/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../dom').DOMNode;

exports.A = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._id = opts.id || '1';
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                type: 'a',
                id:   this._id
            }
        );
    }
};
