/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../dispatcher').dispatcher;
const Component  = require('../component/Component');

exports.StatusLight = class extends Component.Component {
    constructor(opts) {
        super(opts);
        this._baseClassName = 'status-light';
        this._rgbColor      = opts.rgbColor;
        this._rgb           = (typeof opts.rgb === 'object') ? opts.rgb : {red: 0, rgn: 0, blu: 0};
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        let style = this.applyStyle({}, this._style);
        if (this._rgbColor) {
            let color = this.getColorFromRgb(this._rgb);
            style.backgroundColor = color;
            style.boxShadow       = '0px 0px 10px ' + color;
        }
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: this.getClassName(),
                style:     style
            }
        );
    }

    onEvent(opts) {
        let element = this._element;
        if ('className' in opts) {
            this.setClassName(opts.className);
        }
        if ('color' in opts) {
            this.setColor(Component.getComponentColor(opts.color));
        }
        let setRgb = false;
        if ('rgbColor' in opts) {
            if (opts.rgbColor) {
                setRgb = true;
            } else {
                this.setColor(Component.getComponentColor(opts.color));
            }
        }
        if (('rgb' in opts) && (typeof opts.rgb === 'object')) {
            this._rgb = opts.rgb;
            setRgb    = true;
        }
        if (setRgb) {
            let color = this.getColorFromRgb(this._rgb);
            element.style.backgroundColor = color;
            element.style.boxShadow       = '0px 0px 10px ' + color;
        } else {
            element.style.backgroundColor = '';
            element.style.boxShadow       = '';
        }
        super.onEvent(opts);
        this.applyStyle(element.style, this._style);
    }
};

exports.Component = exports.StatusLight;
