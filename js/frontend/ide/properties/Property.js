/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../lib/dom').DOMNode;

exports.Property = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._opts          = opts;
        this._tabIndex      = opts.tabIndex;
        this._options       = opts.options || {};
        this._ui            = opts.ui;
        this._settings      = opts.settings;
        this._name          = opts.name;
        this._value         = opts.value;
        this._onChange      = opts.onChange;
        this._component     = opts.component;
        this._componentList = opts.componentList;
        this._properties    = opts.properties;
        this._properties.addProperty(this);
        this.initDOM(opts.parentNode);
    }

    initPropertyName() {
        return {
            ref:       this.setRef('name'),
            className: 'property-name',
            innerHTML: this._name
        };
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
                id:        this.setPropertyElement.bind(this),
                className: 'property',
                children:  [
                    this.initPropertyName(),
                    this.initPropertyValue()
                ]
            }
        );
    }

    setPropertyElement(element) {
        this._propertyElement = element;
        this._propertyElement.addEventListener('click', this.onClick.bind(this));
    }

    setValue(value) {
    }

    getTabCount() {
        return 1;
    }

    onClick() {
    }

    onFocus() {
        this._propertyElement.className = 'property focus';
        this._properties.focusProperty(this);
    }

    onBlur() {
        this._propertyElement.className = 'property';
    }
};
