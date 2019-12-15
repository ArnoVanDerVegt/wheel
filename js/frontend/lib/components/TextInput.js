/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const Component  = require('./Component').Component;

exports.TextInput = class extends Component {
    constructor(opts) {
        super(opts);
        this._value   = opts.value || '';
        this._visible = ('visible' in opts) ? opts.visible : true;
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                type:      'input',
                inputType: 'text',
                tabIndex:  this._tabIndex,
                className: this._className,
                value:     this._value
            }
        );
    }

    onEvent(opts) {
        let element = this._element;
        if ('value' in opts) {
            element.value     = opts.value;
        }
        if ('disabled' in opts) {
            this._disabled    = opts.disabled;
            element.disabled  = opts.disabled ? 'disabled' : '';
        }
        if ('className' in opts) {
            element.className = opts.className;
        }
    }

    setElement(element) {
        if (!this._visible) {
            element.style.display = 'none';
        }
        super.setElement(element);
    }

    getValue() {
        return this._element.value;
    }

    setValue(value) {
        this.onEvent({value: value});
        return this;
    }

    setDisabled(disabled) {
        this.onEvent({disabled: disabled});
        return this;
    }

    setClassName(className) {
        this.onEvent({className: className});
        return this;
    }

    hide() {
        this._element.style.display = 'none';
        return this;
    }

    show() {
        this._element.style.display = 'block';
        return this;
    }
};
