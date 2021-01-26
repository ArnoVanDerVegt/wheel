/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
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
        let dispatcher = getRequireDependency('./js/frontend/lib/dispatcher').dispatcher;
        dispatcher.dispatch('LocalStorage.Size', {value: Math.min(size / (1024 * 1024) * 100, 100)});
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

let localStorageFiles = null;

exports.getLocalStorageFiles = function() {
    if (localStorageFiles) {
        return localStorageFiles;
    }
    localStorageFiles = new LocalStorageFiles();
    return localStorageFiles;
};
