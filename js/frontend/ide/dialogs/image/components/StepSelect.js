/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Step         = require('./Step').Step;
const ImagePreview = require('./ImagePreview').ImagePreview;

exports.StepSelect = class extends Step {
    constructor(opts) {
        super(opts);
        this._dialog           = opts.dialog;
        this._naturalWidth     = 0;
        this._naturalHeight    = 0;
        this._selectedElements = [];
        this._selected         = {
            x:      0,
            y:      0,
            width:  0,
            height: 0
        };
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setStepElement.bind(this),
                className: 'step-content' + (this._hidden ? ' hidden' : ''),
                children: [
                    {
                        type:  ImagePreview,
                        ui:    this._ui,
                        owner: this
                    },
                    {
                        className: 'image-options',
                        children: [
                            this.addInputOption('X',      this.setXInputElement.bind(this),      this.onChangeInput.bind(this), 1),
                            this.addInputOption('Y',      this.setYInputElement.bind(this),      this.onChangeInput.bind(this), 2),
                            this.addInputOption('Width',  this.setWidthInputElement.bind(this),  this.onChangeInput.bind(this), 3),
                            this.addInputOption('Height', this.setHeightInputElement.bind(this), this.onChangeInput.bind(this), 4),
                            this.addButtonOption('Select all', this.onSelectAll.bind(this), 5)
                        ]
                    }
                ]
            }
        );
    }

    getCanvas() {
        let canvas    = document.createElement('canvas');
        let context   = canvas.getContext('2d');
        let selected  = this._selected;
        canvas.width  = selected.width;
        canvas.height = selected.height;
        context.drawImage(this._imageElement, selected.x, selected.y, selected.width, selected.height, 0, 0, selected.width, selected.height);
        return canvas;
    }

    validate() {
        let result = false;
        if (this.validateInput(this._xInputElement, 0, this._naturalWidth  - 1) &&
            this.validateInput(this._yInputElement, 0, this._naturalHeight - 1)) {
            let x = parseInt(this._xInputElement.getValue(), 10);
            let y = parseInt(this._yInputElement.getValue(), 10);
            if (this.validateInput(this._widthInputElement,  0, this._naturalWidth  - x) &&
                this.validateInput(this._heightInputElement, 0, this._naturalHeight - y)) {
                result = true;
            }
        }
        this.validateInput(this._widthInputElement,  0, this._naturalWidth);
        this.validateInput(this._heightInputElement, 0, this._naturalHeight);
        this._dialog.getButtonNextElement().setDisabled(!result);
        return result;
    }

    onSelectAll() {
        this.setSelectedArea(0, 0, this._naturalWidth, this._naturalHeight);
        this.updateInputs();
        this.validate();
    }

    onChangeInput() {
        if (!this.validate()) {
            return;
        }
        this.setSelectedArea(
            parseInt(this._xInputElement.getValue(),      10),
            parseInt(this._yInputElement.getValue(),      10),
            parseInt(this._widthInputElement.getValue(),  10),
            parseInt(this._heightInputElement.getValue(), 10)
        );
    }

    init(opts) {
        let image = new Image();
        image.addEventListener(
            'load',
            () => {
                let width  = image.naturalWidth;
                let height = image.naturalHeight;
                this._naturalWidth                       = width;
                this._naturalHeight                      = height;
                this._imageElement.src                   = image.src;
                this._imageContentElement.style.width    = (width  + 64) + 'px';
                this._imageContentElement.style.height   = (height + 64) + 'px';
                this._imageContainerElement.style.width  = width  + 'px';
                this._imageContainerElement.style.height = height + 'px';
                this.setSelectedArea(0, 0, width, height);
                this.updateInputs();
                this.validate();
            }
        );
        image.src = opts.value;
        super.show();
    }
};
