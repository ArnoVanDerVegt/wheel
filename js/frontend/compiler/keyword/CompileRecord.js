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
        this._type       = null;
        this._expectType = true;
        this._end        = false;
        this._pointer    = false;
    }

    getDataType() {
        return new Record(null, this.getNamespacedRecordName(this._token.lexeme), false, this._compiler.getNamespace()).setToken(this._token);
    }

    addDataTypeToScope(dataType) {
        this._scope.addRecord(dataType);
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
            this._type       = this._token.lexeme;
            this._expectType = false;
        } else if (this._token.is(t.LEXEME_END)) {
            this._end = true;
        }
    }

    compile(iterator) {
        this._type       = null;
        this._expectType = true;
        this._end        = false;
        this._pointer    = false;
        this._linter     = this._compiler.getLinter();
        this._token      = iterator.skipWhiteSpace().next();
        this._linter && this._linter.addRecord(this._token);
        let dataType = this.getDataType();
        this.addDataTypeToScope(dataType);
        while (!this._end) {
            this._token = iterator.skipWhiteSpace().next();
            switch (this._token.cls) {
                case t.TOKEN_TYPE:
                    this._type       = this._token.lexeme;
                    this._expectType = false;
                    break;
                case t.TOKEN_KEYWORD:
                    this.compileKeyword(dataType);
                    break;
                case t.TOKEN_POINTER:
                    this._pointer = true;
                    break;
                case t.TOKEN_IDENTIFIER:
                    if (this._expectType) {
                        this._type       = this._scope.findIdentifier(this._token.lexeme);
                        this._expectType = false;
                        if (this._type === null) {
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
                        dataType.addVar(this._token, name, this._type, Var.getArraySize(arraySize), this._pointer);
                        this._expectType = true;
                    }
                    let p = iterator.skipWhiteSpace().peek();
                    if (p.cls === t.TOKEN_COMMA) {
                        iterator.next();
                        this._expectType = false;
                    }
                    this._pointer = false;
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
