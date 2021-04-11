/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path      = require('../../../../../shared/lib/path');
const TextInput = require('../../../../lib/components/input/TextInput').TextInput;
const Step      = require('./Step').Step;

exports.StepFilename = class extends Step {
    constructor(opts) {
        super(opts);
        this._dialog   = opts.dialog;
        this._data     = [];
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
                        className: 'image-filename',
                        children: [
                            {
                                className: 'label',
                                innerHTML: 'Filename:'
                            },
                            {
                                id:      this.setFilenameElement.bind(this),
                                type:    TextInput,
                                ui:      this._ui,
                                uiId:    this._uiId,
                                onKeyUp: this.onKeyUpFilename.bind(this)
                            }
                        ]
                    },
                    {
                        className: 'image-preview full',
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
                                                id:   this.setImageElement.bind(this),
                                                type: 'img'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        );
    }

    setFilenameElement(element) {
        this._filenameElement = element;
    }

    getFilename() {
        let filename  = this._filenameElement.getValue().trim();
        let extension = path.getExtension(filename);
        if (extension !== '.rgf') {
            filename += '.rgf';
        }
        return filename;
    }

    show(opts) {
        let filename = opts.filename;
        let i        = filename.lastIndexOf('.');
        this._filenameElement.setValue(filename.substr(0, i));
        this._imageContainerElement.style.width  = opts.resultCanvas.width  + 'px';
        this._imageContainerElement.style.height = opts.resultCanvas.height + 'px';
        this._imageElement.src                   = opts.resultCanvas.toDataURL('image/png');
        super.show();
    }

    validate() {
        let filename = this._filenameElement.getValue().trim();
        let result   = true;
        if ((filename === '') || (filename.indexOf('/') !== -1)) {
            result = false;
        }
        this._dialog.getButtonNextElement().setDisabled(!result);
        return result;
    }

    onKeyUpFilename() {
        if (this.validate()) {
            this._filenameElement.setClassName('');
        }
        this._filenameElement.setClassName('invalid');
    }
};
