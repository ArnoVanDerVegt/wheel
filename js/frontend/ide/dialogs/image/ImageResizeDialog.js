/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher  = require('../../../lib/dispatcher').dispatcher;
const ImageDialog = require('./ImageDialog').ImageDialog;

exports.ImageResizeDialog = class extends ImageDialog {
    constructor(opts) {
        super(opts);
        this.createWindow(
            'image-dialog',
            'Resize image',
            [
                {
                    className: 'image-dialog-text',
                    children: [
                        this.getWidthRow(),
                        this.getHeightRow()
                    ]
                },
                {
                    className: 'buttons',
                    children: [
                        this.addButton({
                            ref:      this.setRef('buttonApply'),
                            tabIndex: 128,
                            value:    'Ok',
                            onClick:  this.onApply.bind(this)
                        }),
                        this.addButton({
                            tabIndex: 129,
                            value:    'Cancel',
                            color:    'dark-green',
                            onClick:  this.hide.bind(this)
                        })
                    ]
                }
            ]
        );
        dispatcher.on('Dialog.Image.Resize.Show', this, this.onShow);
    }

    onShow(width, height) {
        super.show();
        let refs = this._refs;
        refs.width.value  = width;
        refs.height.value = height;
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
