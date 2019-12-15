/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Step         = require('./Step').Step;
const ImagePreview = require('./ImagePreview').ImagePreview;

exports.StepScale = class extends Step {
    constructor(opts) {
        super(opts);
        this._dialog   = opts.dialog;
        this._selected = {
            width:  178,
            height: 128
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
                            this.addInputOption('Width',  this.setWidthInputElement.bind(this),  this.onChangeInput.bind(this), 3),
                            this.addInputOption('Height', this.setHeightInputElement.bind(this), this.onChangeInput.bind(this), 4)
                        ]
                    }
                ]
            }
        );
    }

    showScale() {
        let width  = this._selected.width;
        let height = this._selected.height;
        this._imageElement.style.width           = width  + 'px';
        this._imageElement.style.height          = height + 'px';
        this._imageContainerElement.style.width  = width  + 'px';
        this._imageContainerElement.style.height = height + 'px';
    }

    show(opts) {
        let canvas = opts.selectedCanvas;
        this._canvas           = opts.selectedCanvas;
        this._imageElement.src = canvas.toDataURL('image/png');
        this.updateInputs();
        this.showScale();
        super.show();
    }

    getCanvas() {
        let canvas    = document.createElement('canvas');
        let context   = canvas.getContext('2d');
        let selected  = this._selected;
        canvas.width  = selected.width;
        canvas.height = selected.height;
        context.drawImage(this._canvas, 0, 0, this._canvas.width, this._canvas.height, 0, 0, selected.width, selected.height);
        return canvas;
    }

    validate() {
        let result = false;
        if (this.validateInput(this._widthInputElement,  0, 178) &&
            this.validateInput(this._heightInputElement, 0, 128)) {
            result = true;
        }
        this._dialog.getButtonNextElement().setDisabled(!result);
        return result;
    }

    onChangeInput() {
        if (!this.validate()) {
            return;
        }
        this._selected.width  = parseInt(this._widthInputElement.getValue(),  10);
        this._selected.height = parseInt(this._heightInputElement.getValue(), 10);
        this.showScale();
    }
};
