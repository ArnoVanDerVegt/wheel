/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Step   = require('./Step').Step;
const Slider = require('../../../../lib/components/input/Slider').Slider;

exports.StepContrast = class extends Step {
    constructor(opts) {
        super(opts);
        this._dialog   = opts.dialog;
        this._data     = [];
        this._value    = [];
        this._contrast = 128;
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
                        className: 'image-preview',
                        children: [
                            {
                                id:        this.setImageContentElement.bind(this),
                                className: 'image-content',
                                children: [
                                    {
                                        id:        this.setImageContainerElement.bind(this),
                                        className: 'image-container',
                                        children: [
                                            {
                                                id:   this.setCanvasElement.bind(this),
                                                type: 'canvas'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        className: 'image-options',
                        children: [
                            {
                                innerHTML: 'Contrast:'
                            },
                            {
                                type:     Slider,
                                ui:       this._ui,
                                uiId:     this._uiId,
                                tabIndex: 1,
                                maxValue: 256,
                                value:    128,
                                onChange: this.onChangeContrast.bind(this)
                            }
                        ]
                    }
                ]
            }
        );
    }

    setCanvasElement(element) {
        this._canvasElement = element;
    }

    getCanvas() {
        let canvas    = document.createElement('canvas');
        let context   = canvas.getContext('2d');
        canvas.width  = this._width;
        canvas.height = this._height;
        let imageData = context.getImageData(0, 0, this._width, this._height);
        let data      = imageData.data;
        let offset    = 0;
        for (let y = 0; y < this._height; y++) {
            let line = this._data[y];
            for (let x = 0; x < this._width; x++) {
                let color = (line[x] < this._contrast) ? 0 : 255;
                data[offset++] = color;
                data[offset++] = color;
                data[offset++] = color;
                data[offset++] = 255;
            }
        }
        context.putImageData(imageData, 0, 0);
        return canvas;
    }

    getData() {
        return this._data;
    }

    getValue() {
        return this._value;
    }

    showImage() {
        let context = this._canvasElement.getContext('2d');
        this._value = [];
        for (let y = 0; y < this._height; y++) {
            let line      = this._data[y];
            let valueLine = [];
            for (let x = 0; x < this._width; x++) {
                valueLine.push(line[x] < this._contrast ? 0 : 1);
                context.fillStyle = (line[x] < this._contrast) ? '#000000' : '#FFFFFF';
                context.fillRect(x * 3, y * 3, 3, 3);
            }
            this._value.push(valueLine);
        }
    }

    show(opts) {
        let width  = opts.scaledCanvas.width;
        let height = opts.scaledCanvas.height;
        this._width                              = width;
        this._height                             = height;
        this._data                               = [];
        this._canvas                             = opts.scaledCanvas;
        this._imageContainerElement.style.width  = (width  * 3) + 'px';
        this._imageContainerElement.style.height = (height * 3) + 'px';
        this._canvasElement.width  = width  * 3;
        this._canvasElement.height = height * 3;
        let context = this._canvas.getContext('2d');
        let data    = context.getImageData(0, 0, width, height).data;
        let offset  = 0;
        for (let y = 0; y < height; y++) {
            let line = [];
            for (let x = 0; x < width; x++) {
                let r = data[offset++];
                let g = data[offset++];
                let b = data[offset++];
                line.push(~~((0.3 * r) + (0.59 * g) + (0.11 * b)));
                offset++;
            }
            this._data.push(line);
        }
        this.showImage();
        super.show();
    }

    onChangeContrast(value) {
        this._contrast = value;
        this.showImage();
    }
};
