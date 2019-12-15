/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const fs   = require('fs');
const path = require('path');

exports.DirectoryWatcher = class {
    constructor(directory) {
        this._changes   = [];
        this._directory = directory;
        this._started   = false;
        this.init();
    }

    init() {
        if (!fs.existsSync(this._directory)) {
            return false;
        }
        fs.watch(this._directory, {persistent: true, recursive: true, encoding: 'utf8'}, this.onChanged.bind(this));
        this._started = true;
        return this;
    }

    onChanged(eventType, filename) {
        let p = path.join(this._directory, filename);
        this._changes.push({type: eventType, path: p.split('\\').join('/')});
    }

    onError(error) {
    }

    getStarted() {
        this._started;
    }

    getChanges() {
        let result = this._changes;
        this._changes = [];
        return result;
    }
};
