/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Checkbox = require('../../../lib/components/Checkbox').Checkbox;
const Property = require('../Property').Property;

exports.BooleanProperty = class extends Property {
    initPropertyValue() {
        return {
            className: 'property-value',
            children: [
                {
                    type:     Checkbox,
                    ref:      this.setRef('checkbox'),
                    checked:  this._value,
                    ui:       this._ui,
                    onFocus:  this.onFocus.bind(this),
                    onBlur:   this.onBlur.bind(this),
                    onChange: this.onChange.bind(this)
                }
            ]
        };
    }

    setValue(checked) {
        this._refs.checkbox.setChecked(checked);
        this._value = !!checked;
    }

    onClick(event) {
        this._refs.checkbox.focus();
        this._properties.focusProperty(this);
    }

    onChange(checked) {
        this._value = !!checked;
        if (this._onChange) {
            this._onChange(this._value);
        }
    }
};
