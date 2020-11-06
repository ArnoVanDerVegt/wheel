/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Record = require('./Record').Record;

exports.Objct = class extends Record {
    constructor(parentScope, name, global, namespace) {
        super(parentScope, name, global, namespace);
        this._constructorCodeOffset = null;
    }

    getConstructorCodeOffset(constructorCodeOffset) {
        return this._constructorCodeOffset;
    }

    setConstructorCodeOffset(constructorCodeOffset) {
        this._constructorCodeOffset = constructorCodeOffset;
    }
};
