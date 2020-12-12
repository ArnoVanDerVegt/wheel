/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode   = require('../../../../lib/dom').DOMNode;
const TextInput = require('../../../../lib/components/input/TextInput').TextInput;
const Button    = require('../../../../lib/components/input/Button').Button;

exports.Step = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui     = opts.ui;
        this._uiId   = opts.uiId;
        this._hidden = opts.hidden;
        opts.id(this);
    }

    addInputOption(title, id, onKeyUp, tabIndex) {
        return {
            className: 'image-option',
            children: [
                {
                    className: 'label',
                    innerHTML: title
                },
                {
                    id:       id,
                    type:     TextInput,
                    ui:       this._ui,
                    uiId:     this._uiId,
                    onKeyUp:  onKeyUp,
                    tabIndex: tabIndex
                }
            ]
        };
    }

    addButtonOption(title, onClick, tabIndex) {
        return {
            className: 'image-option',
            children: [
                {
                    type:     Button,
                    uiOwner:  this,
                    tabIndex: tabIndex,
                    value:    title,
                    color:    'green',
                    onClick:  onClick
                }
            ]
        };
    }

    addSelectedElement(element) {
        if (this._selectedElements) {
            this._selectedElements.push(element);
        } else {
            element.style.display = 'none';
        }
    }

    getUI() {
        return this._ui;
    }

    getUIId() {
        return this._uiId;
    }

    setImageContentElement(element) {
        this._imageContentElement = element;
    }

    setImageContainerElement(element) {
        this._imageContainerElement = element;
    }

    setImageElement(element) {
        this._imageElement = element;
    }

    setStepElement(element) {
        this._stepElement = element;
    }

    setSelectedArea(x, y, width, height) {
        let selected = this._selected;
        selected.x      = x;
        selected.y      = y;
        selected.width  = width;
        selected.height = height;
        let selectedElements = this._selectedElements;
        for (let i = 0; i < 2; i++) {
            let style = selectedElements[i].style;
            style.left    = x      + 'px';
            style.top     = y      + 'px';
            style.width   = width  + 'px';
            style.height  = height + 'px';
        }
    }

    setXInputElement(element) {
        this._xInputElement = element;
    }

    setYInputElement(element) {
        this._yInputElement = element;
    }

    setWidthInputElement(element) {
        this._widthInputElement = element;
    }

    setHeightInputElement(element) {
        this._heightInputElement = element;
    }

    updateInputs() {
        let selected = this._selected;
        this._xInputElement && this._xInputElement.setValue(selected.x);
        this._yInputElement && this._yInputElement.setValue(selected.y);
        this._widthInputElement.setValue(selected.width);
        this._heightInputElement.setValue(selected.height);
    }

    validateInput(input, min, max) {
        if (input.getValue() === '') {
            input.setClassName('invalid');
            return false;
        }
        let value = parseInt(input.getValue(), 10);
        if (isNaN(value) || (value < min) || (value > max)) {
            input.setClassName('invalid');
            return false;
        }
        input.setClassName('');
        return true;
    }

    show() {
        this._stepElement.className = 'step-content';
    }

    hide() {
        this._stepElement.className = 'step-content hidden';
    }

    onChangeInput() {
    }
};
