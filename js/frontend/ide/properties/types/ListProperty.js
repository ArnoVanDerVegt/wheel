/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Property = require('../Property').Property;

exports.ListProperty = class extends Property {
    initPropertyValue() {
        return {
            ref:       this.setRef('value'),
            className: 'property-value',
            children: [
                {
                    id:        this.setInputElement.bind(this),
                    type:      'a',
                    href:      '#',
                    innerHTML: 'List value',
                    className: 'list-selected'
                }
            ]
        };
    }

    initPropertyName() {
        return {
            ref:       this.setRef('name'),
            className: 'property-name',
            innerHTML: this._name,
            children: [
                {
                    className: 'list-content',
                    children: [
                        {
                            className: 'list-item',
                            innerHTML: 'List item 1'
                        },
                        {
                            className: 'list-item',
                            innerHTML: 'List item 2'
                        },
                        {
                            className: 'list-item',
                            innerHTML: 'List item 3'
                        },
                        {
                            className: 'list-item',
                            innerHTML: 'List item 4'
                        },
                        {
                            className: 'list-item',
                            innerHTML: 'List item 5'
                        },
                        {
                            className: 'list-item',
                            innerHTML: 'List item 6'
                        }
                    ]
                }
            ]
        };
    }

    setInputElement(element) {
        this._inputElement = element;
        element.addEventListener('click', this.onClickInput.bind(this));
        element.addEventListener('focus', this.onFocus.bind(this));
        element.addEventListener('blur',  this.onBlur.bind(this));
    }

    onFocus() {
        let refs = this._refs;
        refs.name.className             = 'property-name list-focus';
        refs.value.className            = 'property-value list-focus';
        this._propertyElement.className = 'property focus';
    }

    onBlur() {
        let refs = this._refs;
        refs.name.className             = 'property-name';
        refs.value.className            = 'property-value';
        this._propertyElement.className = 'property';
    }

    onClickInput(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    onClick(event) {
        this._inputElement.focus();
    }
};
