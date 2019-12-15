/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const DOMNode    = require('../dom').DOMNode;

class RadioOption extends DOMNode {
    constructor(opts) {
        super(opts);
        this._focus    = false;
        this._option   = opts.option;
        this._radio    = opts.radio;
        this._tabIndex = opts.tabIndex;
        this.initDOM(opts.parentNode);
        opts.radio.addRadioElement(this);
    }

    initDOM(domNode) {
        this.create(
            domNode,
            {
                id:        this.setElement.bind(this),
                type:      'a',
                href:      '#',
                tabIndex:  this._tabIndex,
                className: this.getClassName(),
                children: [
                    {
                        type:      'span',
                        className: 'dot',
                        children: [
                            {
                                type:      'span',
                                className: 'dot'
                            }
                        ]
                    },
                    {
                        type:      'span',
                        className: 'title',
                        innerHTML: this._option.title
                    }
                ]
            }
        );
    }

    onFocus(event) {
        this._focus = true;
        this.updateClassName();
    }

    onBlur(event) {
        this._focus = false;
        this.updateClassName();
    }

    onClick(event) {
        this.onCancelEvent(event);
        this._element.focus();
        if (this._focus) {
            this._radio.setValue(this._option.value);
        }
    }

    setElement(element) {
        this._element = element;
        element.addEventListener('mousedown', this.onCancelEvent.bind(this));
        element.addEventListener('click',     this.onClick.bind(this));
        element.addEventListener('focus',     this.onFocus.bind(this));
        element.addEventListener('blur',      this.onBlur.bind(this));
    }

    getClassName() {
        return 'radio-option' +
                    (this._focus                                   ? ' focus'    : '') +
                    (this._option.value === this._radio.getValue() ? ' selected' : '');
    }

    updateClassName() {
        this._element.className = this.getClassName();
    }

    setDisabled(disabled) {
        this._element.tabIndex = disabled ? -1 : this._tabIndex;
    }

    focus() {
        this._element.focus();
    }
}

exports.Radio = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._onChange      = opts.onChange;
        this._tabIndex      = opts.tabIndex;
        this._options       = opts.options;
        this._value         = opts.value;
        this._radioElements = [];
        this._ui            = opts.ui;
        this._uiId          = opts.uiId;
        this._onGlobalUIId  = this._ui.addEventListener('Global.UIId', this, this.onGlobalUIId);
        this.initDOM(opts.parentNode);
        (typeof opts.id === 'function') && opts.id(this);
    }

    initDOM(domNode) {
        let children = [];
        this._options.forEach(
            function(option, index) {
                children.push({
                    type:     RadioOption,
                    tabIndex: this._tabIndex + index,
                    radio:    this,
                    option:   option
                });
            },
            this
        );
        this.create(
            domNode,
            {
                id:        this.setElement.bind(this),
                className: 'radio',
                children:  children
            }
        );
    }

    setValue(value) {
        this._value = value;
        this._radioElements.forEach(
            function(radioElement) {
                radioElement.updateClassName();
            }
        );
        return this;
    }

    getValue() {
        return this._value;
    }

    setElement(element) {
        this._element = element;
    }

    addRadioElement(element) {
        this._radioElements.push(element);
    }

    onGlobalUIId() {
        let disabled = (this._uiId !== this._ui.getActiveUIId());
        this._radioElements.forEach(
            function(radioElement) {
                radioElement.setDisabled(disabled);
            }
        );
    }

    focus() {
        this._radioElements[0].focus();
        return this;
    }
};
