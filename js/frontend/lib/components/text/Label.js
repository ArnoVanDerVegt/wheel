/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../dispatcher').dispatcher;
const Component  = require('../component/Component').Component;

exports.Label = class extends Component {
    constructor(opts) {
        opts.baseClassName = 'label';
        super(opts);
        this._allowAutoSize = true;
        this._text          = opts.text     || '';
        this._value         = opts.value    || '';
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: this.getClassName(),
                id:        this.setElement.bind(this),
                innerHTML: this._text,
                style:     this.applyStyle({}, this._style)
            }
        );
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
        super.onEvent(opts);
        this.applyStyle(this._element.style, this._style);
    }
};

exports.Component = exports.Label;
