/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const DOMNode    = require('../../../lib/dom').DOMNode;
const path       = require('../../../lib/path');
const Dialog     = require('../../../lib/components/Dialog').Dialog;

exports.FileRenameDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this._ui = opts.ui;
        this.createWindow(
            'file-rename-dialog',
            'Rename',
            [
                {
                    className: 'file-rename-text',
                    children: [
                        {
                            ref:       this.setRef('name'),
                            className: 'file-rename-row name',
                            innerHTML: 'Hello'
                        },
                        {
                            className: 'file-rename-row',
                            children: [
                                {
                                    innerHTML: 'New name'
                                },
                                this.addTextInput({
                                    ref:         this.setRef('filename'),
                                    tabIndex:    1,
                                    onKeyUp:     this.onFilenameKeyUp.bind(this),
                                    placeholder: 'Enter filename'
                                })
                            ]
                        }
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
        dispatcher.on('Dialog.File.Rename.Show', this, this.onShow);
    }

    onShow(title, documentPath, filename, onApply) {
        let refs = this._refs;
        refs.name.innerHTML  = filename.substr(documentPath.length, filename.length - documentPath.length);
        refs.title.innerHTML = title;
        this._onApply        = onApply;
        super.show();
        refs.filename
            .setValue(path.getPathAndFilename(filename).filename)
            .setClassName('')
            .focus();
    }

    onApply() {
        if (!this.validate()) {
            this._refs.filename.focus();
            return;
        }
        this.hide();
        this._onApply && this._onApply(this._filename);
    }

    onFilenameKeyUp(event) {
        if ((event.keyCode === 13) && this.validate()) {
            this.onApply();
        }
    }

    validate() {
        let result = true;
        this._filename = this._refs.filename.getValue().trim();
        if (this._filename === '') {
            this._refs.filename.setClassName('invalid');
            result = false;
        }
        return result;
    }
};
