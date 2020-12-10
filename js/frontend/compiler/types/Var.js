/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.Var = class {
    constructor(opts) {
        if (!opts.arraySize && opts.typePointer && !opts.pointer) {
            opts.pointer     = true;
            opts.typePointer = false;
        }
        if (opts.unionId === undefined) {
            throw new Error('No union id');
        }
        this._unionId              = opts.unionId;
        this._compiler             = opts.compiler;
        this._token                = opts.token;
        this._name                 = opts.name;
        this._offset               = opts.offset;
        this._arraySize            = opts.arraySize;
        this._global               = !!opts.global;
        this._pointer              = !!opts.pointer;
        this._isParam              = !!opts.isParam;
        this._proc                 = false;
        this._withOffset           = null;
        this._assignedProc         = null;
        this._stringConstantOffset = null;
        this._type                 = {
            type:        opts.type,
            typePointer: opts.typePointer
        };
    }

    getCompiler() {
        return this._compiler;
    }

    getUnionId() {
        return this._unionId;
    }

    getToken() {
        return this._token;
    }

    getName() {
        return this._name;
    }

    getType() {
        return {
            type:        this._type.type,
            typePointer: this._type.typePointer
        };
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
        return (this._type.typePointer || this._pointer) ||
            ([t.LEXEME_NUMBER, t.LEXEME_PROC, t.LEXEME_STRING].indexOf(this._type.type) !== -1);
    }

    getElementSize() {
        let compiler = this._compiler;
        // In the second pass we know the exact object size including the virtual methods!
        if (compiler.getPass() && !this._type.typePointer && !this._pointer) {
            const Objct = require('./Objct').Objct;
            if (this._type.type instanceof Objct) {
                return this._compiler.getObjctSize(this._type.type.getName());
            }
        }
        return this.getPrimitiveType() ? 1 : this._type.type.getTotalSize();
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
        return this.getElementSize() * arraySize;
    }

    getWithOffset() {
        return this._withOffset;
    }

    setWithOffset(withOffset) {
        this._withOffset = withOffset;
        return this;
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

    getIsParam() {
        return this._isParam;
    }

    getProc() {
        return this._proc;
    }

    /**
     * Used to save the object method information.
    **/
    setProc(proc) {
        this._proc = proc;
        return this;
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
