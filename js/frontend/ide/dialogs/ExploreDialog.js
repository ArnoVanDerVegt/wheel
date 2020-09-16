/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher      = require('../../lib/dispatcher').dispatcher;
const path            = require('../../lib/path');
const Files           = require('../../lib/components/files/Files').Files;
const Dialog          = require('../../lib/components/Dialog').Dialog;
const getDataProvider = require('../../lib/dataprovider/dataProvider').getDataProvider;

exports.ExploreDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this._settings    = opts.settings;
        this._ev3         = opts.ev3;
        this._currentFile = null;
        this.initWindow('ev3-file-viewer-dialog', 'EV3 File viewer', this.initWindowContent(opts));
        dispatcher
            .on('Dialog.Explore.Show',       this, this.onShow)
            .on('Dialog.CreateDir.Path',     this, this.onCreateDirecory)
            .on('Dialog.Confirm.DeleteItem', this, this.onDeleteItemConfirmed);
    }

    initWindowContent(opts) {
        return [
            // Left...
            {
                className:  'left-label',
                innerHTML:  'Local files:'
            },
            {
                ref:        this.setRef('leftPath'),
                className:  'left-path',
                innerHTML:  'Local'
            },
            this.addButton({
                ref:        this.setRef('copyToEV3'),
                tabIndex:   1,
                className:  'copy-to-ev3',
                icon:       'icon-right',
                disabled:   true,
                title:      'Copy file to EV3',
                onClick:    this.onCopyToEV3.bind(this)
            }),
            {
                ref:            this.setRef('localFiles'),
                type:           Files,
                uiOwner:        this,
                fileDialog:     this,
                className:      'left',
                tabIndex:       2,
                filter:         '*',
                canSelect:      true,
                colCount:       14,
                colCountDetail: 7,
                getImage:       this._getImage,
                getFiles:       this.getLocalFiles.bind(this),
                onSelect:       this.onSelectLocalFile.bind(this)
            },
            this.addToolOptions({
                ref:        this.setRef('leftView'),
                tabIndex:   3,
                tool:       this._settings.getLocalFilesDetail() ? 1 : 0,
                label:      false,
                onSelect:   this.onSelectLeftDetail.bind(this),
                className:  'left-view',
                color:      'green',
                options: [
                    {title: 'Normal',   icon: 'icon-list'},
                    {title: 'Detailed', icon: 'icon-list-detail'}
                ]
            }),
            // Right...
            {
                className:  'right-label',
                innerHTML:  'EV3 files:'
            },
            {
                ref:        this.setRef('rightPath'),
                className:  'right-path',
                innerHTML:  'EV3'
            },
            this.addButton({
                className:  'create-dir',
                icon:       'icon-add',
                title:      'Create directory',
                onClick:    this.onCreateDir.bind(this)
            }),
            this.addButton({
                ref:        this.setRef('delete'),
                className:  'delete',
                icon:       'icon-delete-default',
                title:      'Delete',
                onClick:    this.onDeleteItem.bind(this),
                disabled:   true
            }),
            {
                ref:            this.setRef('remoteFiles'),
                type:           Files,
                uiOwner:        this,
                fileDialog:     this,
                className:      'right',
                filter:         '*',
                canSelect:      true,
                colCount:       14,
                colCountDetail: 7,
                getImage:       this._getImage,
                getFiles:       this.getRemoteFiles.bind(this),
                onSelect:       this.onSelectRemoteFile.bind(this)
            },
            this.addToolOptions({
                ref:        this.setRef('rightView'),
                tabIndex:   15,
                tool:       this._settings.getRemoteFilesDetail() ? 1 : 0,
                label:      false,
                onSelect:   this.onSelectRightDetail.bind(this),
                className:  'right-view',
                color:      'green',
                options: [
                    {title: 'Normal',   icon: 'icon-list'},
                    {title: 'Detailed', icon: 'icon-list-detail'}
                ]
            }),
            {
                className: 'buttons',
                children: [
                    this.addButton({
                        value:    'Close',
                        tabIndex: 128,
                        onClick:  this.hide.bind(this)
                    })
                ]
            }
        ];
    }

    getLocalFiles(changePath, path, callback) {
        let that   = this;
        let uri    = 'ide/files';
        let params = {index: 'local'};
        if (changePath) {
            params.changePath = changePath;
        } else if (path) {
            params.path = path;
        }
        getDataProvider().getData(
            'get',
            uri,
            params,
            (data) => {
                try {
                    let json = JSON.parse(data);
                    this.onLeftPath(json.path);
                    callback(json.path, json.files);
                } catch (error) {
                }
            }
        );
    }

    getRemoteFiles(changePath, path, callback) {
        let that   = this;
        let params = {index: 'ev3'};
        if (changePath) {
            params.changePath =changePath;
        } else if (path) {
            params.path = path;
        }
        getDataProvider().getData(
            'get',
            'ev3/files',
            params,
            (data) => {
                try {
                    let json = JSON.parse(data);
                    this.onRightPath(json.path);
                    callback(json.path, json.files);
                } catch (error) {
                    dispatcher.dispatch(
                        'Dialog.Alert.Show',
                        {
                            title: 'Error',
                            lines: ['Failed to load remove file list.']
                        }
                    );
                    this._refs.remoteFiles.setLoading(false);
                }
            }
        );
    }

    getFileSelectable(file) {
        if (!file) {
            return false;
        }
        if (file.directory) {
            return false;
        }
        if (['.rbf', '.rgf', '.rtf', '.rsf'].indexOf(path.getExtension(file.filename)) === -1) {
            return false;
        }
        return true;
    }

    onSelectLocalFile(file) {
        this._refs.copyToEV3.setDisabled(!this.getFileSelectable(file));
    }

    onSelectRemoteFile(file) {
        this._refs.delete.setDisabled(!file);
    }

    onSelectLeftDetail(detail) {
        this._refs.localFiles.setDetail(detail);
        dispatcher.dispatch('Settings.Set.LocalFilesDetail', detail === 1);
    }

    onSelectRightDetail(detail) {
        this._refs.remoteFiles.setDetail(detail);
        dispatcher.dispatch('Settings.Set.RemoteFilesDetail', detail === 1);
    }

    onRemoteDirUpdated() {
        let remoteFiles = this._refs.remoteFiles;
        remoteFiles.setLoading(true);
        this.getRemoteFiles(
            false,
            false,
            remoteFiles.onShowFiles.bind(remoteFiles)
        );
        setTimeout(
            function() {
                remoteFiles.setLoading(false);
            },
            1000
        );
    }

    onCopyToEV3() {
        let localFiles    = this._refs.localFiles;
        let remoteFiles   = this._refs.remoteFiles;
        let localPath     = localFiles.getPath();
        let localFilename = localFiles.getFilename();
        let remotePath    = remoteFiles.getPath();
        if (localFilename && (['.rbf', '.rgf', '.rtf', '.rsf'].indexOf(path.getExtension(localFilename)) !== -1)) {
            remoteFiles.setLoading(true);
            this._ev3.download(
                path.join(localPath,  localFilename),
                path.join(remotePath, localFilename)
            );
            this.onRemoteDirUpdated();
        }
    }

    onCreateDir() {
        dispatcher.dispatch(
            'Dialog.DirectoryNew.Show',
            {
                validChars:      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_',
                activeDirectory: '',
                dispatchApply:   'Dialog.CreateDir.Path'
            }
        );
    }

    onDeleteItemConfirmed() {
        let refs        = this._refs;
        let remoteFiles = refs.remoteFiles;
        refs.delete.setDisabled(true);
        remoteFiles.setLoading(true);
        this._ev3.deleteFile(
            this._deleteFilename,
            (result) => {
                if (result.error) {
                    dispatcher.dispatch(
                        'Dialog.Alert.Show',
                        {
                            title: 'Error',
                            lines: ['An error occured while deleting the file or directory.']
                        }
                    );
                }
                this.onRemoteDirUpdated();
            }
        );
    }

    onDeleteItem() {
        let remoteFiles = this._refs.remoteFiles;
        this._deleteFilename = path.join(remoteFiles.getPath(), remoteFiles.getFilename());
        dispatcher.dispatch(
            'Dialog.Confirm.Show',
            {
                title:         'Confirm delete',
                lines:         ['Are you sure you want to delete "' + this._deleteFilename + '"?'],
                dispatchApply: 'Dialog.Confirm.DeleteItem'
            }
        );
    }

    onCreateDirecory(directory) {
        let remoteFiles = this._refs.remoteFiles.getFiles();
        let found       = false;
        for (let i = 0; i < remoteFiles.length; i++) {
            if (remoteFiles[i].name.toLowerCase() === directory.toLowerCase()) {
                found = true;
                break;
            }
        }
        if (found) {
            dispatcher.dispatch(
                'Dialog.Alert.Show',
                {
                    title: 'Error',
                    lines: ['There already exists an item with the name "' + directory + '".']
                }
            );
        } else {
            let remoteFiles = this._refs.remoteFiles;
            remoteFiles.setLoading(true);
            directory = path.join(remoteFiles.getPath(), directory);
            this._ev3.createDir(directory, this.onRemoteDirUpdated.bind(this));
        }
    }

    onApply() {
        this.hide();
    }

    onLeftPath(path) {
        this._refs.leftPath.innerHTML = path;
    }

    onRightPath(path) {
        this._refs.rightPath.innerHTML = path;
    }

    onFile(file) {
    }

    onShow() {
        this._ev3.stopPolling();
        this._refs.localFiles.load();
        this._refs.remoteFiles.load(true);
        this.show();
    }

    hide() {
        this._ev3.resumePolling();
        super.hide();
    }
};
