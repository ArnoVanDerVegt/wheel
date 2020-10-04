/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode         = require('../../../../lib/dom').DOMNode;
const dispatcher      = require('../../../../lib/dispatcher').dispatcher;
const Button          = require('../../../../lib/components/Button').Button;
const ProgressBar     = require('../../../../lib/components/ProgressBar').ProgressBar;
const getDataProvider = require('../../../../lib/dataprovider/dataProvider').getDataProvider;
const path            = require('../../../../lib/path');

exports.Updater = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._files        = null;
        this._fileIndex    = 0;
        this._settings     = opts.settings;
        this._ui           = opts.ui;
        this._uiId         = opts.uiId;
        this._documentPath = this.getDocumentPath();
        this.initDOM(opts.parentNode);
        dispatcher.on('Updater.Confirm.UpdateFiles', this, this.onInstallWheelFilesConfirmed);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'update',
                children: [
                    {
                        ref:       this.setRef('currentFile'),
                        className: 'no-select current-file',
                        innerHTML: 'Path: ' + this._settings.getDocumentPath()
                    },
                    {
                        ref:   this.setRef('progressBar'),
                        type:  ProgressBar,
                        event: 'Settings.Update.Progress',
                        ui:    this._ui
                    },
                    {
                        className: 'update-button',
                        children: [
                            {
                                ref:      this.setRef('installWheelFilesButton'),
                                type:     Button,
                                color:    'blue',
                                ui:       this._ui,
                                uiId:     this._uiId,
                                tabIndex: 1,
                                value:    'Update files',
                                onClick:  this.onInstallWheelFiles.bind(this)
                            }
                        ]
                    }
                ]
            }
        );
        this._refs.progressBar.getElement().style.visibility = 'hidden';
    }

    getDocumentPath() {
        let documentPath = this._settings.getDocumentPath();
        if (documentPath.toLowerCase().substr(-6) === '/wheel') {
            documentPath = documentPath.substr(0, documentPath.length - 6);
        }
        return documentPath;
    }

    setCurrentFileElement(element) {
        this._currentFileElement = element;
    }

    setProgressBarElement(element) {
        this._progressBarElement = element;
    }

    createFile(filename, data, callback) {
        this._refs.currentFile.innerHTML = path.removePath(this._documentPath, filename);
        getDataProvider().getData('post', 'ide/file-save-base64-as-binary', {filename: filename, data: data}, callback);
    }

    createPath(filename, callback) {
        let i = filename.lastIndexOf('/');
        if (i === -1) {
            i = filename.lastIndexOf('\\');
        }
        let p = filename.substr(0, i);
        getDataProvider().getData('post', 'ide/path-create', {path: p}, callback);
    }

    onCreatedPath() {
        this.createFile(this._currentFilepath, this._currentData, this.onCreatedFile.bind(this));
    }

    onCreatedFile() {
        dispatcher.dispatch('Settings.Update.Progress', {value: this._fileIndex * 100 / this._files.length});
        setTimeout(this.installFile.bind(this), 1);
    }

    onInstallWheelFiles() {
        dispatcher.dispatch(
            'Dialog.Confirm.Show',
            {
                dispatchApply: 'Updater.Confirm.UpdateFiles',
                focus:         'cancel',
                title:         'Update files',
                lines: [
                    'Warning! If you have modified any standard Wheel files then',
                    'the changes will be overwritten. Do you wish to continue?'
                ]
            }
        );
    }

    onInstallWheelFilesConfirmed() {
        this._fileIndex = 0;
        this._refs.installWheelFilesButton.setDisabled(true);
        this.installFile();
    }

    installFile() {
        const templates = require('../../../data/templates');
        if (this._files === null) {
            this._files = Object.keys(templates.files);
        }
        let refs  = this._refs;
        let index = this._fileIndex;
        if (index >= this._files.length) {
            refs.currentFile.innerHTML = 'Path: ' + this._settings.getDocumentPath();
            refs.progressBar.getElement().style.visibility = 'hidden';
            refs.installWheelFilesButton.setDisabled(false);
            return;
        }
        refs.progressBar.getElement().style.visibility = 'visible';
        this._fileIndex++;
        this._currentFilename = this._files[index];
        this._currentFilepath = path.makePlatformPath(path.join(this._documentPath, this._files[index]));
        this._currentData     = templates.files[this._currentFilename];
        this.createPath(this._currentFilepath, this.onCreatedPath.bind(this));
    }
};
