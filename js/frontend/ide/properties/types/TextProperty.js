/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Property = require('../Property').Property;

exports.TextProperty = class extends Property {
    constructor(opts) {
        super(opts);
    }

    initPropertyValue() {
        return {
            className: 'property-value',
            children: [
                {
                    id:        this.setInputElement.bind(this),
                    type:      'input',
                    inputType: 'text',
                    className: 'text-input'
                }
            ]
        };
    }

    setInputElement(element) {
        element.addEventListener('focus', this.onFocus.bind(this));
        element.addEventListener('blur',  this.onBlur.bind(this));
    }
};
