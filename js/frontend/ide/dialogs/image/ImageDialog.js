/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const FileDialog = require('../file/FileDialog').FileDialog;

exports.ImageDialog = class extends FileDialog {
    constructor(opts) {
        super(opts);
        this._minWidth  = ('minWidth'  in opts) ? opts.minWidth  :   1;
        this._maxWidth  = ('maxWidth'  in opts) ? opts.maxWidth  : 178;
        this._minHeight = ('minHeight' in opts) ? opts.minHeight :   1;
        this._maxHeight = ('maxHeight' in opts) ? opts.maxHeight : 128;
    }

    show() {
        let refs = this._refs;
        refs.width
            .setValue(178)
            .setClassName('');
        refs.height
            .setValue(128)
            .setClassName('');
        super.show();
    }

    validate() {
        let result = this.validateWidth();
        if (result) {
            result = this.validateHeight();
        }
        return result;
    }

    getWidthRow() {
        return {
            className: 'image-dialog-row',
            children: [
                {
                    className: 'form-label',
                    innerHTML: 'Width'
                },
                this.addTextInput({
                    ref:         this.setRef('width'),
                    tabIndex:    10,
                    onKeyUp:     this.onWidthKeyUp.bind(this),
                    placeholder: 'Enter width'
                })
            ]
        };
    }

    getHeightRow() {
        return {
            className: 'image-dialog-row',
            children: [
                {
                    className: 'form-label',
                    innerHTML: 'Height'
                },
                this.addTextInput({
                    ref:         this.setRef('height'),
                    tabIndex:    11,
                    onKeyUp:     this.onHeightKeyUp.bind(this),
                    placeholder: 'Enter height'
                })
            ]
        };
    }

    onWidthKeyUp(event) {
        if ((event.keyCode === 13) && this.validateWidth()) {
            this._refs.height.focus();
        }
    }

    onHeightKeyUp() {
        if ((event.keyCode === 13) && this.validateHeight() && this.onApply) {
            this.onApply();
        }
    }
};
