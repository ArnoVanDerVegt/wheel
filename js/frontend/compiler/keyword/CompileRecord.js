/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const errors       = require('../errors');
const err          = require('../errors').errors;
const t            = require('../tokenizer/tokenizer');
const CompileScope = require('../compiler/CompileScope').CompileScope;
const Record       = require('../types/Record').Record;
const Var          = require('../types/Var');

exports.CompileRecord = class extends CompileScope {
    constructor(opts) {
        super(opts);
        this._linter     = null;
        this._token      = null;
        this._expectType = true;
        this._end        = false;
    }

    getDataType() {
        return new Record(null, this.getNamespacedRecordName(this._token.lexeme), false, this._compiler.getNamespace()).setToken(this._token);
    }

    addDataTypeToScope(dataType) {
        this._scope.addRecord(dataType);
    }

    addLinterItem(token) {
        this._linter && this._linter.addRecord(this._token);
    }

    checkDataTypeUnion(dataType) {
        if (!dataType.checkUnion()) {
            throw errors.createError(err.UNION_SIZE_MISMATCH, this._token, 'Union size mismatch.');
        }
    }

    compileKeyword(dataType) {
        if (this._token.is(t.LEXEME_UNION)) {
            if (!dataType.union()) {
                throw errors.createError(err.UNION_SIZE_MISMATCH, this._token, 'Union size mismatch.');
            }
        } else if (this._token.is(t.LEXEME_PROC)) {
            this._expectType = false;
            return this._token.lexeme;
        } else if (this._token.is(t.LEXEME_END)) {
            this._end = true;
        }
        return null;
    }

    compileExtends(iterator, dataType) {
    }

    compile(iterator) {
        this._expectType = true;
        this._end        = false;
        this._linter     = this._compiler.getLinter();
        this._token      = iterator.skipWhiteSpace().next();
        this.addLinterItem(this._token);
        let type        = null;
        let typePointer = false;
        let pointer     = false;
        let dataType    = this.getDataType();
        this.addDataTypeToScope(dataType);
        this.compileExtends(iterator, dataType);
        while (!this._end) {
            this._token = iterator.skipWhiteSpace().next();
            switch (this._token.cls) {
                case t.TOKEN_TYPE:
                    type = this._token.lexeme;
                    this._expectType = false;
                    break;
                case t.TOKEN_KEYWORD:
                    type = this.compileKeyword(dataType) || type;
                    break;
                case t.TOKEN_POINTER:
                    if (this._expectType) {
                        typePointer = true;
                    } else {
                        pointer = true;
                    }
                    break;
                case t.TOKEN_IDENTIFIER:
                    if (this._expectType) {
                        type = this._scope.findIdentifier(this._token.lexeme);
                        this._expectType = false;
                        if (type === null) {
                            throw errors.createError(err.UNDEFINED_IDENTIFIER, this._token, 'Undefined identifier "' + this._token.lexeme + '".');
                        }
                    } else {
                        let arraySize = [];
                        let nameToken = this._token;
                        let name      = nameToken.lexeme;
                        let p         = iterator.skipWhiteSpace().peek();
                        if (p && (p.cls === t.TOKEN_BRACKET_OPEN)) {
                            iterator.skipWhiteSpace().next();
                            let done = false;
                            while (!done) {
                                this._token = iterator.next();
                                if (this._token.cls === t.TOKEN_NUMBER) {
                                    if (this._token.value === 0) {
                                        throw errors.createError(err.INVALID_ARRAY_SIZE, this._token, 'Invalid array size.');
                                    }
                                    arraySize.push(this._token.value);
                                    this._token = iterator.skipWhiteSpace().next();
                                    if (this._token.cls !== t.TOKEN_BRACKET_CLOSE) {
                                        throw errors.createError(err.SYNTAX_ERROR_BRACKET_CLOSE_EXPECTED, this._token, '"]" Expected.');
                                    }
                                    p = iterator.skipWhiteSpace().peek();
                                    if (p && (p.cls === t.TOKEN_BRACKET_OPEN)) {
                                        iterator.skipWhiteSpace().next();
                                    } else {
                                        done = true;
                                    }
                                } else {
                                    throw errors.createError(err.SYNTAX_ERROR_NUMBER_CONSTANT_EXPECTED, this._token, 'Number constant expected.');
                                }
                            }
                        }
                        this._linter && this._linter.addField(nameToken);
                        dataType.addVar({
                            token:       this._token,
                            name:        name,
                            type:        type,
                            typePointer: typePointer,
                            arraySize:   Var.getArraySize(arraySize),
                            pointer:     pointer
                        });
                        this._expectType = true;
                        pointer          = false;
                        typePointer      = false;
                    }
                    let p = iterator.skipWhiteSpace().peek();
                    if (p.cls === t.TOKEN_COMMA) {
                        iterator.next();
                        this._expectType = false;
                    }
                    break;
                default:
                    throw errors.createError(err.SYNTAX_ERROR, this._token, 'Syntax error.');
            }
        }
        this.checkDataTypeUnion(dataType);
        return dataType;
    }

    getNamespacedRecordName(name) {
        return this._compiler.getNamespace().getCurrentNamespace() + name;
    }
};
