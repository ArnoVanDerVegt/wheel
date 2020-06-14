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
        let style = this._style || {};
        if (this._width && (parseInt(this._width, 10) >= 20)) {
            style.width = this._width + 'px';
        }
        if (this._height && (parseInt(this._height, 10) >= 20)) {
            style.height = this._height + 'px';
        }
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
        if ('width' in opts) {
            if (parseInt(opts.width, 10) >= 20) {
                this.setWidth(opts.width + 'px');
            } else {
                this.setWidth('auto');
            }
        }
        if ('height' in opts) {
            if (parseInt(opts.height, 10) >= 20) {
                this.setHeight(opts.height + 'px');
            } else {
                this.setHeight('auto');
            }
        }
        super.onEvent(opts);
    }
};
