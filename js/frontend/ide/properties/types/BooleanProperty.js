/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Checkbox = require('../../../lib/components/Checkbox').Checkbox;
const Property = require('../Property').Property;

exports.BooleanProperty = class extends Property {
    constructor(opts) {
        super(opts);
    }

    initPropertyValue() {
        return {
            className: 'property-value',
            children: [
                {
                    type:    Checkbox,
                    ui:      this._ui,
                    onFocus: this.onFocus.bind(this),
                    onBlur:  this.onBlur.bind(this)
                }
            ]
        };
    }
};
