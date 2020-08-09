/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Dropdown = require('../../../lib/components/Dropdown').Dropdown;
const Property = require('../Property').Property;

exports.DropdownProperty = class extends Property {
    initPropertyValue() {
        return {
            className: 'property-value',
            children: [
                {
                    type:     Dropdown,
                    ref:      this.setRef('dropdown'),
                    ui:       this._ui,
                    uiId:     1,
                    tabIndex: this._tabIndex,
                    onFocus:  this.onFocus.bind(this),
                    onBlur:   this.onBlur.bind(this),
                    onChange: this.onChange.bind(this),
                    items:    this._options.list
                }
            ]
        };
    }

    setValue(value) {
        this._refs.dropdown.setValue(value);
        this._value = value;
    }

    onClick(event) {
        this._refs.dropdown.focus();
        this._properties.focusProperty(this);
    }

    onChange(value) {
        this._value = value;
        if (this._onChange) {
            this._onChange(this._value);
        }
    }
};
