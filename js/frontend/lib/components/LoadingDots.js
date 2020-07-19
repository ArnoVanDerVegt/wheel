/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const DOMNode    = require('../dom').DOMNode;

exports.LoadingDots = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('dots'),
                className: 'loading-dots',
                children: [
                    {}
                ]
            }
        );
    }

    setVisible(visible) {
        this._refs.dots.style.display = visible ? 'block' : 'none';
    }
};
