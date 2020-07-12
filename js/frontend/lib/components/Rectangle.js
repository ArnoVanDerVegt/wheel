/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const Component  = require('./Component').Component;

exports.Rectangle = class extends Component {
    constructor(opts) {
        super(opts);
        this._width        = opts.width  || 20;
        this._height       = opts.height || 20;
        this._fillColor    = (typeof opts.fillColor   === 'object') ? opts.fillColor   : {red: 255, rgn: 255, blu: 255};
        this._borderColor  = (typeof opts.borderColor === 'object') ? opts.borderColor : {red:   0, rgn:   0, blu:   0};
        this._borderWidth  = ('borderWidth'  in opts) ? opts.borderWidth  : 2;
        this._borderRadius = ('borderRadius' in opts) ? opts.borderRadius : 0;
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        let style  = this._style || {};
        let raduis = this._radius;
        style.width           = this._width        + 'px';
        style.height          = this._height       + 'px';
        style.borderRadius    = this._borderRadius + 'px';
        style.border          = this._borderWidth + 'px solid ' + this.getColorFromRgb(this._borderColor);
        style.backgroundColor = this.getColorFromRgb(this._fillColor);
        this.create(
            parentNode,
            {
                className: this.getClassName(),
                id:        this.setElement.bind(this),
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
        let update  = false;
        if (('fillColor' in opts) && (typeof opts.fillColor === 'object')) {
            this._fillColor       = opts.fillColor;
            style.backgroundColor = this.getColorFromRgb(this._fillColor);
        }
        if ('width' in opts) {
            this._width           = parseInt(opts.width, 10);
            style.width           = this._width + 'px';
        }
        if ('height' in opts) {
            this._height          = parseInt(opts.height, 10);
            style.height          = this._height + 'px';
        }
        if (('borderColor' in opts) && (typeof opts.borderColor === 'object')) {
            this._borderColor     = opts.borderColor;
            update                = true;
        }
        if ('borderWidth' in opts) {
            this._borderWidth     = opts.borderWidth;
            update                = true;
        }
        if ('borderRadius' in opts) {
            this._borderRadius    = opts.borderRadius;
            update                = true;
        }
        if (update) {
            style.border          = this._borderWidth + 'px solid ' + this.getColorFromRgb(this._borderColor);
            style.borderRadius    = this._borderRadius + 'px';
        }
        super.onEvent(opts);
    }
};
