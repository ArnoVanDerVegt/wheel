/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const IconSelect = require('../../../lib/components/IconSelect').IconSelect;
const getImage   = require('../../data/images').getImage;
const Property   = require('../Property').Property;

exports.ColorProperty = class extends Property {
    initPropertyValue() {
        return {
            className: 'property-value',
            children: [
                {
                    type:     IconSelect,
                    ref:      this.setRef('colorList'),
                    ui:       this._ui,
                    value:    this._value,
                    onChange: this.onChange.bind(this),
                    onFocus:  this.onFocus.bind(this),
                    onBlur:   this.onBlur.bind(this),
                    options: [
                        {value: 'gray',   icon: getImage('images/constants/colorGray.svg')},
                        {value: 'yellow', icon: getImage('images/constants/colorYellow.svg')},
                        {value: 'green',  icon: getImage('images/constants/colorGreen.svg')},
                        {value: 'blue',   icon: getImage('images/constants/colorBlue.svg')},
                        {value: 'red',    icon: getImage('images/constants/colorRed.svg')}
                    ]
                }
            ]
        };
    }

    setValue(value) {
        this._value = value;
        this._refs.colorList.setValue(value);
    }

    onChange(value) {
        this._value = value;
        this._onChange && this._onChange(value);
    }

    onClick(event) {
        this._refs.colorList.focus();
        this._properties.focusProperty(this);
    }
};
