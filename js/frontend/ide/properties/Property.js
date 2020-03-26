/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../lib/dom').DOMNode;

exports.Property = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._opts      = opts;
        this._ui        = opts.ui;
        this._settings  = opts.settings;
        this._name      = opts.name;
        this._value     = opts.value;
        this.initDOM(opts.parentNode);
    }

    initPropertyValue() {
        return {
            className: 'property-value',
            innerHTML: this._value
        };
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('property'),
                className: 'property',
                children:  [
                    {
                        className: 'property-name',
                        innerHTML: this._name
                    },
                    this.initPropertyValue()
                ]
            }
        );
    }

    onFocus() {
        this._refs.property.className = 'property focus';
    }

    onBlur() {
        this._refs.property.className = 'property';
    }
};
