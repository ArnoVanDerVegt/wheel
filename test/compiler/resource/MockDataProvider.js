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

    getData(method, route, params, callback) {
        switch (method + ':' + route) {
            case 'get:ide/file':
                callback(JSON.stringify({
                    success: true,
                    data:    {wfrm: JSON.stringify({filename: params.filename})}
                }));
                break;
            case 'post:ide/file-save':
                this._filenames.push(params.filename);
                this._filename = params.filename;
                this._data     = params.data;
                break;
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
