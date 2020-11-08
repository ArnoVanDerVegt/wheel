/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Record = require('./Record').Record;

exports.Objct = class extends Record {
    constructor(parentScope, name, global, namespace) {
        super(parentScope, name, global, namespace);
        this._constructorCodeOffset = null;
        this._methodTable           = null;
    }

    getConstructorCodeOffset(constructorCodeOffset) {
        return this._constructorCodeOffset - 1;
    }

    setConstructorCodeOffset(constructorCodeOffset) {
        this._constructorCodeOffset = constructorCodeOffset;
        return this;
    }

    getMethodTable() {
        return this._methodTable;
    }

    setMethodTable(methodTable) {
        this._methodTable = methodTable;
        return this;
    }

    extend(dataType) {
        this._size        = dataType.getTotalSize();
        this._parentScope = dataType;
    }
};
