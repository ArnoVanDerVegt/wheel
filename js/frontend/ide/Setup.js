/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode         = require('../lib/dom').DOMNode;
const dispatcher      = require('../lib/dispatcher').dispatcher;
const path            = require('../lib/path');
const Button          = require('../lib/components/Button').Button;
const getDataProvider = require('../lib/dataprovider/dataProvider').getDataProvider;
const getImage        = require('./data/images').getImage;
const FileDialog      = require('./dialogs/file/FileDialog').FileDialog;

exports.Setup = class extends DOMNode {
    constructor(opts) {
        super(opts);
        new FileDialog({getImage: getImage, ui: opts.ui, settings: opts.settings});
        this._ui       = opts.ui;
        this._uiId     = opts.ui.getNextUIId();
        this._hidden   = false;
        this._settings = opts.settings;
        let settings = this._settings;
        if (settings.getDocumentPathExists()) {
            opts.onFinished();
            this._hidden = true;
        } else {
            this._ui.pushUIId(this._uiId);
        }
        this._homedir    = settings.getUserDocumentPath();
        this._files      = null;
        this._onFinished = opts.onFinished;
        this.initDOM(document.body);
        dispatcher
            .on('Setup.Show',                this, this.onShow)
            .on('Dialog.File.OpenDirectory', this, this.onSelectInstallDirectory);
    }

    initDOM(parentNode) {
        let homedir  = this._homedir;
        let settings = this._settings;
        this.create(
            parentNode,
            {
                id:        this.setSetupElement.bind(this),
                className: 'setup' + (this._hidden ? ' hidden' : ''),
                children: [
                    {
                        className: 'setup-image-clip',
                        children: [
                            {
                                type: 'img',
                                src:  getImage('images/logos/wheelBlack.svg')
                            }
                        ]
                    },
                    {
                        className: 'setup-content-wrapper',
                        children: [
                            {
                                type: 'h1',
                                children: [
                                    {
                                        type:      'img',
                                        src:       getImage('images/logos/wheelWhite.svg'),
                                        width:     64,
                                        height:    64
                                    },
                                    {
                                        type:      'span',
                                        innerHTML: 'Wheel setup'
                                    }
                                ]
                            },
                            {
                                className: 'text',
                                innerHTML: 'Welcome to Wheel, this setup installs library, help, image, sound and examples files.'
                            },
                            {
                                className: 'title',
                                innerHTML: 'Install wheel in:'
                            },
                            {
                                className: 'homedir',
                                children: [
                                    {
                                        id:        this.setHomeDirElement.bind(this),
                                        className: 'current',
                                        innerHTML: homedir + '<span>' + '/' + 'Wheel</span>'
                                    },
                                    {
                                        id:       this.setHomedirButtonElement.bind(this),
                                        type:     Button,
                                        uiOwner:  this,
                                        tabIndex: 1,
                                        value:    'Change',
                                        onClick:  this.onChangeHomeDir.bind(this)
                                    }
                                ]
                            },
                            {
                                id:        this.setProgressElement.bind(this),
                                className: 'progress',
                                children: [
                                    {
                                        id:        this.setCurrentFileElement.bind(this),
                                        className: 'current-file'
                                    },
                                    {
                                        className: 'setup-progress-bar',
                                        children: [
                                            {
                                                id:        this.setProgressBarElement.bind(this),
                                                className: 'bar'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                className: 'buttons',
                                children: [
                                    {
                                        ref:       this.setRef('cancelButton'),
                                        type:      Button,
                                        uiOwner:   this,
                                        tabIndex:  3,
                                        hidden:    true,
                                        value:     'Cancel',
                                        onClick:   this.onCancel.bind(this)
                                    },
                                    {
                                        ref:       this.setRef('installWheelFilesButton'),
                                        type:      Button,
                                        uiOwner:   this,
                                        tabIndex:  2,
                                        value:     'Install wheel files',
                                        onClick:   this.onInstallWheelFiles.bind(this)
                                    },
                                    (settings.getIsInApplicationsFolder() || (settings.getOS().platform !== 'darwin')) ?
                                        null :
                                        {
                                            ref:       this.setRef('moveToApplicationFolder'),
                                            type:      Button,
                                            uiOwner:   this,
                                            tabIndex:  2,
                                            value:     'Move to applications folder',
                                            onClick:   this.onMoveToApplicationFolder.bind(this)
                                        }
                                ]
                            }
                        ]
                    }
                ]
            }
        );
    }

    getUI() {
        return this._ui;
    }

    getUIId() {
        return this._uiId;
    }

    setSetupElement(element) {
        this._setupElement = element;
    }

    setHomeDirElement(element) {
        this._homedirElement = element;
    }

    setHomedirButtonElement(element) {
        this._homedirButtonElement = element;
    }

    setProgressElement(element) {
        this._progressElement = element;
    }

    setCurrentFileElement(element) {
        this._currentFileElement = element;
    }

    setProgressBarElement(element) {
        this._progressBarElement = element;
    }

    onChangeHomeDir() {
        dispatcher.dispatch(
            'Dialog.File.Show',
            {
                mode: 'openDirectory',
                index: 'sourceFolder',
                title: 'Select wheel folder',
                path:  this._homedir
            }
        );
    }

    onSelectInstallDirectory(index, path) {
        this._homedir                  = path;
        this._homedirElement.innerHTML = this._homedir + '<span>' + '/' + 'Wheel</span>';
        dispatcher.dispatch('Settings.Set.DocumentPath', path + '/Wheel');
    }

    onInstallWheelFiles() {
        dispatcher.dispatch('Settings.Set.DocumentPath', this._homedir + '/Wheel');
        this._fileIndex = 0;
        this._homedirButtonElement.setDisabled(true);
        this._refs.installWheelFilesButton.setDisabled(true);
        this._refs.cancelButton.setDisabled(true);
        this.installFile();
    }

    onMoveToApplicationFolder() {
        this._refs.moveToApplicationFolder.setDisabled(true);
        const ipcRenderer = require('electron').ipcRenderer;
        ipcRenderer.send('postMessage', {command: 'moveToApplicationsFolder'});
    }

    onCancel() {
        this.hide();
    }

    createPath(filename, callback) {
        let i = filename.lastIndexOf('/');
        if (i === -1) {
            i = filename.lastIndexOf('\\');
        }
        let p = filename.substr(0, i);
        getDataProvider().getData('post', 'ide/path-create', {path: p}, callback);
    }

    createFile(filename, data, callback) {
        this._currentFileElement.innerHTML = filename;
        getDataProvider().getData('post', 'ide/file-save-base64-as-binary', {filename: filename, data: data}, callback);
    }

    onCreatedPath() {
        this.createFile(this._currentFilepath, this._currentData, this.onCreatedFile.bind(this));
    }

    onCreatedFile() {
        this._progressBarElement.style.width = (this._fileIndex * 100 / this._files.length) + '%';
        setTimeout(this.installFile.bind(this), 1);
    }

    onShow(opts) {
        let refs = this._refs;
        this._setupElement.className = 'setup';
        this._fileIndex              = 0;
        refs.cancelButton
            .setDisabled(false)
            .setVisible(true);
        this._homedirButtonElement
            .setDisabled(false)
            .focus();
        refs.installWheelFilesButton.setDisabled(false);
        this._ui.pushUIId(this._uiId);
        if (opts && opts.canCancel) {
            refs.moveToApplicationFolder && refs.moveToApplicationFolder.setVisible(false);
            refs.cancelButton.setVisible(true);
        }
        return this;
    }

    hide() {
        this._setupElement.className = 'setup hidden';
        this._ui.popUIId();
        return this;
    }

    installFile() {
        const templates = require('./data/templates');
        if (this._files === null) {
            this._files = Object.keys(templates.files);
        }
        let index = this._fileIndex;
        if (index >= this._files.length) {
            this._progressElement.style.display = 'none';
            this._onFinished();
            setTimeout(this.hide.bind(this), 500);
            dispatcher.dispatch('Dialog.Help.Rebuild');
            return;
        }
        this._progressElement.style.display = 'block';
        this._fileIndex++;
        this._currentFilename = this._files[index];
        this._currentFilepath = path.makePlatformPath(path.join(this._homedir, this._files[index]));
        this._currentData     = templates.files[this._currentFilename];
        this.createPath(this._currentFilepath, this.onCreatedPath.bind(this));
    }
};
