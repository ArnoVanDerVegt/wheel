/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher  = require('../../../lib/dispatcher').dispatcher;
const ImageDialog = require('./ImageDialog').ImageDialog;

exports.ImageResizeDialog = class extends ImageDialog {
    constructor(opts) {
        super(opts);
        this.initWindow({
            showSignal: 'Dialog.Image.Resize.Show',
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

    onShow(width, height) {
        super.show();
        let refs = this._refs;
        refs.width.setValue(width);
        refs.height.setValue(height);
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
