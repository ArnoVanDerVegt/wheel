/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Property = require('../Property').Property;

exports.RgbProperty = class extends Property {
    initPropertyValue() {
        return {
            className: 'property-value',
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
                    input:     true
                }),
                this.initColorRow({
                    ref:       'grn',
                    className: 'small',
                    label:     'Green',
                    input:     true
                }),
                this.initColorRow({
                    ref:       'blu',
                    className: 'small',
                    label:     'Blue',
                    input:     true
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
                        id:        this.setInputElement.bind(this, opts.ref),
                        ref:       this.setRef(opts.ref + 'Input'),
                        type:      'input',
                        inputType: 'text',
                        className: 'text-input',
                        value:     value[opts.ref]
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

    setInputElement(ref, element) {
        if (!this._inputElements) {
            this._inputElements = {};
        }
        this._inputElements[ref] = element;
        element.addEventListener('focus', this.onFocus.bind(this, ref));
        element.addEventListener('blur',  this.onBlur.bind (this, ref));
        element.addEventListener('keyup', this.onKeyUp.bind(this, ref));
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
        refs.redInput.value                   = color.red;
        color     = this.getDefaultColor();
        color.grn = value.grn;
        refs.grnColor.style.backgroundColor   = this.getColorFromValue(color);
        refs.grnInput.value                   = color.grn;
        color     = this.getDefaultColor();
        color.blu = value.blu;
        refs.bluColor.style.backgroundColor   = this.getColorFromValue(color);
        refs.bluInput.value                   = color.blu;
    }

    validateElement(value) {
        let v = parseInt(value, 10);
        if (isNaN(v)) {
            return false;
        }
        return (v >= 0) && (v <= 255);
    }

    onBlur(ref, event) {
        super.onBlur(event);
        let inputElement = this._inputElements[ref];
        if (!this.validateElement(inputElement.value)) {
            inputElement.value     = this._value[ref];
            inputElement.className = 'text-input';
        }
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
        let text         = inputElement.value;
        if (this.validateElement(text)) {
            let refs  = this._refs;
            let color = this.getDefaultColor();
            let value = this.getValue();
            inputElement.className                    = 'text-input';
            color[ref]                                = parseInt(text, 10);
            value[ref]                                = parseInt(text, 10);
            refs[ref + 'Color'].style.backgroundColor = this.getColorFromValue(color);
            refs.colorColor.style.backgroundColor     = this.getColorFromValue(value);
            this._onChange(value);
        } else {
            inputElement.className = 'text-input invalid';
        }
    }
};
