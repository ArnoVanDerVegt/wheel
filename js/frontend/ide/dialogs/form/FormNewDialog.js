/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher     = require('../../../lib/dispatcher').dispatcher;
const path           = require('../../../lib/path');
const ImageNewDialog = require('../image/ImageNewDialog').ImageNewDialog;

exports.FormNewDialog = class extends ImageNewDialog {
    constructor(opts) {
        opts.title        = 'New form';
        opts.dispatchShow = 'Dialog.Form.New.Show';
        super(opts);
    }

    show() {
        super.show();
        let refs = this._refs;
        refs.width
            .setValue(256)
            .setClassName('');
        refs.height
            .setValue(256)
            .setClassName('');
    }

    onApply() {
        if (!this.validate()) {
            return;
        }
        let extension = path.getExtension(this._filename);
        if (extension === '') {
            this._filename += '.wfrm';
        }
        let filename = path.join(this._activeDirectory, this._filename);
        dispatcher.dispatch('Create.Form', filename, this._width, this._height);
        this.hide();
    }

    validateWidth() {
        let result = true;
        let refs   = this._refs;
        this._width = parseInt(refs.width.getValue().trim(), 10);
        if (isNaN(this._width) || (this._width < 128) || (this._width > 800)) {
            refs.width.setClassName('invalid');
            result = false;
        } else {
            refs.width.setClassName('');
        }
        return result;
    }

    validateHeight() {
        let result = true;
        let refs   = this._refs;
        this._height = parseInt(refs.height.getValue().trim(), 10);
        if (isNaN(this._height) || (this._height < 128) || (this._height > 600)) {
            refs.height.setClassName('invalid');
            result = false;
        } else {
            refs.height.setClassName('');
        }
        return result;
    }
};
