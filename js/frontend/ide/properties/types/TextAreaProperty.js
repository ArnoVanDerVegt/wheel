/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const TextArea = require('../../../lib/components/TextArea').TextArea;
const Property = require('../Property').Property;

exports.TextAreaProperty = class extends Property {
    initPropertyName() {
        return {
            ref:       this.setRef('name'),
            className: 'flt property-name text-area',
            innerHTML: this._name
        };
    }

    initPropertyValue() {
        let value = this._value;
        if (typeof value === 'object') {
            value = value.join('\n');
        }
        return {
            className: 'flt property-value text-area',
            children: [
                {
                    type:      TextArea,
                    id:        this.setInputElement.bind(this),
                    ui:        this._ui,
                    uiId:      1,
                    tabIndex:  this._tabIndex,
                    value:     value,
                    onFocus:   this.onFocus.bind(this),
                    onBlur:    this.onBlur.bind(this),
                    onKeyUp:   this.onKeyUp.bind(this)
                }
            ]
        };
    }

    setInputElement(inputElement) {
        this._inputElement = inputElement;
    }

    setValue(value) {
        if (typeof value === 'object') {
            value = value.join('\n');
        }
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
            inputElement.setClassName('text-area');
            this._onChange(value.split('\n'));
        } else {
            inputElement.setClassName('text-area invalid');
        }
    }
};
