/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path             = require('path');
const fs               = require('fs');
const os               = require('os');
const exec             = require('child_process').exec;
const RgfImage         = require('../../shared/lib/RgfImage').RgfImage;
const settings         = require('./settings');
const DirectoryWatcher = require('../DirectoryWatcher').DirectoryWatcher;

exports.IDERoutes = class {
    constructor() {
        this._node               = false;
        this._directoryWatcher   = null;
        this._settings           = null;
        this._cwd                = path.join(__dirname, '/../../..');
        this._currentPath        = {};
        this._systemDocumentPath = this._genericPath(this.getSystemDocumentPath());
        this._documentPath       = this._genericPath(path.join(this.getSystemDocumentPath(), 'Wheel'));
    }

    _createResultCallback(result, res) {
        return function(error) {
            result.success = !error;
            result.error   = error ? error.toString() : '';
            res.send(JSON.stringify(result));
        };
    }

    _genericPath(p) {
        return p.split('\\').join('/');
    }

    getSystemDocumentPath() {
        let p = os.homedir();
        if (fs.existsSync(path.join(p, 'Documents'))) {
            p = path.join(p, 'Documents');
        }
        return p;
    }

    _onIpcMessage(event, arg) {
        let data;
        try {
            data = JSON.parse(arg);
        } catch (error) {
            return;
        }
        let settings = this._getSettings();
        switch (data.message) {
            case 'settings':
                settings.isInApplicationsFolder = data.isInApplicationsFolder;
                settings.isPackaged             = data.isPackaged;
                settings.version                = data.version;
                this._saveSettings();
                break;
            case 'move':
                data = data.data;
                if (!('x' in data) || !('y' in data)) {
                    return;
                }
                if (!settings.windowPosition) {
                    settings.windowPosition = {};
                }
                settings.windowPosition.x = data.x || 0;
                settings.windowPosition.y = data.y || 0;
                this._saveSettings();
                break;
            case 'resize':
                data = data.data;
                if (!('x' in data) || !('y' in data)) {
                    return;
                }
                if (!settings.windowPosition) {
                    settings.windowPosition = {};
                }
                if (!settings.windowSize) {
                    settings.windowSize = {};
                }
                settings.windowPosition.x = data.x || 0;
                settings.windowPosition.y = data.y || 0;
                settings.windowSize.width = Math.max(data.x, 800);
                settings.windowSize.heigh = Math.max(data.y, 640);
                this._saveSettings();
                break;
        }
        if (this._res) {
            this._res.send(JSON.stringify(settings));
            this._res = null;
        }
    }

    _saveSettings() {
        return settings.saveToLocalStorage(this._getSettings()) || settings.saveToFile(this._getSettings());
    }

    _getSettings() {
        if (!this._settings) {
            this._settings = {};
        }
        return this._settings;
    }

    files(req, res) {
        let index = req.query.index;
        if (!(index in this._currentPath)) {
            if (req.query.fromRoot) {
                this._currentPath[index] = this._genericPath(os.homedir());
            } else {
                this._currentPath[index] = this._genericPath(this._documentPath);
            }
        }
        if (req.query.changePath) {
            this._currentPath[index] = this._genericPath(path.join(this._currentPath[index], req.query.changePath));
        }
        if (typeof req.query.path === 'string') {
            this._currentPath[index] = this._genericPath(req.query.path);
        }
        fs.readdir(
            this._currentPath[index],
            (error, files) => {
                let result = {
                        files: [],
                        path:  this._genericPath(this._currentPath[index])
                    };
                if (error) {
                    result.error = true;
                } else {
                    files.forEach(
                        function(file) {
                            try {
                                let stat = fs.statSync(this._genericPath(path.join(this._currentPath[index], file)));
                                result.files.push({
                                    name:      file,
                                    size:      stat.size,
                                    modified:  new Date(stat.mtime).toLocaleString(),
                                    directory: stat.isDirectory()
                                });
                            } catch (error) {
                            }
                        },
                        this
                    );
                    if (this._currentPath[index] !== '.') {
                        result.files.push({
                            name:      '..',
                            directory: true
                        });
                    }
                }
                res.send(JSON.stringify(result));
            }
        );
    }

    _findFile(filename) {
        let found    = false;
        if ((typeof filename === 'string') && (filename.indexOf(',') !== -1)) {
            let f = filename;
            filename = filename.split(',');
            filename.push(f);
        }
        if (Array.isArray(filename)) {
            for (let i = 0; i < filename.length; i++) {
                if (fs.existsSync(filename[i])) {
                    return filename[i];
                }
            }
            return null;
        }
        if (fs.existsSync(filename)) {
            return filename;
        }
        if (fs.existsSync('/' + filename)) {
            return '/' + filename;
        }
        if (fs.existsSync(path.join(this._documentPath, filename))) {
            return path.join(this._documentPath, filename);
        }
        let searchPath = this._getSettings().searchPath || [];
        let f;
        for (let i = 0; i < searchPath.length; i++) {
            f = path.join(searchPath[i], filename);
            if (fs.existsSync(f)) {
                return f;
            }
            f = path.join(this._documentPath, searchPath[i], filename);
            if (fs.existsSync(f)) {
                return f;
            }
        }
        return null;
    }

    file(req, res) {
        let filename = this._findFile(req.query.filename);
        let result   = {success: true, filename: req.query.filename, data: null};
        if (filename === null) {
            result.success = false;
            res.send(JSON.stringify(result));
            return;
        }
        let extension = path.extname(filename);
        switch (extension) {
            case '.rgf':
                result.data = new RgfImage().unpack(fs.readFileSync(filename));
                res.send(JSON.stringify(result));
                break;
            case '.mp3':
            case '.wav':
                res.send(fs.readFileSync(filename));
                break;
            case '.bmp':
            case '.png':
            case '.jpg':
            case '.jpeg':
            case '.gif':
                res.send('data:image/' + extension + ';base64,' + fs.readFileSync(filename).toString('base64'));
                break;
            case '.rsf':
                result.data = fs.readFileSync(filename);
                res.send(JSON.stringify(result));
                break;
            case '.wfrm':
                result.data = {wfrm: fs.readFileSync(filename).toString(), isProject: false};
                let whlFilename = this._findFile(filename.substr(0, filename.length - extension.length) + '.whl');
                if (whlFilename !== null) {
                    result.data.whl = fs.readFileSync(whlFilename).toString();
                } else {
                    whlFilename = this._findFile(filename.substr(0, filename.length - extension.length) + '.whlp');
                    if (whlFilename !== null) {
                        result.data.whl       = fs.readFileSync(whlFilename).toString();
                        result.data.isProject = true;
                    }
                }
                res.send(JSON.stringify(result));
                break;
            default:
                try {
                    result.data = fs.readFileSync(filename).toString();
                    res.send(JSON.stringify(result));
                } catch (error) {
                    res.send(JSON.stringify({success: false}));
                }
                break;
        }
    }

    fileAppend(req, res) {
        let filename = req.body.filename;
        let result   = {success: true, filename: filename};
        fs.appendFile(filename, req.body.data, this._createResultCallback(result, res));
    }

    fileSave(req, res) {
        let f;
        let filename = req.body.filename;
        let data     = req.body.data;
        let result   = {success: true};
        if (filename.substr(-4) === '.rgf') {
            if (typeof data === 'string') {
                try {
                    data = JSON.parse(data);
                } catch (error) {
                    result.success = false;
                }
            }
            if (result.success) {
                data = new RgfImage().pack(data);
            }
        } else if (filename.substr(-4) === '.rsf') {
            data = new Uint8Array(data);
        } else if (filename.substr(-5) === '.wfrm') {
            data = JSON.stringify(data, null, 4);
        }
        if (result.success) {
            fs.writeFile(filename, data, this._createResultCallback(result, res));
        } else {
            res.send(JSON.stringify(result));
        }
    }

    fileSaveBase64AsBinary(req, res) {
        let result = {success: true};
        fs.writeFile(req.body.filename, Buffer.from(req.body.data, 'base64'), this._createResultCallback(result, res));
    }

    fileDelete(req, res) {
        let filename = req.body.filename;
        let result   = {success: false};
        fs.unlink(req.body.filename, this._createResultCallback(result, res));
    }

    fileSize(req, res) {
        let filename = req.body.filename;
        let result   = {success: false, size: 0};
        try {
            if (fs.existsSync(filename)) {
                let stats = fs.statSync(filename);
                result.size    = stats['size'];
                result.success = true;
            }
        } catch (error) {
        }
        res.send(JSON.stringify(result));
    }

    filesInPath(req, res) {
        let filelist      = [];
        let readFilesSync = (dir) => {
                let files = fs.readdirSync(dir);
                files.forEach((file) => {
                    if (fs.statSync(dir + '/' + file).isDirectory()) {
                        readFilesSync(dir + '/' + file);
                    } else if ((file.substr(-4) === '.woc') || (file.substr(-4) === '.whl') || (file.substr(-5) === '.whlp')) {
                        filelist.push(this._genericPath(path.join(dir, file)));
                    }
                });
            };
        readFilesSync(this._documentPath);
        res.send(JSON.stringify(filelist));
    }

    findInFile(req, res) {
        let caseSensitive = req.body.caseSensitive;
        let filename      = req.body.filename;
        let text          = req.body.text;
        let textLength    = text.length;
        let result        = {filename: filename, text: text, found: []};
        try {
            if (fs.existsSync(filename)) {
                let data = fs.readFileSync(filename).toString();
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
            }
        } catch (error) {
        }
        res.send(JSON.stringify(result));
    }

    directoryCreate(req, res) {
        let directory = req.body.directory;
        let result    = {success: false};
        try {
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory);
            }
            result.success = true;
        } catch (error) {
            result.error = error.toString();
        }
        res.send(JSON.stringify(result));
    }

    directoryDelete(req, res) {
        let result = {success: false};
        fs.rmdir(req.body.directory, this._createResultCallback(result, res));
    }

    pathCreate(req, res) {
        let result = {success: false};
        try {
            let items = this._genericPath(req.body.path).split('/');
            let p     = ((path.sep === '/') ? path.sep : '') + items[0];
            for (let i = 1; i < items.length; i++) {
                p = path.join(p, items[i]);
                if (!fs.existsSync(p)) {
                    fs.mkdirSync(p);
                }
            }
            result.success = true;
        } catch (error) {
            result.error = error.toString();
        }
        res.send(JSON.stringify(result));
    }

    pathExists(req, res) {
        let result = {success: false};
        try {
            result.exists  = fs.existsSync(req.query.path);
            result.success = true;
        } catch (error) {
            result.error = error.toString();
        }
        res.send(JSON.stringify(result));
    }

    rename(req, res) {
        let result = {success: false};
        fs.rename(req.body.oldName, req.body.newName, this._createResultCallback(result, res));
    }

    updateSystemDocumentPath(req, result) {
        // When using electron the userDocument path is provided from an ipc call to main.js!
        if (req && req.query && req.query.systemDocumentPath) {
            this._systemDocumentPath  = req.query.systemDocumentPath;
            result.systemDocumentPath = this._systemDocumentPath;
        }
        return this;
    }

    updateDocumentPath(result) {
        if ('documentPath' in result) {
            this._documentPath = result.documentPath;
        }
        // The generic path should always end with "/Wheel"...
        if (['/Wheel', '\\Wheel'].indexOf(this._documentPath.substr(-6)) === -1) {
            this._documentPath = this._genericPath(path.join(this._documentPath, 'Wheel'));
        }
        result.documentPath       = this._documentPath;
        result.documentPathExists = fs.existsSync(this._documentPath);
        return this;
    }

    updateOS(result) {
        result.os = {
            homedir:  this._genericPath(os.homedir()),
            platform: os.platform(),
            arch:     os.arch(),
            pathSep:  path.sep
        };
        return this;
    }

    updateSearchPath(result) {
        if (!('searchPath' in result)) {
            result.searchPath = [];
        }
        return this;
    }

    updateRecentProject(result) {
        if (typeof result.recentProject === 'string') {
            result.recentProject = this._genericPath(result.recentProject);
        }
        return this;
    }

    settingsLoad(req, res) {
        let result = settings.loadFromLocalStorage();
        if (!result) {
            result = settings.loadFromFile();
            if (!result) {
                result = {};
            }
        }
        if (typeof result === 'string') {
            try {
                result = JSON.parse(result);
            } catch (error) {
                result = {};
            }
        }
        this._currentPath = {}; // The application restarted, reset the paths!
        this
            .updateSystemDocumentPath(req, result)
            .updateDocumentPath(result)
            .updateOS(result)
            .updateSearchPath(result)
            .updateRecentProject(result);
        this._settings = result;
        if (!this.directoryWatcher && result.documentPathExists) {
            this.directoryWatcher = new DirectoryWatcher(this._documentPath);
        }
        if (this._node) {
            this._res                 = null;
            result.systemDocumentPath = this.getSystemDocumentPath();
            res.send(JSON.stringify(result));
        } else {
            // Save the response callback.
            // This callback will be called from the ipcRenderer on postMessage event handler.
            this._res = res;
            const ipcRenderer = require('electron').ipcRenderer;
            ipcRenderer.on('postMessage', this._onIpcMessage.bind(this));
            ipcRenderer.send('postMessage', {command: 'settings', settings: result});
        }
    }

    settingsSave(req, res) {
        let result       = {success: true};
        let data         = req.body.settings;
        let documentPath = this._node ? this._documentPath : data.documentPath;
        if (!documentPath) {
            return;
        }
        if (this._documentPath !== this._genericPath(documentPath)) {
            this.directoryWatcher = new DirectoryWatcher(this._genericPath(documentPath));
        }
        if (typeof req.body.settings === 'string') {
            try {
                this._settings = JSON.parse(req.body.settings);
            } catch (error) {
                result.success = false;
                res.send(JSON.stringify(result));
                return;
            }
        } else {
            this._settings = req.body.settings;
        }
        let windowPosition = this._getSettings().windowPosition;
        this._documentPath                = this._genericPath(documentPath);
        this._cwd                         = this._getSettings().documentPath;
        this._settings.documentPathExists = fs.existsSync(this._documentPath);
        if (!this._settings.windowPosition || !this._settings.windowPosition.x || !this._settings.windowPosition.y) {
            this._settings.windowPosition = windowPosition || {};
        }
        result.success = this._saveSettings();
        res.send(JSON.stringify(result));
    }

    changes(req, res) {
        res.send(JSON.stringify(this.directoryWatcher ? this.directoryWatcher.getChanges() : []));
    }

    userInfo(req, res) {
        this._cwd = this._getSettings().documentPath;
        res.send(JSON.stringify({username: os.userInfo().username, cwd: this._cwd}));
    }

    exec(req, res) {
        let command = req.body.command;
        let result  = null;
        if (command.substr(0, 3) === 'cd ') {
            command = command.substr(2 - command.length).trim();
            let lastCwd = this._cwd;
            let newCwd  = path.join(this._cwd, command);
            if (fs.existsSync(newCwd)) {
                this._cwd = newCwd;
                result    = {success: true, cwd: this._cwd};
                let parts = lastCwd.split('/');
                let s     = '';
                if (parts.length) {
                    s = parts[parts.length - 1];
                }
                result.output = s + ' ' + os.userInfo().username + '$ ';
            } else {
                result = {success: false, error: 'Path not found.'};
            }
        }
        if (result) {
            res.send(JSON.stringify(result));
            return;
        }
        exec(
            command,
            {
                cwd: this._cwd
            },
            (error, stdout, stderr) => {
                let result = {};
                if (error) {
                    result.success = false;
                    result.error   = stderr;
                } else {
                    result.success = true;
                    result.output  = stdout;
                }
                res.send(JSON.stringify(result));
            }
        );
    }

    setNode(node) {
        this._node = node;
    }

    revealInFinder(req, res) {
        let result = {success: false};
        exec(
            (os.platform() === 'darwin') ?
                ('open "' + path.dirname(req.query.path) + '"') :
                ('start "" "' + path.dirname(req.query.path) + '"'),
            null,
            (error, stdout, stderr) => {
                result.error = error;
            }
        );
        res.send(JSON.stringify(result));
    }
};
