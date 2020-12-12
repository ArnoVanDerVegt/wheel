/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../dispatcher').dispatcher;
const Component  = require('./../Component').Component;

exports.Title = class extends Component {
    constructor(opts) {
        opts.baseClassName = 'title-block';
        super(opts);
        this._text = opts.text || '';
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        let style = this._style || {};
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
        if ('text' in opts) {
            this._text              = opts.text + '';
            this._element.innerHTML = opts.text + '';
        }
        super.onEvent(opts);
        this.applyStyle(element.style, this._style);
    }
};

exports.Component = exports.Title;
