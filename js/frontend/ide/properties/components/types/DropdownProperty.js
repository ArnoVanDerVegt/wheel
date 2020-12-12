/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Dropdown = require('../../../../lib/components/input/Dropdown').Dropdown;
const getImage = require('../../../data/images').getImage;
const Property = require('../Property').Property;

exports.DropdownProperty = class extends Property {
    initPropertyName() {
        let list = this._options.list;
        return {
            ref:       this.setRef('name'),
            className: 'flt property-name' + (list[0].image ? ' image-dropdown' : ''),
            innerHTML: this._name
        };
    }

    initPropertyValue() {
        let list = this._options.list;
        return {
            className: 'flt property-value' + (list[0].image ? ' image-dropdown' : ''),
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
                    images:   list[0].image,
                    items:    list,
                    getImage: getImage
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
