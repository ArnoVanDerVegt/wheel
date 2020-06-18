/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const errors = require('../errors');
const err    = require('../errors').errors;
const t      = require('../tokenizer/tokenizer');
const Record = require('../types/Record').Record;

class CompileData {
    readRecordToData(iterator, record, data) {
        let fields = record.getVars();
        for (let i = 0, j = fields.length - 1; i <= j; i++) {
            let field     = fields[i];
            let token     = iterator.skipWhiteSpace().next();
            let type      = field.getType();
            let arraySize = field.getArraySize();
            if (type === t.LEXEME_NUMBER) {
                if (arraySize === false) {
                    if (token.cls === t.TOKEN_NUMBER) {
                        data.push(token.value);
                    } else {
                        throw errors.createError(err.SYNTAX_ERROR_NUMBER_CONSTANT_EXPECTED, token, 'Number constant expected, got "' + token.lexeme + '".');
                    }
                } else {
                    this.readArrayToData(iterator, field, data);
                }
            } else if (type === t.LEXEME_STRING) {
                if (arraySize === false) {
                    if (token.cls === t.TOKEN_STRING) {
                        data.push(token.lexeme);
                    } else {
                        throw errors.createError(err.SYNTAX_ERROR_STRING_CONSTANT_EXPECTED, token, 'String constant expected, got "' + token.lexeme + '".');
                    }
                } else {
                    this.readArrayToData(iterator, field, data);
                }
            } else if (type instanceof Record) {
                if (arraySize === false) {
                    this.readRecordToData(iterator, type, data);
                } else {
                    this.readArrayToData(iterator, field, data);
                }
            }
            token = iterator.skipWhiteSpace().next(); // ",", "}"
            if (!token.is(t.LEXEME_CURLY_CLOSE) && !token.is(t.LEXEME_COMMA)) {
                throw errors.createError(err.SYNTAX_ERROR, token, 'Syntax error.');
            }
        }
    }

    readArrayContentToData(iterator, vr, data, arraySize) {
        let index = 0;
        let type  = vr.getType();
        let done  = false;
        while (!done) {
            let token = iterator.skipWhiteSpace().next();
            if (type === t.LEXEME_NUMBER) {
                if (token.cls === t.TOKEN_NUMBER) {
                    data.push(token.value);
                } else {
                    throw errors.createError(err.SYNTAX_ERROR_NUMBER_CONSTANT_EXPECTED, token, 'Number constant expected, got "' + token.lexeme + '".');
                }
            } else if (type === t.LEXEME_STRING) {
                if (token.cls === t.TOKEN_STRING) {
                    data.push(token.lexeme);
                } else {
                    throw errors.createError(err.SYNTAX_ERROR_STRING_CONSTANT_EXPECTED, token, 'String constant expected, got "' + token.lexeme + '".');
                }
            } else if (type instanceof Record) {
                this.readRecordToData(iterator, type, data);
            }
            token = iterator.skipWhiteSpace().next();
            if (index === arraySize - 1) {
                if (token.cls !== t.TOKEN_BRACKET_CLOSE) {
                    throw errors.createError(err.SYNTAX_ERROR_BRACKET_CLOSE_EXPECTED, token, '"]" Expected.');
                }
            } else if (token.cls === t.TOKEN_BRACKET_CLOSE) {
                throw errors.createError(err.ITEM_COUNT_MISMATCH, token, 'Item count mismatch.');
            }
            index++;
            if (index >= arraySize) {
                done = true;
            }
        }
    }

    readArrayToData(iterator, vr, data) {
        let arraySize = vr.getArraySize();
        if (typeof arraySize === 'number') {
            this.readArrayContentToData(iterator, vr, data, vr.getArraySize());
        } else {
            const readArray = (index) => {
                    if (index === arraySize.length - 1) {
                        this.readArrayContentToData(iterator, vr, data, arraySize[index]);
                    } else {
                        let token = iterator.skipWhiteSpace().next();
                        if (token.cls !== t.TOKEN_BRACKET_OPEN) {
                            throw errors.createError(err.SYNTAX_ERROR, token, 'Syntax error.');
                        }
                        for (let i = 0; i < arraySize[index]; i++) {
                            readArray(index + 1);
                            if (i < arraySize[index] - 1) {
                                token = iterator.skipWhiteSpace().next();
                                if (token.cls !== t.TOKEN_COMMA) {
                                    throw errors.createError(err.SYNTAX_ERROR, token, 'Syntax error.');
                                }
                                token = iterator.skipWhiteSpace().next();
                                if (token.cls !== t.TOKEN_BRACKET_OPEN) {
                                    throw errors.createError(err.SYNTAX_ERROR, token, 'Syntax error.');
                                }
                            }
                        }
                        token = iterator.skipWhiteSpace().next();
                        if (token.cls !== t.TOKEN_BRACKET_CLOSE) {
                            throw errors.createError(err.SYNTAX_ERROR, token, 'Syntax error.');
                        }
                    }
                };
            readArray(0);
        }
    }
}

exports.compileData = new CompileData();
