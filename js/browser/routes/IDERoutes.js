/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/

// Todo: Fix inconsistent responses: sometimes object, sometimes JSON string.

(function() {
    let pathByIndex         = {};
    let changes             = [];
    let requireDependencies = {};

    const getRequireDependency = (filename) => {
            if (filename in requireDependencies) {
                return requireDependencies[filename];
            }
            return require(filename);
        };

    exports.setRequireDependencies = (dependencies) => {
        requireDependencies = dependencies;
    };

    const getLocalStorageFiles = () => {
            return getRequireDependency('./js/browser/routes/LocalStorageFiles').getLocalStorageFiles();
        };

    const getFilesInPath = function(p, files, directoryList, readonly) {
            let path = getRequireDependency('./js/shared/lib/path');
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

    exports.IDERoutes = class {
        reset() {
            getRequireDependency('./js/browser/routes/LocalStorageFiles').reset();
            pathByIndex    = {};
            changes.length = 0;
            return this;
        }

        files(params, callback) {
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
            let DirectoryList = getRequireDependency('./js/browser/routes/DirectoryList').DirectoryList;
            let files         = getRequireDependency('./js/frontend/ide/data/templates').files;
            let directoryList = new DirectoryList();
            getFilesInPath(currentPath, files,                             directoryList, true);
            getFilesInPath(currentPath, getLocalStorageFiles().getFiles(), directoryList, false);
            if (currentPath !== 'Wheel') {
                directoryList.addItem('..', true, true);
            }
            callback({
                path:  currentPath,
                files: directoryList.getList()
            });
        }

        file(params, callback) {
            let path       = getRequireDependency('./js/shared/lib/path');
            let files      = getRequireDependency('./js/frontend/ide/data/templates').files;
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
                    const RgfImage = getRequireDependency('./js/shared/lib/RgfImage').RgfImage;
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
        }

        fileSave(params, callback) {
            getLocalStorageFiles().setFile(params.filename, params.data);
            changes.push({eventType: 'change', path: params.filename});
            callback && callback({success: true});
        }

        fileDelete(params, callback) {
            getLocalStorageFiles().deleteFile(params.filename);
            changes.push({eventType: 'change', path: params.filename});
            callback && callback({success: true});
        }

        filesInPath(params, callback) {
            let files = getRequireDependency('./js/frontend/ide/data/templates').files;
            callback(JSON.stringify(Object.keys(files)));
        }

        findInFile(params, callback) {
            let caseSensitive = params.caseSensitive;
            let filename      = params.filename;
            let text          = params.text;
            let textLength    = text.length;
            let result        = {filename: filename, text: text, found: []};
            const findInFile = (data) => {
                    let origLines;
                    if (!caseSensitive) {
                        origLines = data.split('\n');
                        data      = data.toLowerCase();
                        text      = text.toLowerCase();
                    }
                    let lines = data.split('\n');
                    if (caseSensitive) {
                        origLines = lines;
                    }
                    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
                        let line    = lines[lineNum];
                        let linePos = line.indexOf(text, 0);
                        while (linePos !== -1) {
                            result.found.push({line: origLines[lineNum], num: lineNum, pos: linePos});
                            linePos += textLength;
                            linePos = line.indexOf(text, linePos);
                        }
                    }
                    callback(JSON.stringify(result));
                };
            this.file(
                params,
                (file) => {
                    try {
                        file = JSON.parse(file);
                        if (file.success) {
                            findInFile(file.data);
                        } else {
                            callback(JSON.stringify(result));
                        }
                    } catch (error) {
                        callback(JSON.stringify(result));
                    }
                }
            );
        }

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
        }

        settingsSave(params, callback) {
            try {
                localStorage.setItem('WHEEL_SETTINGS', JSON.stringify(params.settings));
            } catch (error) {
            }
        }

        changes(params, callback) {
            callback(JSON.stringify(changes));
            changes.length = 0;
        }

        pathCreate(params, callback) {
            callback({success: true});
        }

        pathExists(params, callback) {
            let exists     = false;
            let path       = params.path;
            let files      = getRequireDependency('./js/frontend/ide/data/templates').files;
            let localFiles = getLocalStorageFiles().getFiles();
            if ((path in files) || (path in localFiles)) {
                exists = true;
            } else {
                let f = [files, localFiles];
                for (let i = 0; (i < f.length) && !exists; i++) {
                    for (let j in f[i]) {
                        if (j.indexOf(path) === 0) {
                            exists = true;
                        }
                        break;
                    }
                }
            }
            callback(JSON.stringify({success: true, exists: exists}));
        }

        directoryCreate(params, callback) {
            callback({success: getLocalStorageFiles().createDirectory(params.directory)});
            changes.push({eventType: 'change', path: params.directory});
        }

        directoryDelete(params, callback) {
            getLocalStorageFiles().deleteDirectory(params.directory);
            let path = getRequireDependency('./js/shared/lib/path');
            callback({success: true});
            changes.push({eventType: 'change', path: path.getPathAndFilename(params.directory).path});
        }
    };
})();
