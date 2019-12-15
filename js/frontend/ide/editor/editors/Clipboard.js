/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.TYPE_IMAGE = 0;
exports.TYPE_SOUND = 1;

class Clipboard {
    constructor() {
        this._type = null;
        this._data = null;
    }

    copy(type, data) {
        this._type = type;
        this._data = data;
    }

    getType() {
        return this._type;
    }

    getData() {
        return this._data;
    }
}

exports.clipboard = new Clipboard();
