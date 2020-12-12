/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const TextInput = require('../../../../lib/components/input/TextInput').TextInput;
const Property  = require('../Property').Property;

exports.TextProperty = class extends Property {
    initPropertyValue() {
        return {
            className: 'property-value',
            children: [
                {
                    type:      TextInput,
                    id:        this.setInputElement.bind(this),
                    ui:        this._ui,
                    uiId:      1,
                    tabIndex:  this._tabIndex,
                    value:     this._value,
                    onFocus:   this.onFocus.bind(this),
                    onBlur:    this.onBlur.bind(this),
                    onKeyUp:   this.onKeyUp.bind(this),
                    className: 'text-input'
                }
            ]
        };
    }

    setInputElement(inputElement) {
        this._inputElement = inputElement;
    }

    setValue(value) {
        this._inputElement.setValue(value);
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
        if (!this.validate(inputElement.getValue())) {
            inputElement.setValue(this._value);
            inputElement.setClassName('text-input');
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
        let value        = inputElement.getValue();
        if (this.validate(value)) {
            this._value = value;
            inputElement.setClassName('text-input');
            this._onChange(value);
        } else {
            inputElement.setClassName('text-input invalid');
        }
    }
};
