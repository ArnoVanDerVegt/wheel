/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const TextInput = require('../../../../lib/components/TextInput').TextInput;
const Property = require('../Property').Property;

exports.RgbProperty = class extends Property {
    initPropertyValue() {
        return {
            ref:       this.setRef('value'),
            className: 'property-value rgb',
            children: [
                this.initColorRow({
                    ref:       'color',
                    label:     'Color',
                    input:     false
                }),
                this.initColorRow({
                    ref:       'red',
                    className: 'small',
                    label:     'Red',
                    input:     true,
                    tabIndex:  this._tabIndex
                }),
                this.initColorRow({
                    ref:       'grn',
                    className: 'small',
                    label:     'Green',
                    input:     true,
                    tabIndex:  this._tabIndex + 1
                }),
                this.initColorRow({
                    ref:       'blu',
                    className: 'small',
                    label:     'Blue',
                    input:     true,
                    tabIndex:  this._tabIndex + 2
                })
            ]
        };
    }

    initColorRow(opts) {
        let value = this.getValue();
        let color = this.getDefaultColor();
        if (opts.ref === 'color') {
            color = this.getValue();
        } else {
            color[opts.ref] = value[opts.ref];
        }
        return {
            className: 'color-row',
            children: [
                opts.input ?
                    {

                        type:      TextInput,
                        id:        this.setInputElement.bind(this, opts.ref),
                        ref:       this.setRef(opts.ref + 'Input'),
                        ui:        this._ui,
                        uiId:      1,
                        tabIndex:  opts.tabIndex,
                        className: 'text-input',
                        value:     value[opts.ref] + '',
                        onFocus:   this.onFocus.bind(this, opts.ref),
                        onBlur:    this.onBlur.bind (this, opts.ref),
                        onKeyUp:   this.onKeyUp.bind(this, opts.ref)
                    } :
                    null,
                {
                    className: 'color-label ' + (opts.className || ''),
                    innerHTML: opts.label
                },
                {
                    ref:       this.setRef(opts.ref + 'Color'),
                    className: 'color',
                    style: {
                        backgroundColor: this.getColorFromValue(color)
                    }
                }
            ]
        };
    }

    setPropertyElement(element) {
        this._propertyElement = element;
        element.addEventListener('click', this.onClickElement.bind(this));
    }

    getTabCount() {
        return 3;
    }

    setInputElement(ref, inputElement) {
        if (!this._inputElements) {
            this._inputElements = {};
        }
        this._inputElements[ref] = inputElement;
    }

    getDefaultColor() {
        return {red: 0, grn: 0, blu: 0};
    }

    getColorFromValue(color) {
        return 'rgb(' + color.red + ',' + color.grn + ',' + color.blu + ')';
    }

    getValue(value) {
        if (typeof this._value !== 'object') {
            this._value = this.getDefaultColor();
        }
        return this._value;
    }

    setValue(value) {
        if (typeof value !== 'object') {
            value = this.getDefaultColor();
        }
        this._value = value;
        let refs  = this._refs;
        let color = this.getDefaultColor();
        refs.colorColor.style.backgroundColor = this.getColorFromValue(value);
        color     = this.getDefaultColor();
        color.red = value.ref;
        refs.redColor.style.backgroundColor   = this.getColorFromValue(color);
        refs.redInput.setValue(color.red);
        color     = this.getDefaultColor();
        color.grn = value.grn;
        refs.grnColor.style.backgroundColor   = this.getColorFromValue(color);
        refs.grnInput.setValue(color.grn);
        color     = this.getDefaultColor();
        color.blu = value.blu;
        refs.bluColor.style.backgroundColor   = this.getColorFromValue(color);
        refs.bluInput.setValue(color.blu);
    }

    setFocus(focus) {
        let refs = this._refs;
        if (focus) {
            refs.value.className            = 'property-value color-focus';
            this._propertyElement.className = 'property focus';
        } else {
            refs.value.className            = 'property-value rgb';
            this._propertyElement.className = 'property';
        }
    }

    validateElement(value) {
        let v = parseInt(value, 10);
        if (isNaN(v)) {
            return false;
        }
        return (v >= 0) && (v <= 255);
    }

    onFocus(event) {
        super.onFocus(event);
        this.setFocus(true);
    }

    onBlur(ref, event) {
        super.onBlur(event);
        let inputElement = this._inputElements[ref];
        if (!this.validateElement(inputElement.value)) {
            inputElement.setValue(this._value[ref]);
            inputElement.setClassName('text-input');
        }
    }

    onClickElement(event) {
        this._properties.focusProperty(this);
        this.setFocus(true);
    }

    onClick(event) {
        if (event.target.nodeName !== 'INPUT') {
            this._properties.focusProperty(this);
        }
    }

    onKeyUp(ref, event) {
        if (!this._onChange) {
            return;
        }
        let inputElement = this._inputElements[ref];
        let text         = inputElement.getValue();
        if (this.validateElement(text)) {
            let refs  = this._refs;
            let color = this.getDefaultColor();
            let value = this.getValue();
            inputElement.setClassName('text-input');
            color[ref]                                = parseInt(text, 10);
            value[ref]                                = parseInt(text, 10);
            refs[ref + 'Color'].style.backgroundColor = this.getColorFromValue(color);
            refs.colorColor.style.backgroundColor     = this.getColorFromValue(value);
            this._onChange(value);
        } else {
            inputElement.setClassName('text-input invalid');
        }
    }
};
