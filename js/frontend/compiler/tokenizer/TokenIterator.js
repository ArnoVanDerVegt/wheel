/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const errors = require('../errors');
const err    = require('../errors').errors;
const t      = require('./tokenizer');

exports.Iterator = class {
    constructor(tokens) {
        this._tokens = tokens;
        this._index  = 0;
    }

    setIndexToToken(token) {
        this._index = token.index;
        return this;
    }

    finished() {
        return (this._index >= this._tokens.length);
    }

    next() {
        if (this._index < this._tokens.length) {
            return this._tokens[this._index++];
        }
        return null;
        //if (ignoreEnd) {
        //    return null;
        //}
        //throw errors.createError(err.UNEXPECTED_END_OF_FILE, this._tokens[this._tokens.length - 1], 'Unexpected end of file.');
    }

    peek() {
        return (this._index < this._tokens.length) ? this._tokens[this._index] : null;
    }

    current() {
        if (this._index < this._tokens.length) {
            return this._tokens[this._index];
        }
        return null;
    }

    nextUntilCondition(callback) {
        let result     = [];
        let token      = this.next();
        let firstToken = token;
        let done       = false;
        while (!done && token && !callback(token)) {
            let open = 1;
            switch (token.cls) {
                case t.TOKEN_PARENTHESIS_OPEN:
                    result.push(token);
                    while (open && !done) {
                        token = this.next();
                        if (token.cls === t.TOKEN_WHITE_SPACE) {
                            if (token.is(t.LEXEME_NEWLINE)) {
                                done = true;
                            }
                        } else {
                            result.push(token);
                        }
                        switch (token.cls) {
                            case t.TOKEN_PARENTHESIS_OPEN:
                                open++;
                                break;
                            case t.TOKEN_PARENTHESIS_CLOSE:
                                open--;
                                break;
                        }
                    }
                    break;
                case t.TOKEN_BRACKET_OPEN:
                    result.push(token);
                    while (open && !done) {
                        token = this.next();
                        if (token.cls === t.TOKEN_WHITE_SPACE) {
                            if (token.is(t.LEXEME_NEWLINE)) {
                                done = true;
                            }
                        } else {
                            result.push(token);
                        }
                        switch (token.cls) {
                            case t.TOKEN_BRACKET_OPEN:
                                open++;
                                break;
                            case t.TOKEN_BRACKET_CLOSE:
                                open--;
                                break;
                        }
                    }
                    break;
                default:
                    if (token.cls === t.TOKEN_WHITE_SPACE) {
                        if (token.is(t.LEXEME_NEWLINE)) {
                            done = true;
                        }
                    } else {
                        result.push(token);
                    }
                    break;
            }
            if (!done) {
                token = this.next();
            }
        }
        return {
            tokens:     result,
            firstToken: firstToken,
            lastToken:  token
        };
    }

    nextUntilLexeme(lexeme) {
        return this.nextUntilCondition(function(token) { return lexeme.indexOf(token.lexeme) !== -1; });
    }

    nextUntilTokenCls(cls) {
        return this.nextUntilCondition(function(token) { return cls.indexOf(token.cls) !== -1; });
    }

    skipWhiteSpace() {
        let tokens = this._tokens;
        while ((this._index < tokens.length) &&
            ((tokens[this._index].cls === t.TOKEN_WHITE_SPACE) || tokens[this._index].done)) {
            this._index++;
        }
        return this;
    }

    skipWhiteSpaceWithoutNewline() {
        let tokens = this._tokens;
        while ((this._index < tokens.length) &&
            (((tokens[this._index].cls === t.TOKEN_WHITE_SPACE) && (tokens[this._index].lexeme !== t.LEXEME_NEWLINE)) ||
                tokens[this._index].done)) {
            this._index++;
        }
        return this;
    }
};
