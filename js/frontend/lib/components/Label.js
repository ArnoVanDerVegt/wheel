/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const Component  = require('./Component').Component;

exports.Label = class extends Component {
    constructor(opts) {
        super(opts);
        this._text = opts.text;
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'label',
                id:        this.setElement.bind(this),
                innerHTML: this._text,
                style:     this._style || {}
            }
        );
    }

    remove() {
        super.remove();
        this._element.parentNode.removeChild(this._element);
    }

    onEvent(opts) {
        let element = this._element;
        if ('text' in opts) {
            this._text              = opts.text;
            this._element.innerHTML = opts.text;
        }
        super.onEvent(opts);
    }
};
