/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const t   = require('../tokenizer/tokenizer');
const Var = require('./Var').Var;

exports.Scope = class {
    constructor(parentScope, name, global, namespace) {
        if (!namespace) {
            throw new Error('No namespace');
        }
        this._token             = null;
        this._program           = null;
        this._parentScope       = parentScope;
        this._entryPoint        = null;
        this._name              = name;
        this._size              = 0;
        this._global            = !!global;
        this._namespace         = namespace;
        this._varsLocked        = false;
        this._vars              = [];
        this._varsByName        = {};
        this._records           = [];
        this._recordsByName     = {};
        this._proc              = [];
        this._procByName        = {};
        this._stackOffset       = 0;
        this._paramCount        = 0;
        this._stringsAdded      = [];
        this._stringsAddedCount = 0;
        this._tempVarIndex      = 0;
        this._withStack         = [];
        this._codeOffset        = 0;
    }

    addRecord(record) {
        this._records.push(record);
        this._recordsByName[record.getName()] = record;
    }

    addVarString(type, arraySize, pointer) {
        if (this._global || (!this._global && (arraySize !== false))) {
            return;
        }
        let stringsAdded = this._stringsAdded;
        let tokenizer    = require('../tokenizer/tokenizer');
        if ((type === tokenizer.LEXEME_STRING) && !pointer) {
            stringsAdded.push({
                offset:    this._size,
                arraySize: arraySize
            });
            return;
        }
        const Record = require('./Record').Record;
        if (!(type instanceof Record)) {
            return;
        }
        let offsets     = [];
        let offset      = this._size;
        let checkRecord = (record) => {
                let vars = record.getVars();
                vars.forEach((vr) => {
                    let type      = vr.getType().type;
                    let arraySize = vr.getArraySize();
                    arraySize = (arraySize === false) ? 1 : arraySize;
                    if (type === tokenizer.LEXEME_STRING) {
                        if (!vr.getPointer()) {
                            stringsAdded.push({
                                offset:    offset,
                                arraySize: vr.getArraySize()
                            });
                        }
                        offset += arraySize;
                    } else if (type instanceof Record) {
                        for (let index = 0; index < arraySize; index++) {
                            checkRecord(type);
                        }
                    } else {
                        offset += arraySize;
                    }
                });
            };
        checkRecord(type);
    }

    addVar(opts) {
        if (this._varsLocked) {
            return this._varsByName[opts.name];
        }
        let typePointer = ('typePointer' in opts) ? opts.typePointer : false;
        let arraySize   = ('arraySize'   in opts) ? opts.arraySize   : false;
        let pointer     = ('pointer'     in opts) ? opts.pointer     : false;
        let vr          = new Var({
                    token:       opts.token,
                    name:        opts.name,
                    type:        opts.type,
                    typePointer: typePointer,
                    arraySize:   arraySize,
                    pointer:     pointer,
                    global:      this._global,
                    offset:      this._size
                });
        this._varsByName[opts.name] = vr;
        this._vars.push(vr);
        const Record = require('./Record').Record;
        // - ignoreString:
        // A parameter string does not need to allocate a new string, it's always a reference to an existing string!
        if (!opts.ignoreString && !(this instanceof Record)) {
            this.addVarString(opts.type, arraySize, pointer);
        }
        let size = vr.getTotalSize();
        this._size        += size;
        this._stackOffset += size;
        return vr;
    }

    addProc(proc) {
        this._proc.push(proc);
        this._procByName[proc.getName()] = proc;
    }

    addStringsAddedCount(stringsAddedCount) {
        this._stringsAddedCount += stringsAddedCount;
    }

    getStringsAddedCount() {
        return this._stringsAddedCount;
    }

    findWithField(name) {
        let withStack = this._withStack;
        for (let i = withStack.length - 1; i >= 0; i--) {
            let superScope = withStack[i];
            let superFound = null;
            let varsByName;
            while (superScope) {
                varsByName = superScope.getVarsByName();
                if (name in varsByName) {
                    superFound = varsByName[name];
                }
                superScope = superScope.getParentScope();
            }
            if (superFound) {
                return superFound;
            }
        }
        return null;
    }

    findIdentifier(name) {
        if (!isNaN(name * 1)) {
            return null;
        }
        if (name === t.LEXEME_SELF) {
            return this._self || null;
        }
        let record = this._recordsByName[name];
        if (record) {
            return record;
        }
        record = this._recordsByName[this._namespace.getCurrentNamespace() + name];
        if (record) {
            return record;
        }
        let vr = this._varsByName[name];
        if (vr) {
            return vr;
        }
        let field = this.findWithField(name);
        if (field) {
            return field;
        }
        let proc = this._procByName[name];
        if (proc) {
            return proc;
        }
        proc = this._procByName[this._namespace.getCurrentNamespace() + name];
        if (proc) {
            return proc;
        }
        return this._parentScope ? this._parentScope.findIdentifier(name) : null;
    }

    findRecord(name) {
        return this._recordsByName[name];
    }

    findType(name) {
        let tokenizer = require('../tokenizer/tokenizer');
        if (name === tokenizer.LEXEME_NUMBER) {
            return name;
        }
        let record = this._recordsByName[name];
        if (record) {
            return record;
        }
        return this._parentScope ? this._parentScope.findType(name) : null;
    }

    findVar(name) {
        let vr = this._varsByName[name];
        if (vr) {
            return vr;
        }
        return this._parentScope ? this._parentScope.findIdentifier(name) : null;
    }

    findLocalVar(name) {
        let vr = this._varsByName[name];
        return vr ? vr : null;
    }

    findProc(name) {
        let proc = this._procByName[name];
        if (proc) {
            return proc;
        }
        proc = this._procByName[this._namespace.getCurrentNamespace() + name];
        if (proc) {
            return proc;
        }
        return this._parentScope ? this._parentScope.findProc(name) : null;
    }

    getNamespace() {
        return this._namespace;
    }

    getToken() {
        return this._token;
    }

    setToken(token) {
        this._token = token;
        return this;
    }

    getName() {
        return this._name;
    }

    getGlobal() {
        return this._global;
    }

    setSize(size) {
        this._size = size;
        return this;
    }

    getSize() {
        return this._size;
    }

    setVarsLocked(scope) {
        this._varsLocked   = true;
        this._vars         = scope.getVars();
        this._varsByName   = scope.getVarsByName();
        this._size         = scope.getTotalSize();
        this._stackOffset  = this._size;
        this._stringsAdded = scope.getStringsAdded();
        this._stringsAdded.forEach((stringAdded) => {
            stringAdded.done = false;
        });
    }

    getVarsLocked() {
        return this._varsLocked;
    }

    getVars() {
        return this._vars;
    }

    getVarsByName() {
        return this._varsByName;
    }

    getProc() {
        return this._proc;
    }

    getRecords() {
        return this._records;
    }

    getStringsAdded() {
        return this._stringsAdded;
    }

    incStackOffset() {
        this._stackOffset++;
        return this;
    }

    decStackOffset() {
        this._stackOffset--;
        return this;
    }

    addStackOffset(size) {
        this._stackOffset += size;
        return this;
    }

    setStackOffset(stackOffset) {
        this._stackOffset = stackOffset;
        return this;
    }

    getStackOffset() {
        return this._stackOffset;
    }

    getEntryPoint() {
        return this._entryPoint;
    }

    setEntryPoint(entryPoint) {
        this._entryPoint = entryPoint;
    }

    getParentScope() {
        return this._parentScope;
    }

    getParamCount() {
        return this._paramCount;
    }

    /**
     * Return the total parameter count including:
     *     !____CODE_RETURN____'
     *     !____STACK_RETURN____'
    **/
    getTotalParamCount() {
        return this._paramCount + 2;
    }

    setParamCount(paramCount) {
        this._paramCount = paramCount;
    }

    getTotalSize() {
        let totalSize = 0;
        this._vars.forEach((vr) => {
            totalSize += vr.getTotalSize();
        });
        return totalSize;
    }

    getTempVarIndex() {
        return this._tempVarIndex++;
    }

    getCodeOffset() {
        return this._codeOffset;
    }

    setCodeOffset(codeOffset) {
        this._codeOffset = codeOffset;
        return this;
    }

    pushWith(record) {
        let result = this._stackOffset;
        this._withStack.push(record.getWithRecord(this._stackOffset));
        this._stackOffset++;
        return result;
    }

    popWith() {
        this._stackOffset--;
        this._withStack.pop();
    }
};
