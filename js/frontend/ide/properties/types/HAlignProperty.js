/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const IconSelect = require('../../../lib/components/IconSelect').IconSelect;
const getImage   = require('../../data/images').getImage;
const Property   = require('../Property').Property;

exports.HAlignProperty = class extends Property {
    initPropertyValue() {
        return {
            className: 'property-value',
            children: [
                {
                    type:     IconSelect,
                    ref:      this.setRef('alignList'),
                    ui:       this._ui,
                    value:    this._value,
                    onChange: this.onChange.bind(this),
                    onFocus:  this.onFocus.bind(this),
                    onBlur:   this.onBlur.bind(this),
                    options: [
                        {value: 'left',   icon: getImage('images/constants/alignLeft.svg')},
                        {value: 'center', icon: getImage('images/constants/alignCenter.svg')},
                        {value: 'right',  icon: getImage('images/constants/alignRight.svg')}
                    ]
                }
            ]
        };
    }

    setValue(value) {
        this._value = value;
        this._refs.alignList.setValue(value);
    }

    onChange(value) {
        this._value = value;
        this._onChange && this._onChange(value);
    }

    onClick(event) {
        this._refs.alignList.focus();
        this._properties.focusProperty(this);
    }
};
