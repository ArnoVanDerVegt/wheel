/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path        = require('../../../../shared/lib/path');
const dispatcher  = require('../../../lib/dispatcher').dispatcher;
const ImageDialog = require('./ImageDialog').ImageDialog;

exports.ImageNewDialog = class extends ImageDialog {
    constructor(opts) {
        opts.applyTitle = opts.applyTitle || 'Create new EV3 image';
        super(opts);
        this._expectedExtensions = ['', '.rgf'];
        this.initWindow({
            showSignal: opts.showSignal || 'Dialog.Image.New.Show',
            width:      400,
            height:     256,
            className:  'image-dialog new-image',
            title:      opts.title || 'New image'
        });
    }

    initWindowContent(opts) {
        return [
            {
                className: 'abs dialog-cw dialog-lt image-dialog-text',
                children: [
                    {
                        className: 'flt max-w input-row image-dialog-row',
                        children: [
                            {
                                className: 'flt input-label',
                                innerHTML: 'Filename'
                            },
                            this.addTextInput({
                                ref:         this.setRef('filename'),
                                tabIndex:    1,
                                onKeyUp:     this.onFilenameKeyUp.bind(this),
                                placeholder: 'Enter filename'
                            })
                        ]
                    },
                    this.getWidthRow(),
                    this.getHeightRow()
                ]
            },
            this.initButtons([
                {
                    ref:      this.setRef('buttonApply'),
                    tabIndex: 128,
                    value:    opts.applyTitle || 'Ok',
                    onClick:  this.onApply.bind(this)
                },
                {
                    tabIndex: 129,
                    value:    'Cancel',
                    color:    'dark-green',
                    onClick:  this.hide.bind(this)
                }
            ])
        ];
    }

    onShow(activeDirectory, documentPath) {
        this.show();
        this._activeDirectory         = activeDirectory || documentPath;
        this._refs.filename.className = '';
        this._refs.filename.value     = '';
        this._refs.filename.focus();
    }

    onFilenameKeyUp(event) {
        if ((event.keyCode === 13) && this.validateFilename()) {
            this._refs.width.focus();
        }
    }

    onApply() {
        if (!this.validate()) {
            return;
        }
        let extension = path.getExtension(this._filename);
        if (extension === '') {
            this._filename += '.rgf';
        }
        let filename = path.join(this._activeDirectory, this._filename);
        dispatcher.dispatch(
            'Create.Image',
            {
                filename: filename,
                width:    this._width,
                height:   this._height
            }
        );
        this.hide();
    }

    validate() {
        let result = this.validateFilename();
        if (result) {
            result = super.validate();
        }
        return result;
    }
};
