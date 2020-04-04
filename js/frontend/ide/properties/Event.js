/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../lib/dom').DOMNode;

exports.Event = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._opts       = opts;
        this._options    = opts.options || {};
        this._ui         = opts.ui;
        this._settings   = opts.settings;
        this._name       = opts.name;
        this._value      = opts.value;
        this._onChange   = opts.onChange;
        this._properties = opts.properties;
        this._properties.addEvent(this);
        this.initDOM(opts.parentNode);
    }

    initEventName() {
        return {
            ref:       this.setRef('name'),
            className: 'event-name',
            innerHTML: this._name
        };
    }

    initEventValue() {
        return {
            className: 'event-value',
            children: [
                {
                    id:        this.setInputElement.bind(this),
                    type:      'input',
                    inputType: 'text',
                    className: 'text-input',
                    value:     this._value
                }
            ]
        };
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setEventElement.bind(this),
                className: 'event',
                children:  [
                    this.initEventName(),
                    this.initEventValue()
                ]
            }
        );
    }

    setInputElement(element) {
        this._inputElement = element;
        element.addEventListener('focus', this.onFocus.bind(this));
        element.addEventListener('blur',  this.onBlur.bind(this));
        element.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    setEventElement(element) {
        this._eventElement = element;
        this._eventElement.addEventListener('click', this.onClick.bind(this));
    }

    setValue(value) {
        this._inputElement.value = value;
    }

    onClick(event) {
        if (event.target.nodeName !== 'INPUT') {
            this._inputElement.focus(this);
            this._properties.focusEvent(this);
        }
    }

    onKeyUp(event) {
        this._onChange && this._onChange(this._inputElement.value);
    }

    onFocus() {
        this._eventElement.className = 'event focus';
        this._properties.focusEvent(this);
    }

    onBlur() {
        this._eventElement.className = 'event';
    }
};
