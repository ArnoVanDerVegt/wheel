/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const Component  = require('./Component').Component;

exports.Image = class extends Component {
    constructor(opts) {
        opts.baseClassName = 'label';
        super(opts);
        this._width  = opts.width  || 20;
        this._height = opts.height || 20;
        this._height = opts.src    || '';
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        let style  = this._style || {};
        style.width  = this._width  + 'px';
        style.height = this._height + 'px';
        this.create(
            parentNode,
            {
                type:      'img',
                className: this.getClassName(),
                id:        this.setElement.bind(this),
                src:       this._src,
                style:     style
            }
        );
    }

    remove() {
        super.remove();
        this._element.parentNode.removeChild(this._element);
    }

    onEvent(opts) {
        let element = this._element;
        let style   = element.style;
        if ('width' in opts) {
            this._width  = parseInt(opts.width, 10);
            style.width  = this._width + 'px';
        }
        if ('height' in opts) {
            this._height = parseInt(opts.height, 10);
            style.height = this._height + 'px';
        }
        if ('src' in opts) {
            this._src    = opts.borderRadius;
            element.src  = this._src;
        }
        super.onEvent(opts);
    }
};
