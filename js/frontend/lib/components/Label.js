/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const Component  = require('./Component').Component;

exports.Label = class extends Component {
    constructor(opts) {
        opts.baseClassName = 'label';
        super(opts);
        this._text   = opts.text   || '';
        this._value  = opts.value  || '';
        this._halign = opts.halign || 'left';
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        let style = this._style || {};
        if (this._width && (parseInt(this._width, 10) >= 20)) {
            style.width = this._width + 'px';
        }
        this.create(
            parentNode,
            {
                className: this.getClassName(),
                id:        this.setElement.bind(this),
                innerHTML: this._text,
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
        let update  = false;
        if ('text' in opts) {
            this._text = opts.text;
            update     = true;
        }
        if ('value' in opts) {
            this._value = opts.value + '';
            update      = true;
        }
        if (update) {
            let text = this._text;
            if (this._value.trim() !== '') {
                text += ' ' + this._value;
            }
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
