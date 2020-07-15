/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
(function() {
    let pathByIndex       = {};
    let localStorageFiles = null;
    let changes           = [];

    class DirectoryList {
        constructor() {
            this._list = [];
        }

        addItem(name, directory, readonly) {
            let list = this._list;
            for (let i = 0; i < list.length; i++) {
                if (list[i].name === name) {
                    return;
                }
            }
            list.push({
                toString: function() {
                    return (this.directory ? 'aaaaaaaaaaaaaaaa' : 'zzzzzzzzzzzzzzzz') + this.name;
                },
                name:      name,
                directory: directory,
                readonly:  readonly
            });
        }

        getList() {
            this._list.sort();
            return this._list;
        }
    }

    class LocalStorageFiles {
        constructor() {
            try {
                let data = localStorage.getItem('WHEEL_FILES') || '';
                this.dispatchSize(data.length);
                this._files = JSON.parse(data);
            } catch (error) {
            }
            if (!this._files) {
                this._files = {};
            }
        }

        dispatchSize(size) {
            let dispatcher = require('./js/frontend/lib/dispatcher').dispatcher;
            dispatcher.dispatch('LocalStorage.Size', Math.min(size / (1024 * 1024) * 100, 100));
        }

        _save() {
            try {
                let data = JSON.stringify(this._files);
                this.dispatchSize(data.length);
                localStorage.setItem('WHEEL_FILES', data) || '';
            } catch (error) {
            }
        }

        getFiles() {
            return this._files;
        }

        deleteFile(filename) {
            delete this._files[filename];
            this._save();
        }

        setFile(filename, data) {
            this._files[filename] = data;
            this._save();
        }

        createDirectory(directory) {
            if (this._files[directory] === '/') {
                return true;
            } else if (directory in this._files) {
                return false;
            }
            this._files[directory] = String.fromCharCode(27);
            this._save();
            return true;
        }

        deleteDirectory(directory) {
            delete(this._files[directory]);
            this._save();
        }
    }

    const getLocalStorageFiles = function() {
            if (localStorageFiles) {
                return localStorageFiles;
            }
            localStorageFiles = new LocalStorageFiles();
            return localStorageFiles;
        };

    const getFilesInPath = function(p, files, directoryList, readonly) {
            let path = require('./js/frontend/lib/path');
            for (let filename in files) {
                if (filename.indexOf(p) !== 0) {
                    continue;
                }
                let withoutPath     = path.removePath(p, filename);
                let pathAndFilename = path.getPathAndFilename(withoutPath);
                let i               = pathAndFilename.path.indexOf('/');
                if (i === -1) {
                    if (pathAndFilename.path !== '') {
                        directoryList.addItem(pathAndFilename.path, true, readonly);
                    }
                } else {
                    directoryList.addItem(pathAndFilename.path.substr(0, i), true, readonly);
                }
                if (files[filename] === String.fromCharCode(27)) {
                    directoryList.addItem(pathAndFilename.filename, true, readonly);
                } else if (pathAndFilename.path === '') {
                    directoryList.addItem(pathAndFilename.filename, false, readonly);
                }
            }
        };

    const getPathByIndex = function(index) {
            if (index in pathByIndex) {
                return pathByIndex[index];
            }
            pathByIndex[index] = 'Wheel';
            return pathByIndex[index];
        };

    exports.ideRoutes = {
        files: function(params, callback) {
            getLocalStorageFiles();
            let currentPath;
            if ('changePath' in params) {
                currentPath = getPathByIndex(params.index);
                if (params.changePath === '..') {
                    let i = currentPath.lastIndexOf('/');
                    if (i !== -1) {
                        currentPath = currentPath.substr(0, i);
                    }
                } else {
                    currentPath += '/' + params.changePath;
                }
            } else if ('path' in params) {
                currentPath = params.path;
            } else {
                currentPath = getPathByIndex(params.index);
            }
            pathByIndex[params.index] = currentPath;
            let directoryList = new DirectoryList();
            getFilesInPath(currentPath, require('./js/frontend/ide/data/templates').files, directoryList, true);
            getFilesInPath(currentPath, getLocalStorageFiles().getFiles(),                 directoryList, false);
            if (currentPath !== 'Wheel') {
                directoryList.addItem('..', true, true);
            }
            callback({
                path:  currentPath,
                files: directoryList.getList()
            });
        },
        file: function(params, callback) {
            let path       = require('./js/frontend/lib/path');
            let files      = require('./js/frontend/ide/data/templates').files;
            let localFiles = getLocalStorageFiles().getFiles();
            let extension  = path.getExtension(params.filename);
            let data       = null;
            let filenames  = (typeof params.filename === 'string') ? [params.filename] : params.filename;
            let filename   = '';
            const findFile = (filename) => {
                    if (filename in files) {
                        return atob(files[filename]);
                    } else if ('Wheel' + filename in files) {
                        return atob(files['Wheel' + filename]);
                    } else if (filename in localFiles) {
                        return localFiles[filename];
                    }
                    return null;
                };
            for (let i = filenames.length - 1; i >= 0; i--) {
                filename = filenames[i];
                data     = findFile(filename);
                if (data) {
                    break;
                }
            }
            switch (extension) {
                case '.rgf':
                    const RgfImage = require('./js/shared/lib/RgfImage').RgfImage;
                    data = new RgfImage().unpack(data);
                    break;
                case '.rsf':
                    let rsf = [];
                    for (let i = 0; i < data.length; i++) {
                        rsf.push(data.charCodeAt(i));
                    }
                    data = {data: rsf};
                    break;
                case '.wfrm':
                    let whlData  = findFile(path.replaceExtension(filename, '.whl'));
                    let whlpData = findFile(path.replaceExtension(filename, '.whlp'));
                    if (whlData || whlpData) {
                        data = {wfrm: data, whl: whlData || whlpData, isProject: !!whlpData};
                    } else {
                        data = {wfrm: data, whl: whlData || whlpData};
                    }
                    break;
            }
            callback(JSON.stringify({success: !!data, data: data}));
        },
        fileSave(params, callback) {
            getLocalStorageFiles().setFile(params.filename, params.data);
            changes.push({eventType: 'change', path: params.filename});
            callback && callback({success: true});
        },
        fileDelete(params, callback) {
            getLocalStorageFiles().deleteFile(params.filename);
            changes.push({eventType: 'change', path: params.filename});
            callback && callback({success: true});
        },
        filesInPath(params, callback) {
            let files = require('./js/frontend/ide/data/templates').files;
            callback(JSON.stringify(Object.keys(files)));
        },
        settingsLoad(params, callback) {
            let settings = {};
            try {
                settings = JSON.parse(localStorage.getItem('WHEEL_SETTINGS') || '');
            } catch (error) {
                settings = {};
            }
            settings.version      = '0.9.1';
            settings.documentPath = 'Wheel';
            settings.os           = {
                homedir:  '',
                platform: (navigator.platform.toLowerCase().indexOf('mac') !== -1) ? 'darwin' : 'windows',
                arch:     '?',
                pathSep:  '/'
            };
            callback(settings);
        },
        settingsSave(params, callback) {
            try {
                localStorage.setItem('WHEEL_SETTINGS', JSON.stringify(params.settings));
            } catch (error) {
            }
        },
        changes(params, callback) {
            callback(JSON.stringify(changes));
            changes.length = 0;
        },
        pathCreate(params, callback) {
            callback({success: true});
        },
        directoryCreate(params, callback) {
            callback({success: getLocalStorageFiles().createDirectory(params.directory)});
            changes.push({eventType: 'change', path: params.directory});
        },
        directoryDelete(params, callback) {
            getLocalStorageFiles().deleteDirectory(params.directory);
            let path = require('./js/frontend/lib/path');
            callback({success: true});
            changes.push({eventType: 'change', path: path.getPathAndFilename(params.directory).path});
        }
    };
})();
