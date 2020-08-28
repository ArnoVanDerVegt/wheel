/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const getDataProvider = require('../../../lib/dataprovider/dataProvider').getDataProvider;
const dispatcher      = require('../../../lib/dispatcher').dispatcher;
const path            = require('../../../lib/path');
const FindDialog      = require('./FindDialog').FindDialog;

exports.FindInFilesDialog = class extends FindDialog {
    constructor(opts) {
        super(opts);
        this.createWindow(
            'find-dialog find-in-files',
            'Find in files',
            [
                {
                    className: 'find-dialog-text',
                    children: [
                        this.addTextInputRow({
                            title:      'Find',
                            ref:        'find',
                            tabIndex:    10,
                            onKeyUp:     this.onFindKeyUp.bind(this),
                            placeholder: 'Enter text'
                        }),
                        this.addCheckboxRow({
                            title:       'Match case',
                            ref:         'caseSensitive',
                            tabIndex:    11
                        }),
                        this.addTextRow('Search in file types'),
                        this.addSmallCheckboxRow({
                            title:       'Wheel file (*.whl)',
                            ref:         'typeWhl',
                            checked:     true,
                            tabIndex:    12
                        }),
                        this.addSmallCheckboxRow({
                            title:       'Wheel project file (*.whlp)',
                            ref:         'typeWhlp',
                            checked:     true,
                            tabIndex:    13
                        }),
                        this.addSmallCheckboxRow({
                            title:       'Wheel documentation file (*.woc)',
                            ref:         'typeWoc',
                            tabIndex:    14
                        })
                    ]
                },
                this.addButtons('Search')
            ]
        );
        dispatcher.on('Dialog.FindInFiles.Show', this, this.onShow);
        this._fileTypes = [];
        this._cancel    = false;
    }

    validateFind() {
        let result = false;
        let refs   = this._refs;
        if (refs.find.getValue().trim() === '') {
            refs.find.setClassName('invalid');
        } else {
            refs.find.setClassName('');
            result = true;
        }
        return result;
    }

    validate() {
        return this.validateFind();
    }

    onFindKeyUp(event) {
        if ((event.keyCode === 13) && this.validateFind()) {
            this.onApply();
        }
    }

    onShow() {
        this._cancel = true;
        super.show();
        this._refs.find.focus();
    }

    onSearchFile(data) {
        if (this._cancel) {
            this._cancel = false;
            return;
        }
        if (data !== null) {
            try {
                data = JSON.parse(data);
                if (data.found.length) {
                    dispatcher.dispatch('Console.FindResult', data);
                }
            } catch (error) {
            }
        }
        if (this._fileIndex >= this._files.length) {
            return;
        }
        let filename = this._files[this._fileIndex++];
        if (this._fileTypes.indexOf(path.getExtension(filename)) === -1) {
            this.onSearchFile(null);
            return;
        }
        getDataProvider().getData(
            'post',
            'ide/find-in-file',
            {
                filename:      filename,
                text:          this._refs.find.getValue(),
                caseSensitive: this._refs.caseSensitive.getChecked()
            },
            this.onSearchFile.bind(this)
        );
    }

    onFilesInPath(data) {
        try {
            this._files = JSON.parse(data);
        } catch (error) {
            return;
        }
        this._fileIndex = 0;
        dispatcher.dispatch('Console.FindResults.Clear');
        this.onSearchFile(null);
    }

    onApply() {
        let refs = this._refs;
        this._cancel           = false;
        this._fileTypes.length = 0;
        refs.typeWhl.getChecked()  && this._fileTypes.push('.whl');
        refs.typeWhlp.getChecked() && this._fileTypes.push('.whlp');
        refs.typeWoc.getChecked()  && this._fileTypes.push('.woc');
        getDataProvider().getData('get', 'ide/files-in-path', {}, this.onFilesInPath.bind(this));
        this.hide();
    }
};
