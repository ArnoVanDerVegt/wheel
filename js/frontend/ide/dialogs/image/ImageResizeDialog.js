/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher  = require('../../../lib/dispatcher').dispatcher;
const ImageDialog = require('./ImageDialog').ImageDialog;

const SHOW_SIGNAL = 'Dialog.Image.Resize.Show';

exports.ImageResizeDialog = class extends ImageDialog {
    constructor(opts) {
        super(opts);
        this.initWindow({
            showSignal: SHOW_SIGNAL,
            width:      400,
            height:     216,
            className:  'image-dialog',
            title:      'Resize image'
        });
    }

    initWindowContent(opts) {
        return [
            {
                className: 'abs dialog-cw dialog-lt image-dialog-text',
                children: [
                    this.getWidthRow(),
                    this.getHeightRow()
                ]
            },
            this.initButtons([
                {
                    ref:      this.setRef('buttonApply'),
                    tabIndex: 128,
                    value:    'Ok',
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

    onShow(opts) {
        super.show();
        let refs = this._refs;
        refs.width.setValue(opts.width);
        refs.height.setValue(opts.height);
        refs.width.focus();
    }

    onApply() {
        if (!this.validate()) {
            return;
        }
        dispatcher.dispatch('ResizeImage', this._width, this._height);
        this.hide();
    }
};

exports.ImageResizeDialog.SHOW_SIGNAL = SHOW_SIGNAL;
