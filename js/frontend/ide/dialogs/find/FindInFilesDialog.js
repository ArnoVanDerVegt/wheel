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
        this._fileTypes = [];
        this._cancel    = false;
        this.initWindow({
            showSignal: 'Dialog.FindInFiles.Show',
            width:      544,
            height:     336,
            className:  'find-dialog find-in-files',
            title:      'Find in files'
        });
    }

    initWindowContent(opts) {
        return [
            {
                className: 'abs dialog-cw dialog-lt find-dialog-text',
                children: [
                    this.initTextInputRow({
                        className:      'flt max-w input-row filename',
                        labelClassName: 'flt input-label',
                        label:          'File',
                        ref:            this.setRef('find'),
                        tabIndex:       10,
                        onKeyUp:        this.onFindKeyUp.bind(this),
                        placeholder:    'Enter text'
                    }),
                    this.initCheckboxRow({
                        className:      'flt max-w input-row',
                        labelClassName: 'flt input-label',
                        label:          'Match case',
                        ref:            this.setRef('caseSensitive'),
                        tabIndex:       11
                    }),
                    this.initTextRow('Search in file types'),
                    this.initCheckboxListRow({
                        title:       'Wheel file (*.whl)',
                        ref:         this.setRef('typeWhl'),
                        checked:     true,
                        tabIndex:    12
                    }),
                    this.initCheckboxListRow({
                        title:       'Wheel project file (*.whlp)',
                        ref:         this.setRef('typeWhlp'),
                        checked:     true,
                        tabIndex:    13
                    }),
                    this.initCheckboxListRow({
                        title:       'Wheel documentation file (*.woc)',
                        ref:         this.setRef('typeWoc'),
                        tabIndex:    14
                    })
                ]
            },
            this.addButtons('Search')
        ];
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
