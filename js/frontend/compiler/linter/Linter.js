/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const t           = require('../tokenizer/tokenizer');
const uppercase   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercase   = 'abcdefghijklmnopqrstuvwxyz';
const numbers     = '0123456789';
const alphaNum    = uppercase + lowercase + numbers;
const all         = uppercase + lowercase + numbers + '_';

const TYPE_TO_STR = ['Whitespace', 'Tab', 'Var', 'Param', 'Field', 'Proc', 'Record', 'Object', 'Define'];
const WHITE_SPACE = 0;
const TAB         = 1;
const VAR         = 2;
const PARAM       = 3;
const FIELD       = 4;
const PROC        = 5;
const RECORD      = 6;
const DEFINE      = 7;

exports.TYPE_TO_STR = TYPE_TO_STR;
exports.WHITE_SPACE = WHITE_SPACE;
exports.TAB         = TAB;
exports.VAR         = VAR;
exports.PARAM       = PARAM;
exports.FIELD       = FIELD;
exports.PROC        = PROC;
exports.RECORD      = RECORD;
exports.DEFINE      = DEFINE;

exports.Linter = class {
    constructor() {
        this._messages = [];
    }

    reset() {
        this._messages.length = 0;
    }

    checkString(s, firstChar, chars) {
        if (firstChar.indexOf(s[0]) === -1) {
            return false;
        }
        for (let i = 0; i < s.length; i++) {
            if (chars.indexOf(s[i]) === -1) {
                return false;
            }
        }
        return true;
    }

    upperCaseOnly(s) {
        for (let i = 0; i < s.length; i++) {
            if ((s[i] !== '_') && (uppercase.indexOf(s[i]) === -1)) {
                return false;
            }
        }
        return true;
    }

    upperCaseFirst(s) {
        return s.substr(0, 1).toUpperCase() + s.substr(1 - s.length);
    }

    lowerCaseFirst(s) {
        return s.substr(0, 1).toLowerCase() + s.substr(1 - s.length);
    }

    toUCamelCase(s) {
        if (s.indexOf('_') === -1) {
            if (this.upperCaseOnly(s)) {
                s = s.toLowerCase();
            }
            return this.upperCaseFirst(s);
        }
        let result = '';
        s.split('_').forEach(
            function(part) {
                result += this.upperCaseFirst(part);
            },
            this
        );
        return result;
    }

    toCamelCase(s) {
        return this.lowerCaseFirst(this.toUCamelCase(s));
    }

    addMessage(token, expected, type) {
        this._messages.push({token: token, expected: expected, type: type});
    }

    getMessages() {
        return this._messages;
    }

    addTokens(tokens) {
        for (let i = 0; i < tokens.length - 1; i++) {
            let token = tokens[i];
            if (token.cls === t.TOKEN_WHITE_SPACE) {
                if (token.lexeme === t.LEXEME_TAB) {
                    this.addMessage(token, ' ', TAB);
                    token.lexeme = t.LEXEME_SPACE + t.LEXEME_SPACE + t.LEXEME_SPACE + t.LEXEME_SPACE;
                } else if (token.lexeme === t.LEXEME_NEWLINE) {
                    let nextToken = tokens[i + 1];
                    if ((nextToken.cls === t.TOKEN_WHITE_SPACE) && (nextToken.lexeme !== t.LEXEME_NEWLINE)) {
                        let lexeme = nextToken.lexeme;
                        let l1     = lexeme.length / 4;
                        let l2     = Math.floor(lexeme.length / 4);
                        if (l1 !== l2) {
                            this.addMessage(token, {found: lexeme.length, expected: l2 * 4}, WHITE_SPACE);
                        }
                    }
                }
            }
        }
    }

    addVar(token) {
        if (!this.checkString(token.origLexeme, lowercase, alphaNum)) {
            this.addMessage(token, this.toCamelCase(token.origLexeme), VAR);
        }
    }

    addParam(token) {
        if (!this.checkString(token.origLexeme, lowercase, alphaNum)) {
            this.addMessage(token, this.toCamelCase(token.origLexeme), PARAM);
        }
    }

    addField(token) {
        if (!this.checkString(token.origLexeme, lowercase, alphaNum)) {
            this.addMessage(token, this.toCamelCase(token.origLexeme), FIELD);
        }
    }

    addProc(token) {
        if (!this.checkString(token.origLexeme, lowercase, alphaNum)) {
            this.addMessage(token, this.toCamelCase(token.origLexeme), PROC);
        }
    }

    addRecord(token) {
        if (!this.checkString(token.origLexeme, uppercase, alphaNum)) {
            this.addMessage(token, this.toUCamelCase(token.origLexeme), RECORD);
        }
    }

    addDefine(token) {
        if (!this.checkString(token.origLexeme, uppercase + '_', uppercase + numbers + '_')) {
            this.addMessage(token, token.origLexeme.toUpperCase(), DEFINE);
        }
    }
};
