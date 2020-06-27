/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const Component  = require('./Component').Component;

exports.Label = class extends Component {
    constructor(opts) {
        super(opts);
        this._design = opts.design;
        this._text   = opts.text;
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
                className: 'label' + (this._design ? ' design' : ''),
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
        if ('text' in opts) {
            this._text              = opts.text;
            this._element.innerHTML = opts.text;
        }
        if ('halign' in opts) {
            this._halign                  = opts.halign;
            this._element.style.textAlign = this._halign;
        }
        if ('number' in opts) {
            this._text              = opts.number + '';
            this._element.innerHTML = opts.number + '';
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
