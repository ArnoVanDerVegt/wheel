/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const Dialog     = require('../../../lib/components/Dialog').Dialog;

exports.DirectoryNewDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this.initWindow('new-directory-dialog', 'New directory', this.initWindowContent(opts));
        dispatcher.on('Dialog.DirectoryNew.Show', this, this.onShow);
    }

    initWindowContent(opts) {
        return [
            {
                className: 'new-directory-text',
                children: [
                    {
                        className: 'new-directory-row',
                        children: [
                            {
                                innerHTML: 'Directory'
                            },
                            this.addTextInput({
                                ref:         this.setRef('directory'),
                                tabIndex:    1,
                                onKeyUp:     this.onDirectoryKeyUp.bind(this),
                                placeholder: 'Enter directory name'
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
        ];
    }

    onShow(opts) {
        this._validChars      = opts.validChars || false;
        this._dispatchApply   = opts.dispatchApply;
        this._activeDirectory = opts.activeDirectory;
        super.show();
        this._refs.directory
            .setValue('')
            .setClassName('')
            .focus();
    }

    onDirectoryKeyUp(event) {
        if (event.keyCode === 13) {
            this.onApply();
        }
    }

    onApply() {
        if (!this.validate()) {
            return;
        }
        let directory = (this._activeDirectory ? this._activeDirectory + '/' : '') + this._directory;
        dispatcher.dispatch(this._dispatchApply, directory);
        this.hide();
    }

    validate() {
        let directory  = this._refs.directory.getValue().trim();
        let validChars = this._validChars;
        if (validChars) {
            for (let i = 0; i < directory.length; i++) {
                if (validChars.indexOf(directory[i]) === -1) {
                    return false;
                }
            }
        }
        if (directory === '') {
            this._refs.directory.setClassName('invalid');
            return false;
        }
        this._directory = directory;
        return true;
    }
};
