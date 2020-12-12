/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../dispatcher').dispatcher;
const Component  = require('./../Component').Component;

exports.Rectangle = class extends Component {
    constructor(opts) {
        opts.width  = opts.width  || 20;
        opts.height = opts.height || 20;
        super(opts);
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: this.getClassName(),
                id:        this.setElement.bind(this),
                style:     this.applyStyle({}, this._style)
            }
        );
    }

    onEvent(opts) {
        super.onEvent(opts);
        this.applyStyle(this._element.style, this._style);
    }
};

exports.Component = exports.Rectangle;
