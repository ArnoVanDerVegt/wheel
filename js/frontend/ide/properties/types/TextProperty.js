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

    validate(value) {
        let options = this._options;
        if (options && options.validator) {
            if ((this._name === 'name') && this._componentList.getNameExists(this._component, value)) {
                return false;
            }
            if (!options.validator(value)) {
                return false;
            }
        }
        return true;
    }

    onBlur(event) {
        super.onBlur(event);
        let inputElement = this._inputElement;
        if (!this.validate(inputElement.value)) {
            inputElement.value     = this._value;
            inputElement.className = 'text-input';
        }
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
        let inputElement = this._inputElement;
        let value        = inputElement.value;
        if (this.validate(value)) {
            this._value            = value;
            inputElement.className = 'text-input';
            this._onChange(value);
        } else {
            inputElement.className = 'text-input invalid';
        }
    }
};
