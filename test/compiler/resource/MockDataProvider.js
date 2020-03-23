/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/

exports.MockDataProvider = class {
    constructor() {
        this._filenames = [];
        this._filename  = null;
        this._data      = null;
    }

    getData(method, route, params) {
        if (method + ':' + route === 'post:ide/file-save') {
            this._filenames.push(params.filename);
            this._filename = params.filename;
            this._data     = params.data;
        }
    }

    getFilenames() {
        return this._filenames;
    }

    getFilename() {
        return this._filename;
    }

    getDataV() {
        return this._data;
    }
};
