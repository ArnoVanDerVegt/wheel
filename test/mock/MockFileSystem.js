exports.MockFileSystem = class {
    constructor(opts) {
        this._files = [];
    }

    getFile(filename) {
        let files = this._files;
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            if (file.filename === filename) {
                file.index = i;
                return file;
            }
        }
        return null;
    }

    open(filename) {
        let files = this._files;
        let file  = this.getFile(filename);
        if (file) {
            file.open = true;
            return file.index;
        }
        files.push({
            index:    files.length,
            filename: filename,
            lines:    [],
            pointer:  0,
            open:     true
        });
        return files.length - 1;
    }

    getOpenFile(handle) {
        let file = this._files[handle];
        if (file && file.open) {
            return file;
        }
        return null;
    }

    writeString(handle, s) {
        let file = this.getOpenFile(handle);
        if (!file) {
            return this;
        }
        file.lines.push(s);
        return this;
    }

    writeNumber(handle, n) {
        this.writeString(handle, n);
        return this;
    }

    readString(handle) {
        let file = this.getOpenFile(handle);
        if (!file) {
            return '';
        }
        let s = (file.pointer < file.lines.length) ? file.lines[file.pointer++] : '';
        return s;
    }

    readNumber(handle) {
        return this.readString(handle) || 0;
    }

    close(handle) {
        let file = this.getOpenFile(handle);
        if (file) {
            file.open    = false;
            file.pointer = 0;
        }
        return this;
    }

    remove(handle) {
        let file = this.getOpenFile(handle);
        if (file) {
            this._files[file.index] = null;
        }
    }

    fileSize(filename, callback) {
        let file = this.getFile(filename);
        if (file) {
            callback(file.lines.join('\r').length);
            return;
        }
        callback(0);
    }
};
