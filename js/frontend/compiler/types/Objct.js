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
        this._compiler              = null;
    }

    setCompiler(compiler) {
        this._compiler = compiler;
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

    getSize() {
        let compiler = this._compiler;
        if (!compiler.getPass()) {
            return super.getSize();
        }
        let size        = this._size;
        let parentScope = this._parentScope;
        while (parentScope && (parentScope instanceof exports.Objct)) {
            size += compiler.getObjctSize(parentScope.getName());
            parentScope = parentScope.getParentScope();
        }
        return size;
    }

    extend(dataType) {
        // The size can be set to 0 here because extend is only called when there are no fields in this scope!
        this._size        = 0;
        this._parentScope = dataType;
        let compiler   = this._compiler;
        let superObjct = dataType;
        if (superObjct && compiler.getPass()) {
            // We only know the actual size in the second pass...
            this._size = superObjct.getSize();
        }
    }

    findVar(name) {
        // Try to find the field in the lowest super class...
        let result = null;
        const findVar = (parentScope) => {
                let varsByName = parentScope.getVarsByName();
                if (name in varsByName) {
                    result = varsByName[name];
                }
                if (parentScope.getParentScope()) {
                    findVar(parentScope.getParentScope());
                }
            };
        findVar(this);
        return result || this._parentScope.findIdentifier(name);
    }
};
