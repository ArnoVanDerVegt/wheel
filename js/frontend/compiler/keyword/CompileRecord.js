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
    compile(iterator) {
        let linter     = this._compiler.getLinter();
        let type       = null;
        let end        = false;
        let token      = iterator.skipWhiteSpace().next();
        let record     = new Record(null, token.lexeme).setToken(token);
        let expectType = true;
        let pointer    = false;
        linter && linter.addRecord(token);
        this._scope.addRecord(record);
        while (!end) {
            token = iterator.skipWhiteSpace().next();
            switch (token.cls) {
                case t.TOKEN_TYPE:
                    type       = token.lexeme;
                    expectType = false;
                    break;
                case t.TOKEN_KEYWORD:
                    if (token.is(t.LEXEME_PROC)) {
                        type       = token.lexeme;
                        expectType = false;
                    } else if (token.is(t.LEXEME_END)) {
                        end = true;
                    }
                    break;
                case t.TOKEN_POINTER:
                    pointer = true;
                    break;
                case t.TOKEN_IDENTIFIER:
                    if (expectType) {
                        type       = this._scope.findIdentifier(token.lexeme);
                        expectType = false;
                        if (type === null) {
                            throw errors.createError(err.UNDEFINED_IDENTIFIER, token, 'Undefined identifier "' + token.lexeme + '".');
                        }
                    } else {
                        let arraySize = [];
                        let nameToken = token;
                        let name      = nameToken.lexeme;
                        let p         = iterator.skipWhiteSpace().peek();
                        if (p && (p.cls === t.TOKEN_BRACKET_OPEN)) {
                            iterator.skipWhiteSpace().next();
                            let done = false;
                            while (!done) {
                                token = iterator.next();
                                if (token.cls === t.TOKEN_NUMBER) {
                                    if (token.value === 0) {
                                        throw errors.createError(err.INVALID_ARRAY_SIZE, token, 'Invalid array size.');
                                    }
                                    arraySize.push(token.value);
                                    token = iterator.skipWhiteSpace().next();
                                    if (token.cls !== t.TOKEN_BRACKET_CLOSE) {
                                        throw errors.createError(err.SYNTAX_ERROR_BRACKET_CLOSE_EXPECTED, token, '"]" Expected.');
                                    }
                                    p = iterator.skipWhiteSpace().peek();
                                    if (p && (p.cls === t.TOKEN_BRACKET_OPEN)) {
                                        iterator.skipWhiteSpace().next();
                                    } else {
                                        done = true;
                                    }
                                } else {
                                    throw errors.createError(err.SYNTAX_ERROR_NUMBER_CONSTANT_EXPECTED, token, 'Number constant expected.');
                                }
                            }
                        }
                        linter && linter.addField(nameToken);
                        record.addVar(token, name, type, Var.getArraySize(arraySize), pointer);
                        expectType = true;
                    }
                    let p = iterator.skipWhiteSpace().peek();
                    if (p.cls === t.TOKEN_COMMA) {
                        iterator.next();
                        expectType = false;
                    }
                    pointer = false;
                    break;
                default:
                    throw errors.createError(err.SYNTAX_ERROR, token, 'Syntax error.');
            }
        }
    }
};
