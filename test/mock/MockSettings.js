/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.MockSettings = class {
    constructor() {
        this._saved = false;
    }

    save() {
        this._saved = true;
    }

    getSaved() {
        return this._saved;
    }
};
