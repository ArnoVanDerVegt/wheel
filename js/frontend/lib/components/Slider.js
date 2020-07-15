/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const Component  = require('./Component').Component;

exports.Slider = class extends Component {
    constructor(opts) {
        super(opts);
        this._mouseDown     = false;
        this._width         = opts.width    ||  96;
        this._value         = opts.value    ||   0;
        this._maxValue      = opts.maxValue || 100;
        this._onChange      = opts.onChange;
        this._disabled      = ('disabled' in opts) ? opts.disabled : false;
        this._baseClassName = 'slider';
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        let style = this._style || {};
        style.width = this._width + 'px';
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                type:      'a',
                href:      '#',
                className: this.getClassName(),
                style:     style,
                children: [
                    {
                        ref:       this.setRef('sliderTrack'),
                        type:      'span',
                        className: 'slider-track',
                        style: {
                            width: (this._width - 24) + 'px'
                        }
                    },
                    {
                        id:        this.setButtonElement.bind(this),
                        type:      'span',
                        className: 'slider-button'
                    }
                ]
            }
        );
    }

    setButtonElement(element) {
        this._buttonElement = element;
        this.setValue(this._value);
    }

    getValue() {
        return this._value;
    }

    setValue(value) {
        value                          = Math.min(Math.max(value, 0), this._maxValue);
        this._buttonElement.style.left = (7 + ((this._width - 34) / this._maxValue * value)) + 'px';
        this._value                    = value;
    }

    getSliderPosition(event) {
        let element = this._element;
        let offsetX = element.offsetLeft;
        let parent  = element.offsetParent;
        while (parent) {
            offsetX += parent.offsetLeft;
            parent = parent.offsetParent;
        }
        let x = event.clientX - offsetX;
        parent = element.offsetParent.offsetParent;
        return x + parent.scrollLeft;
    }

    setButtonPos(event) {
        if (this._disabled) {
            return;
        }
        let x     = Math.min(Math.max(this.getSliderPosition(event), 14), (this._width - 18));
        let value = Math.round((x - 14) * this._maxValue / (this._width - 34));
        if (value !== this._value) {
            this._value = value;
            this._onChange && this._onChange(Math.floor(value));
        }
        this._buttonElement.style.left = (x - 7) + 'px';
    }

    setWidth(width) {
        this._element.style.width          = width + 'px';
        this._refs.sliderTrack.style.width = (width - 24) + 'px';
        this.setValue(this._value);
    }

    onClick(event) {
        this.onCancelEvent(event);
    }

    onMouseMove(event) {
        this.onCancelEvent(event);
        if (!this._disabled && this._mouseDown) {
            this.setButtonPos(event);
        }
        super.onMouseMove(event);
    }

    onMouseDown(event) {
        this.onCancelEvent(event);
        if (!this._disabled) {
            this._mouseDown = true;
            this.setButtonPos(event);
            this._element.focus();
        }
        super.onMouseDown(event);
    }

    onMouseUp(event) {
        this.onCancelEvent(event);
        this._mouseDown = false;
        super.onMouseUp(event);
    }

    onMouseOut(event) {
        this.onCancelEvent(event);
        this._mouseDown = false;
        super.onMouseOut(event);
    }

    onKeyDown(event) {
        if (this._disabled) {
            return;
        }
        switch (event.keyCode) {
            case 37:
                this.setValue(Math.max(this._value - this._maxValue / (this._width - 18), 0));
                this._onChange && this._onChange(Math.floor(this._value));
                break;
            case 39:
                this.setValue(Math.min(this._value + this._maxValue / (this._width - 18), this._maxValue));
                this._onChange && this._onChange(Math.floor(this._value));
                break;
        }
    }

    onFocus(event) {
        if (!this._disabled) {
            this._element.className = 'slider focus';
        }
        super.onFocus(event);
    }

    onBlur(event) {
        this._element.className = 'slider';
        super.onBlur(event);
    }

    onEvent(opts) {
        let element = this._element;
        if ('value' in opts) {
            this.setValue(opts.value);
        }
        if ('maxValue' in opts) {
            this._maxValue = Math.max(opts.maxValue, 1);
            this.setValue(this._value);
        }
        if ('disabled' in opts) {
            element.disabled  = opts.disabled ? 'disabled' : '';
        }
        if ('width' in opts) {
            let width = 48;
            if (parseInt(opts.width, 10) >= 48) {
                width = parseInt(width, 10);
            }
            this.setWidth(Math.max(width, 48));
        }
        super.onEvent(opts);
    }
};

exports.Component = exports.Slider;
