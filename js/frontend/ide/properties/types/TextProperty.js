/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Property = require('../Property').Property;

exports.TextProperty = class extends Property {
    initPropertyValue() {
        return {
            className: 'property-value',
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

    setInputElement(element) {
        this._inputElement = element;
        element.addEventListener('focus', this.onFocus.bind(this));
        element.addEventListener('blur',  this.onBlur.bind(this));
        element.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    setValue(value) {
        this._inputElement.value = value;
    }

    onClick(event) {
        if (event.target.nodeName !== 'INPUT') {
            this._inputElement.focus(this);
            this._properties.focusProperty(this);
        }
    }

    onKeyUp(event) {
        if (!this._onChange) {
            return;
        }
        let value = this._inputElement.value;
        if (this._options && this._options.validator) {
            if (this._options.validator(value)) {
                this._onChange(value);
                this._inputElement.className = 'text-input';
            } else {
                this._inputElement.className = 'text-input invalid';
            }
        } else {
            this._onChange(value);
        }
    }
};
