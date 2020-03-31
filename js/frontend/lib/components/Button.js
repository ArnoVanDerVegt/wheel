/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const Component  = require('./Component').Component;

exports.Button = class extends Component {
    constructor(opts) {
        super(opts);
        this._icon          = opts.icon;
        this._baseClassName = (this._icon ? 'icon-' : ' ') + 'button ' + (this._icon ? this._icon : '');
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: this.getClassName(),
                type:      'input',
                inputType: 'button',
                tabIndex:  this._tabIndex,
                disabled:  this._disabled ? 'disabled' : '',
                value:     this._value || '',
                title:     this._title || '',
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
        if ('className' in opts) {
            this.setClassName(opts.className);
        }
        if ('color' in opts) {
            this.setColor(opts.color);
        }
        if ('value' in opts) {
            this.setValue(opts.value);
        }
        if ('title' in opts) {
            this.setTitle(opts.title);
        }
        if ('disabled' in opts) {
            element.disabled  = opts.disabled ? 'disabled' : '';
        }
        super.onEvent(opts);
    }
};
