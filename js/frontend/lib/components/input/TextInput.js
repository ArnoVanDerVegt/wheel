/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../dispatcher').dispatcher;
const Component  = require('./../Component').Component;

exports.TextInput = class extends Component {
    constructor(opts) {
        super(opts);
        this._value       = opts.value || '';
        this._visible     = ('visible' in opts) ? opts.visible : true;
        this._maxLength   = opts.maxLength || 524288;
        this._placeholder = opts.placeholder;
        this._numeric     = opts.numeric;
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                type:        'input',
                inputType:   'text',
                id:          this.setElement.bind(this),
                style:       this.applyStyle({}, this._style),
                tabIndex:    this._tabIndex,
                className:   this._className,
                value:       this._value,
                maxLength:   this._maxLength,
                placeholder: this._placeholder || ''
            }
        );
    }

    validateInput(event) {
        if (!this._numeric) {
            return;
        }
        let element = this._element;
        if (/^\d*\.?\d*$/.test(element.value)) {
            element.oldValue          = element.value;
            element.oldSelectionStart = element.selectionStart;
            element.oldSelectionEnd   = element.selectionEnd;
        } else if (element.hasOwnProperty('oldValue')) {
            element.value = element.oldValue;
            element.setSelectionRange(element.oldSelectionStart, element.oldSelectionEnd);
        }
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
        super.onEvent(opts);
        this.applyStyle(element.style, this._style);
    }

    setElement(element) {
        ['input', 'keydown', 'keyup', 'mousedown', 'mouseup', 'select', 'contextmenu', 'drop'].forEach(
            (event) => {
                element.addEventListener(event, this.validateInput.bind(this));
            }
        );
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

exports.Component = exports.TextInput;
