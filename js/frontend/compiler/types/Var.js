/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.Var = class {
    constructor(opts) {
        this._token                = opts.token;
        this._name                 = opts.name;
        this._type                 = opts.type;
        this._arraySize            = opts.arraySize;
        this._global               = opts.global;
        this._offset               = opts.offset;
        this._pointer              = opts.pointer;
        this._assignedProc         = null;
        this._stringConstantOffset = null;
    }

    getToken() {
        return this._token;
    }

    getName() {
        return this._name;
    }

    getType() {
        return this._type;
    }

    getArraySize() {
        return this._arraySize;
    }

    getPointer() {
        return this._pointer;
    }

    getGlobal() {
        return this._global;
    }

    getPrimitiveType() {
        const t = require('../tokenizer/tokenizer');
        return ([t.LEXEME_NUMBER, t.LEXEME_PROC, t.LEXEME_STRING].indexOf(this._type) !== -1);
    }

    getSize() {
        return this.getPrimitiveType() ? 1 : this._type.getSize();
    }

    getTotalSize() {
        let arraySize = this._arraySize;
        if (arraySize === false) {
            arraySize = 1;
        } else if (typeof arraySize === 'object') {
            arraySize = 1;
            for (let i = 0; i < this._arraySize.length; i++) {
                arraySize *= this._arraySize[i];
            }
        }
        return (this.getPrimitiveType() ? 1 : this._type.getSize()) * arraySize;
    }

    getOffset() {
        return this._offset;
    }

    getAssignedProc() {
        return this._assignedProc;
    }

    setAssignedProc(assignedProc) {
        this._assignedProc = assignedProc;
    }

    getStringConstantOffset() {
        return this._stringConstantOffset;
    }

    setStringConstantOffset(stringConstantOffset) {
        this._stringConstantOffset = stringConstantOffset;
    }
};

exports.getArraySize = function(arraySize) {
    if (!arraySize.length) {
        return false;
    }
    if (arraySize.length === 1) {
        return arraySize[0];
    }
    return arraySize;
};
