/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const Component  = require('./Component').Component;

exports.Text = class extends Component {
    constructor(opts) {
        opts.baseClassName = 'text-block';
        super(opts);
        this._text   = opts.text   || '';
        this._halign = opts.halign || 'left';
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        let style = this._style || {};
        if (this._width && (parseInt(this._width, 10) >= 20)) {
            style.width = this._width + 'px';
        }
        style.textAlign = this._halign;
        let text = this._text;
        if (typeof text === 'object') {
            text = text.join('<br/>');
        }
        this.create(
            parentNode,
            {
                className: this.getClassName(),
                id:        this.setElement.bind(this),
                innerHTML: text,
                style:     style
            }
        );
    }

    onEvent(opts) {
        let element = this._element;
        if ('text' in opts) {
            let text = opts.text;
            if (typeof text === 'object') {
                text = text.join('<br/>');
            }
            this._text              = text;
            this._element.innerHTML = text;
        }
        if ('halign' in opts) {
            this._halign                  = opts.halign;
            this._element.style.textAlign = this._halign;
        }
        if ('width' in opts) {
            if (parseInt(opts.width, 10) >= 20) {
                this.setWidth(opts.width + 'px');
            } else {
                this.setWidth('auto');
            }
        }
        super.onEvent(opts);
    }
};

exports.Component = exports.Text;
