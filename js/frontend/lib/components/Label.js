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
        if ('x' in opts) {
            element.style.left = opts.x + 'px';
        }
        if ('y' in opts) {
            element.style.top = opts.y + 'px';
        }
        if ('pointerEvents' in opts) {
            element.style.pointerEvents = opts.pointerEvents;
        }
    }
};
