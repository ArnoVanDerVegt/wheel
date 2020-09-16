/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const platform        = require('../../../lib/platform');
const dispatcher      = require('../../../lib/dispatcher').dispatcher;
const path            = require('../../../lib/path');
const Files           = require('../../../lib/components/files/Files').Files;
const Dialog          = require('../../../lib/components/Dialog').Dialog;
const ToolOptions     = require('../../../lib/components/ToolOptions').ToolOptions;
const getDataProvider = require('../../../lib/dataprovider/dataProvider').getDataProvider;
const getImage        = require('../../data/images').getImage;
const FileDialog      = require('./FileDialog').FileDialog;

exports.FileOpenDialog = class extends FileDialog {
    constructor(opts) {
        opts.help = 'Supportedfile';
        super(opts);
        this._index       = 'main';
        this._currentFile = null;
        this.initWindow('file-dialog', 'Open file', this.initWindowContent(opts));
        dispatcher
            .on('Dialog.File.Show',    this, this.onShow)
            .on('Dialog.Confirm.Save', this, this.onSaveConfirmed);
    }

    initWindowContent(opts) {
        return [
            {
                ref:       this.setRef('currentPath'),
                className: 'current-path',
                innerHTML: ''
            },
            platform.isElectron() ?
                this.addToolOptions({
                    uiId:     this.getUIId.bind(this),
                    tabIndex: 1,
                    tool:     this._settings.getFilesDetail() ? 1 : 0,
                    label:    'View:',
                    color:    'green',
                    onSelect: this.onSelectDetail.bind(this),
                    options: [
                        {title: 'Normal',   icon: 'icon-list'},
                        {title: 'Detailed', icon: 'icon-list-detail'}
                    ]
                }) :
                null,
            {
                ref:      this.setRef('files'),
                type:     Files,
                ui:       this._ui,
                tabIndex: 2,
                detail:   this._settings.getFilesDetail(),
                filter:   ['.whl', '.whlp', '.rgf', '.rtf', '.rsf', '.txt', '.mp3', '.bmp', '.png', '.jpg', '.jpeg', '.gif', '.lms', '.wfrm'],
                getImage: this._getImage,
                getFiles: this.getFiles.bind(this),
                onFile:   this.onFile.bind(this),
                onPath:   this.onPath.bind(this)
            },
            {
                className: 'buttons',
                children: [
                    this.addButton({
                        ref:       this.setRef('buttonApply'),
                        tabIndex:  2049,
                        disabled:  true,
                        value:     'Open',
                        onClick:   this.onApply.bind(this)
                    }),
                    this.addButton({
                        tabIndex:  2050,
                        value:     'Cancel',
                        color:     'dark-green',
                        onClick:   this.hide.bind(this)
                    }),
                    {
                        ref:       this.setRef('currentFile'),
                        className: 'current-file'
                    },
                    this.addTextInput({
                        ref:         this.setRef('currentFileInput'),
                        tabIndex:    2048,
                        className:   'current-file-input',
                        onKeyUp:     this.onCurrentFileInputKeyUp.bind(this),
                        placeholder: 'Enter filename'
                    })
                ]
            }
        ];
    }

    onShow(opts) {
        let filename = opts.filename;
        let refs     = this._refs;
        this._mode  = opts.mode;
        this._index = opts.index;
        switch (opts.mode) {
            case 'openFile':
                refs.title.innerHTML           = 'Open file';
                refs.currentFile.style.display = 'block';
                refs.currentFileInput.hide();
                refs.buttonApply
                    .setValue('Open')
                    .setDisabled(true);
                refs.files
                    .setDocumentPath(this._settings.getDocumentPath())
                    .setFilter(['.whl', '.whlp', '.rgf', '.rtf', '.rsf', '.txt', '.mp3', '.bmp', '.png', '.jpg', '.jpeg', '.gif', '.lms', '.wfrm']);
                this.getFiles(
                    false,
                    false,
                    (path, files) => {
                        this._refs.files.onShowFiles(path, files);
                    }
                );
                break;
            case 'openDirectory':
                refs.title.innerHTML           = opts.title || 'Select directory';
                refs.currentFile.style.display = 'block';
                refs.currentFileInput.hide();
                refs.buttonApply
                    .setValue('Select')
                    .setDisabled(false);
                refs.files
                    .setDocumentPath(this._settings.getDocumentPath())
                    .setFilter([]);
                this.getFiles(
                    false,
                    opts.path,
                    (path, files) => {
                        this._refs.files.onShowFiles(path, files);
                    }
                );
                break;
            case 'saveFile':
                this._startFilename  = filename;
                this._extension      = path.getExtension(filename);
                refs.title.innerHTML = 'Save file';
                refs.currentFileInput
                    .show()
                    .setValue(filename)
                    .setClassName('current-file-input');
                refs.buttonApply
                    .setValue('Save')
                    .setDisabled(filename.trim() === '');
                refs.files
                    .setDocumentPath(this._settings.getDocumentPath())
                    .setFilter(['.whl', '.whlp', '.rgf', '.rtf', '.rsf', '.txt', '.mp3', '.bmp', '.png', '.jpg', '.jpeg', '.gif', '.lms', '.wfrm']);
                this.getFiles(
                    false,
                    path,
                    (path, files) => {
                        this._refs.files.onShowFiles(path, files);
                    }
                );
                break;
        }
        refs.files.load();
        this.show();
    }

    onSelectDetail(detail) {
        this._refs.files.setDetail(detail === 1);
        dispatcher.dispatch('Settings.Set.FilesDetail', detail === 1);
    }

    onSaveConfirmed() {
        this._save();
    }

    onApply() {
        switch (this._mode) {
            case 'openFile':
                if (this._currentFile) {
                    let filename = path.join(this._refs.files.getPath(), this._currentFile);
                    dispatcher.dispatch('Dialog.File.Open', filename);
                }
                this.hide();
                break;
            case 'openDirectory':
                dispatcher.dispatch('Dialog.File.OpenDirectory', this._index, this._refs.files.getPath());
                this.hide();
                break;
            case 'saveFile':
                let filename = this._refs.currentFileInput.getValue().trim();
                if (filename !== '') {
                    let saveFilename = path.join(this._refs.files.getPath(), filename);
                    if (path.getExtension(saveFilename) === '') {
                        saveFilename += this._extension;
                    }
                    let save = () => {
                            dispatcher.dispatch('Dialog.File.SaveAs', saveFilename, this._startFilename === saveFilename);
                            this.hide();
                        };
                    let existingFile = this.getFileExists(this._refs.files.getFiles(), filename);
                    if (existingFile && (filename.toLowerCase() !== this._startFilename.toLowerCase())) {
                        if (existingFile.directory) {
                            dispatcher.dispatch(
                                'Dialog.Alert.Show',
                                {
                                    title: 'Error',
                                    lines: [
                                        '"' + saveFilename + '" is a directory.',
                                        'You can not save this file with this filename.'
                                    ]
                                }
                            );
                        } else {
                            this._save = save;
                            dispatcher.dispatch(
                                'Dialog.Confirm.Show',
                                {
                                    title: 'File exists',
                                    lines: [
                                        'The file "' + saveFilename + '" already exists.',
                                        'Do you want to overwrite it?'
                                    ],
                                    dispatchApply: 'Dialog.Confirm.Save'
                                }
                            );
                        }
                    } else {
                        save();
                    }
                }
                break;
        }
    }

    onCurrentFileInputKeyUp() {
        let refs = this._refs;
        if (refs.currentFileInput.getValue().trim() === '') {
            refs.buttonApply.setDisabled(true);
            refs.currentFileInput.setClassName('current-file-input invalid');
            return false;
        }
        refs.buttonApply.setDisabled(false);
        refs.currentFileInput.setClassName('current-file-input');
        return true;
    }

    onPath(path) {
        this._refs.currentPath.innerHTML = path;
    }

    onFile(file) {
        let refs = this._refs;
        switch (this._mode) {
            case 'openFile':
                if (file) {
                    if (file.name === this._currentFile) {
                        dispatcher.dispatch('Dialog.File.Open', path.join(refs.files.getPath(), file.name));
                        this.hide();
                    }
                    refs.buttonApply.setDisabled(false);
                    this._currentFile          = file.name;
                    refs.currentFile.innerHTML = this._currentFile;
                } else {
                    refs.buttonApply.setDisabled(true);
                    this._currentFile          = null;
                    refs.currentFile.innerHTML = '';
                }
                break;
            case 'saveFile':
                if (file) {
                    refs.buttonApply.setDisabled(false);
                    refs.currentFileInput
                        .setClassName('current-file-input')
                        .setValue(file.name);
                }
                break;
        }
    }

    getFiles(changePath, path, callback) {
        let params = {index: this._index};
        let that   = this;
        if (changePath) {
            params.changePath = changePath;
        } else if (typeof path === 'string') {
            params.path = path;
        }
        if (this._mode === 'openDirectory') {
            params.fromRoot = true;
        }
        getDataProvider().getData(
            'get',
            'ide/files',
            params,
            (data) => {
                try {
                    let json = (typeof data === 'string') ? JSON.parse(data) : data;
                    this.onPath(json.path);
                    callback(json.path, json.files);
                } catch (error) {
                }
            }
        );
    }

    getFileExists(files, filename) {
        for (let i = 0; i < files.length; i++) {
            if (files[i].name.toLowerCase() === filename.toLowerCase()) {
                return files[i];
            }
        }
        return null;
    }
};
