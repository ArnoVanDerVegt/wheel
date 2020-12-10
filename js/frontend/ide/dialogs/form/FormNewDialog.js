/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher         = require('../../../lib/dispatcher').dispatcher;
const path               = require('../../../lib/path');
const ImageNewDialog     = require('../image/ImageNewDialog').ImageNewDialog;
const sourceBuilderUtils = require('../../source/sourceBuilderUtils');

exports.FormNewDialog = class extends ImageNewDialog {
    constructor(opts) {
        opts.showSignal = 'Dialog.Form.New.Show';
        opts.minWidth   = 128;
        opts.maxWidth   = 800;
        opts.minHeight  =  64;
        opts.maxHeight  = 600;
        opts.title      = 'New form';
        opts.applyTitle = 'Create new form';
        super(opts);
    }

    show() {
        super.show();
        let refs = this._refs;
        refs.width
            .setValue(400)
            .setClassName('');
        refs.height
            .setValue(320)
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
        let formFilename = path.join(this._activeDirectory, this._filename);
        let whlFilename  = path.replaceExtension(formFilename, '.whl');
        dispatcher
            .dispatch(
                'Create.File',
                {
                    filename: whlFilename,
                    value:    ['#include "lib/modules/components/form.whl"', ''].
                        concat(sourceBuilderUtils.getFormCode(this._filename)).join('\n')
                }
            )
            .dispatch(
                'Create.Form',
                {
                    filename: formFilename,
                    width:    this._width,
                    height:   this._height
                }
            );
        this.hide();
    }
};
