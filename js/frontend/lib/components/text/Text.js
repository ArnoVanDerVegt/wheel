/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../dispatcher').dispatcher;
const Component  = require('../component/Component').Component;

exports.Text = class extends Component {
    constructor(opts) {
        opts.baseClassName = 'text-block';
        super(opts);
        this._allowAutoSize = true;
        this._text          = opts.text   || '';
        this._hAlign        = opts.hAlign || 'left';
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: this.getClassName(),
                id:        this.setElement.bind(this),
                style:     this.applyStyle({}, this._style),
                innerHTML: this._text
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
        super.onEvent(opts);
        this.applyStyle(this._element.style, this._style);
    }
};

exports.Component = exports.Text;
