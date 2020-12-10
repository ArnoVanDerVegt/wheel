/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Button     = require('../../../../lib/components/Button').Button;
const dispatcher = require('../../../../lib/dispatcher').dispatcher;
const Property   = require('../Property').Property;

exports.IconProperty = class extends Property {
    initPropertyValue() {
        return {
            className: 'property-value',
            children: [
                {
                    type:     Button,
                    ref:      this.setRef('button'),
                    ui:       this._ui,
                    uiId:     1,
                    tabIndex: this._tabIndex,
                    onClick:  this.onClick.bind(this),
                    value:    'Select'
                }
            ]
        };
    }

    setValue(value) {
        this._value = value;
    }

    onClick(event) {
        this._properties.focusProperty(this);
        dispatcher.dispatch(
            'Dialog.Icon.Show',
            {
                onApply: this.onChange.bind(this)
            }
        );
    }

    onChange(value) {
        this._value = value;
        if (this._onChange) {
            this._onChange(this._value);
        }
    }
};
