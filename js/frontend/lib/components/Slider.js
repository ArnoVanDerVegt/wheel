/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../dispatcher').dispatcher;
const DOMNode    = require('../dom').DOMNode;

exports.Slider = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._mouseDown = false;
        this._value     = opts.value || 0;
        this._maxValue  = opts.maxValue;
        this._onChange  = opts.onChange;
        this.initDOM(opts.parentNode);
        (typeof opts.id === 'function') && opts.id(this);
    }

    setSliderElement(element) {
        this._sliderElement = element;
        element.addEventListener('click',     this.onCancelEvent.bind(this));
        element.addEventListener('mousemove', this.onMouseMove.bind(this));
        element.addEventListener('mousedown', this.onMouseDown.bind(this));
        element.addEventListener('mouseup',   this.onMouseUp.bind(this));
        element.addEventListener('mouseout',  this.onMouseOut.bind(this));
        element.addEventListener('keydown',   this.onKeyDown.bind(this));
        element.addEventListener('focus',     this.onFocus.bind(this));
        element.addEventListener('blur',      this.onBlur.bind(this));
    }

    setButtonElement(element) {
        this._buttonElement = element;
        this.setValue(this._value);
    }

    getValue() {
        return this._value;
    }

    setValue(value) {
        this._buttonElement.style.left = (7 + (62 / this._maxValue * value)) + 'px';
        this._value                    = value;
    }

    getSliderPosition(event) {
        let element = this._sliderElement;
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
        let x     = Math.min(Math.max(this.getSliderPosition(event), 14), 78);
        let value = Math.round((x - 14) * this._maxValue / 62);
        if (value !== this._value) {
            this._value = value;
            this._onChange && this._onChange(Math.floor(value));
        }
        this._buttonElement.style.left = (x - 7) + 'px';
    }

    onMouseMove(event) {
        this.onCancelEvent(event);
        if (this._mouseDown) {
            this.setButtonPos(event);
        }
    }

    onMouseDown(event) {
        this.onCancelEvent(event);
        this._mouseDown = true;
        this.setButtonPos(event);
        this._sliderElement.focus();
    }

    onMouseUp(event) {
        this.onCancelEvent(event);
        this._mouseDown = false;
    }

    onMouseOut(event) {
        this.onCancelEvent(event);
        this._mouseDown = false;
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case 37:
                this.setValue(Math.max(this._value - this._maxValue / 78, 0));
                this._onChange && this._onChange(Math.floor(this._value));
                break;
            case 39:
                this.setValue(Math.min(this._value + this._maxValue / 78, this._maxValue));
                this._onChange && this._onChange(Math.floor(this._value));
                break;
        }
    }

    onFocus(event) {
        this._sliderElement.className = 'slider focus';
    }

    onBlur(event) {
        this._sliderElement.className = 'slider';
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setSliderElement.bind(this),
                type:      'a',
                href:      '#',
                className: 'slider',
                children: [
                    {
                        type:      'span',
                        className: 'slider-track'
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
};
