/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path       = require('../../../../shared/lib/path');
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const DOMNode    = require('../../../lib/dom').DOMNode;
const FileDialog = require('./FileDialog').FileDialog;

const SHOW_SIGNAL = 'Dialog.File.Rename.Show';

exports.FileRenameDialog = class extends FileDialog {
    constructor(opts) {
        super(opts);
        this.initWindow({
            showSignal: SHOW_SIGNAL,
            width:      480,
            height:     208,
            className:  'file-rename-dialog',
            title:      'Rename'
        });
    }

    initWindowContent(opts) {
        return [
            {
                className: 'abs dialog-cw dialog-lt file-rename-text',
                children: [
                    {
                        ref:       this.setRef('name'),
                        className: 'flt text-row max-w',
                        innerHTML: ''
                    },
                    this.initTextInputRow({
                        className:      'flt max-w input-row filename file-new-row',
                        labelClassName: 'flt input-label',
                        label:          'New name',
                        ref:            this.setRef('filename'),
                        tabIndex:       1,
                        onKeyUp:        this.onFilenameKeyUp.bind(this),
                        placeholder:    'Enter filename'
                    })
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
        let refs = this._refs;
        refs.name.innerHTML  = opts.filename.substr(opts.documentPath.length, opts.filename.length - opts.documentPath.length);
        refs.title.innerHTML = opts.title;
        this._onApply        = opts.onApply;
        super.show();
        refs.filename
            .setValue(path.getPathAndFilename(opts.filename).filename)
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

exports.FileRenameDialog.SHOW_SIGNAL = SHOW_SIGNAL;
