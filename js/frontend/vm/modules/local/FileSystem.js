const getDataProvider = require('../../../lib/dataprovider/dataProvider').getDataProvider;
const path            = require('../../../lib/path');

const MODE_READ  = 0;
const MODE_WRITE = 1;

exports.MODE_READ  = MODE_READ;
exports.MODE_WRITE = MODE_WRITE;

const createJSONCallback = function(callback) {
        return function(data) {
            try {
                data = JSON.parse(data);
            } catch (error) {
                data = {};
            }
            callback(data);
        };
    };

exports.FileSystem = class {
    constructor(opts) {
        this._vm    = opts.vm;
        this._files = [];
    }

    exists(filename, callback) {
        let outputPath = this._vm.getOutputPath();
        let vm         = this._vm.sleep(10000);
        getDataProvider().getData(
            'get',
            'ide/path-exists',
            {path: path.join(outputPath, this.getValidatedFilename(filename))},
            createJSONCallback(function(data) {
                callback(data.exists ? 1 : 0);
                vm.sleep(0);
            })
        );
    }

    open(filename, mode) {
        let files = this._files;
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            if ((file.filename === filename) && (file.mode === mode)) {
                return i;
            }
        }
        let file = {
                filename: filename,
                lines:    [],
                pointer:  0,
                open:     true,
                mode:     mode
            };
        if (mode === MODE_READ) {
            let outputPath = this._vm.getOutputPath();
            let vm         = this._vm.sleep(10000);
            getDataProvider().getData(
                'get',
                'ide/file',
                {filename: path.join(outputPath, this.getValidatedFilename(filename))},
                createJSONCallback(function(data) {
                    if ('data' in data) {
                        file.lines = data.data.split('\r');
                    }
                    vm.sleep(0);
                })
            );
        }
        files.push(file);
        return files.length - 1;
    }

    writeString(handle, s) {
        let file = this.getOpenFile(handle, MODE_WRITE);
        if (!file) {
            return this;
        }
        let outputPath = this._vm.getOutputPath();
        let vm         = this._vm.sleep(10000);
        getDataProvider().getData(
            'post',
            'ide/file-append',
            {
                filename: path.join(outputPath, this.getValidatedFilename(file.filename)),
                data:     s + '\r'
            },
            createJSONCallback(function(data) {
                vm.sleep(0);
            })
        );
        return this;
    }

    writeNumber(handle, n) {
        return this.writeString(handle, n);
    }

    readString(handle) {
        let file = this.getOpenFile(handle, MODE_READ);
        if (!file) {
            return '';
        }
        return (file.pointer < file.lines.length) ? file.lines[file.pointer++] : '';
    }

    readNumber(handle) {
        let n = this.readString(handle, MODE_READ);
        if (n === '') {
            return 0;
        }
        return parseFloat(n);
    }

    close(handle) {
        let file = this.getOpenFile(handle);
        if (file) {
            file.open    = false;
            file.pointer = 0;
        }
        return this;
    }

    remove(filename) {
        let outputPath = this._vm.getOutputPath();
        let vm         = this._vm.sleep(10000);
        getDataProvider().getData(
            'post',
            'ide/file-delete',
            {filename: path.join(outputPath, this.getValidatedFilename(filename))},
            createJSONCallback(function(data) {
                vm.sleep(0);
            })
        );
    }

    getOpenFile(handle, mode) {
        let file = this._files[handle];
        if (file && (file.mode === mode)) {
            return file;
        }
        return null;
    }

    getValidatedFilename(filename) {
        let valid  = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789-.';
        let result = '';
        for (let i = 0; i < filename.length; i++) {
            if (valid.indexOf(filename[i]) !== -1) {
                result += filename[i];
            }
        }
        return result;
    }

    fileSize(filename, callback) {
        let outputPath = this._vm.getOutputPath();
        let vm         = this._vm.sleep(10000);
        getDataProvider().getData(
            'post',
            'ide/file-size',
            {filename: path.join(outputPath, this.getValidatedFilename(filename))},
            createJSONCallback(function(data) {
                callback(data.success ? data.size : 0);
                vm.sleep(0);
            })
        );
    }
};
