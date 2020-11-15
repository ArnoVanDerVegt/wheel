/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
(function() {
    const LEXEME_NAMESPACE          = 'namespace';
    const LEXEME_PROC               = 'proc';
    const LEXEME_NUMBER             = 'number';
    const LEXEME_STRING             = 'string';
    const LEXEME_BREAK              = 'break';
    const LEXEME_CASE               = 'case';
    const LEXEME_DEFAULT            = 'default';
    const LEXEME_ELSE               = 'else';
    const LEXEME_ELSEIF             = 'elseif';
    const LEXEME_END                = 'end';
    const LEXEME_FOR                = 'for';
    const LEXEME_IF                 = 'if';
    const LEXEME_NOT                = 'not';
    const LEXEME_RET                = 'ret';
    const LEXEME_SELECT             = 'select';
    const LEXEME_TO                 = 'to';
    const LEXEME_DOWNTO             = 'downto';
    const LEXEME_STEP               = 'step';
    const LEXEME_RECORD             = 'record';
    const LEXEME_OBJECT             = 'object';
    const LEXEME_SELF               = 'self';
    const LEXEME_EXTENDS            = 'extends';
    const LEXEME_SUPER              = 'super';
    const LEXEME_UNION              = 'union';
    const LEXEME_REPEAT             = 'repeat';
    const LEXEME_WHILE              = 'while';
    const LEXEME_WITH               = 'with';
    const LEXEME_AS                 = 'as';
    const LEXEME_ADDR               = 'addr';
    const LEXEME_MOD                = 'mod';
    const LEXEME_AND                = 'and';
    const LEXEME_OR                 = 'or';
    const LEXEME_MAIN               = 'main';
    const LEXEME_ASSIGN             = '=';
    const LEXEME_ASSIGN_ADD         = '+=';
    const LEXEME_ASSIGN_SUB         = '-=';
    const LEXEME_ASSIGN_MUL         = '*=';
    const LEXEME_ASSIGN_DIV         = '/=';
    const LEXEME_ADD                = '+';
    const LEXEME_SUB                = '-';
    const LEXEME_MUL                = '*';
    const LEXEME_DIV                = '/';
    const LEXEME_EQUAL              = '==';
    const LEXEME_GREATER_EQUAL      = '>=';
    const LEXEME_LESS_EQUAL         = '<=';
    const LEXEME_NOT_EQUAL          = '!=';
    const LEXEME_GREATER            = '>';
    const LEXEME_LESS               = '<';
    const LEXEME_COMMA              = ',';
    const LEXEME_DOT                = '.';
    const LEXEME_SEMICOLON          = ';';
    const LEXEME_COLON              = ':';
    const LEXEME_ADDRESS            = '@';
    const LEXEME_POINTER            = '^';
    const LEXEME_PARENTHESIS_OPEN   = '(';
    const LEXEME_PARENTHESIS_CLOSE  = ')';
    const LEXEME_BRACKET_OPEN       = '[';
    const LEXEME_BRACKET_CLOSE      = ']';
    const LEXEME_CURLY_OPEN         = '{';
    const LEXEME_CURLY_CLOSE        = '}';
    const LEXEME_QUOTE              = '"';
    const LEXEME_HASH               = '#';
    const LEXEME_SPACE              = ' ';
    const LEXEME_TAB                = '\t';
    const LEXEME_NEWLINE            = '\n';
    const LEXEME_DIGITS             = '0123456789';
    const LEXEME_IDENTIFIER_CHARS   = '_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const TOKEN_COLON               =  0;
    const TOKEN_COMMA               =  1;
    const TOKEN_DOT                 =  2;
    const TOKEN_PARENTHESIS_OPEN    =  3;
    const TOKEN_PARENTHESIS_CLOSE   =  4;
    const TOKEN_BRACKET_OPEN        =  5;
    const TOKEN_BRACKET_CLOSE       =  6;
    const TOKEN_CURLY_OPEN          =  7;
    const TOKEN_CURLY_CLOSE         =  8;
    const TOKEN_KEYWORD             =  9;
    const TOKEN_NUMERIC_OPERATOR    = 10;
    const TOKEN_BOOLEAN_OPERATOR    = 11;
    const TOKEN_ASSIGNMENT_OPERATOR = 12;
    const TOKEN_TYPE                = 13;
    const TOKEN_META                = 14;
    const TOKEN_POINTER             = 15;
    const TOKEN_ADDRESS             = 16;
    const TOKEN_NUMBER              = 17;
    const TOKEN_STRING              = 18;
    const TOKEN_IDENTIFIER          = 19;
    const TOKEN_COMMENT             = 20;
    const TOKEN_WHITE_SPACE         = 21;

    const TAG_IMAGE                 = 'image';
    const TAGS                      = [TAG_IMAGE];

    exports.LEXEME_NAMESPACE          = LEXEME_NAMESPACE;
    exports.LEXEME_PROC               = LEXEME_PROC;
    exports.LEXEME_NUMBER             = LEXEME_NUMBER;
    exports.LEXEME_STRING             = LEXEME_STRING;
    exports.LEXEME_BREAK              = LEXEME_BREAK;
    exports.LEXEME_CASE               = LEXEME_CASE;
    exports.LEXEME_DEFAULT            = LEXEME_DEFAULT;
    exports.LEXEME_ELSE               = LEXEME_ELSE;
    exports.LEXEME_ELSEIF             = LEXEME_ELSEIF;
    exports.LEXEME_END                = LEXEME_END;
    exports.LEXEME_FOR                = LEXEME_FOR;
    exports.LEXEME_IF                 = LEXEME_IF;
    exports.LEXEME_NOT                = LEXEME_NOT;
    exports.LEXEME_RET                = LEXEME_RET;
    exports.LEXEME_SELECT             = LEXEME_SELECT;
    exports.LEXEME_TO                 = LEXEME_TO;
    exports.LEXEME_DOWNTO             = LEXEME_DOWNTO;
    exports.LEXEME_STEP               = LEXEME_STEP;
    exports.LEXEME_RECORD             = LEXEME_RECORD;
    exports.LEXEME_OBJECT             = LEXEME_OBJECT;
    exports.LEXEME_SELF               = LEXEME_SELF;
    exports.LEXEME_EXTENDS            = LEXEME_EXTENDS;
    exports.LEXEME_SUPER              = LEXEME_SUPER;
    exports.LEXEME_UNION              = LEXEME_UNION;
    exports.LEXEME_REPEAT             = LEXEME_REPEAT;
    exports.LEXEME_WHILE              = LEXEME_WHILE;
    exports.LEXEME_WITH               = LEXEME_WITH;
    exports.LEXEME_AS                 = LEXEME_AS;
    exports.LEXEME_ADDR               = LEXEME_ADDR;
    exports.LEXEME_MOD                = LEXEME_MOD;
    exports.LEXEME_AND                = LEXEME_AND;
    exports.LEXEME_OR                 = LEXEME_OR;
    exports.LEXEME_MAIN               = LEXEME_MAIN;
    exports.LEXEME_ASSIGN             = LEXEME_ASSIGN;
    exports.LEXEME_ASSIGN_ADD         = LEXEME_ASSIGN_ADD;
    exports.LEXEME_ASSIGN_SUB         = LEXEME_ASSIGN_SUB;
    exports.LEXEME_ASSIGN_MUL         = LEXEME_ASSIGN_MUL;
    exports.LEXEME_ASSIGN_DIV         = LEXEME_ASSIGN_DIV;
    exports.LEXEME_ADD                = LEXEME_ADD;
    exports.LEXEME_SUB                = LEXEME_SUB;
    exports.LEXEME_MUL                = LEXEME_MUL;
    exports.LEXEME_DIV                = LEXEME_DIV;
    exports.LEXEME_EQUAL              = LEXEME_EQUAL;
    exports.LEXEME_GREATER_EQUAL      = LEXEME_GREATER_EQUAL;
    exports.LEXEME_LESS_EQUAL         = LEXEME_LESS_EQUAL;
    exports.LEXEME_NOT_EQUAL          = LEXEME_NOT_EQUAL;
    exports.LEXEME_GREATER            = LEXEME_GREATER;
    exports.LEXEME_LESS               = LEXEME_LESS;
    exports.LEXEME_COMMA              = LEXEME_COMMA;
    exports.LEXEME_DOT                = LEXEME_DOT;
    exports.LEXEME_SEMICOLON          = LEXEME_SEMICOLON;
    exports.LEXEME_COLON              = LEXEME_COLON;
    exports.LEXEME_ADDRESS            = LEXEME_ADDRESS;
    exports.LEXEME_POINTER            = LEXEME_POINTER;
    exports.LEXEME_PARENTHESIS_OPEN   = LEXEME_PARENTHESIS_OPEN;
    exports.LEXEME_PARENTHESIS_CLOSE  = LEXEME_PARENTHESIS_CLOSE;
    exports.LEXEME_BRACKET_OPEN       = LEXEME_BRACKET_OPEN;
    exports.LEXEME_BRACKET_CLOSE      = LEXEME_BRACKET_CLOSE;
    exports.LEXEME_CURLY_OPEN         = LEXEME_CURLY_OPEN;
    exports.LEXEME_CURLY_CLOSE        = LEXEME_CURLY_CLOSE;
    exports.LEXEME_QUOTE              = LEXEME_QUOTE;
    exports.LEXEME_HASH               = LEXEME_HASH;
    exports.LEXEME_SPACE              = LEXEME_SPACE;
    exports.LEXEME_TAB                = LEXEME_TAB;
    exports.LEXEME_NEWLINE            = LEXEME_NEWLINE;
    exports.LEXEME_DIGITS             = LEXEME_DIGITS;
    exports.LEXEME_IDENTIFIER_CHARS   = LEXEME_IDENTIFIER_CHARS;

    exports.TOKEN_COLON               = TOKEN_COLON;
    exports.TOKEN_COMMA               = TOKEN_COMMA;
    exports.TOKEN_DOT                 = TOKEN_DOT;
    exports.TOKEN_PARENTHESIS_OPEN    = TOKEN_PARENTHESIS_OPEN;
    exports.TOKEN_PARENTHESIS_CLOSE   = TOKEN_PARENTHESIS_CLOSE;
    exports.TOKEN_BRACKET_OPEN        = TOKEN_BRACKET_OPEN;
    exports.TOKEN_BRACKET_CLOSE       = TOKEN_BRACKET_CLOSE;
    exports.TOKEN_CURLY_OPEN          = TOKEN_CURLY_OPEN;
    exports.TOKEN_CURLY_CLOSE         = TOKEN_CURLY_CLOSE;
    exports.TOKEN_KEYWORD             = TOKEN_KEYWORD;
    exports.TOKEN_NUMERIC_OPERATOR    = TOKEN_NUMERIC_OPERATOR;
    exports.TOKEN_BOOLEAN_OPERATOR    = TOKEN_BOOLEAN_OPERATOR;
    exports.TOKEN_ASSIGNMENT_OPERATOR = TOKEN_ASSIGNMENT_OPERATOR;
    exports.TOKEN_TYPE                = TOKEN_TYPE;
    exports.TOKEN_META                = TOKEN_META;
    exports.TOKEN_POINTER             = TOKEN_POINTER;
    exports.TOKEN_ADDRESS             = TOKEN_ADDRESS;
    exports.TOKEN_NUMBER              = TOKEN_NUMBER;
    exports.TOKEN_STRING              = TOKEN_STRING;
    exports.TOKEN_IDENTIFIER          = TOKEN_IDENTIFIER;
    exports.TOKEN_COMMENT             = TOKEN_COMMENT;
    exports.TOKEN_WHITE_SPACE         = TOKEN_WHITE_SPACE;

    const keywords = [
            LEXEME_NAMESPACE,
            LEXEME_BREAK,
            LEXEME_CASE,
            LEXEME_DEFAULT,
            LEXEME_ELSE,
            LEXEME_ELSEIF,
            LEXEME_END,
            LEXEME_FOR,
            LEXEME_IF,
            LEXEME_NOT,
            LEXEME_PROC,
            LEXEME_RET,
            LEXEME_SELECT,
            LEXEME_TO,
            LEXEME_DOWNTO,
            LEXEME_STEP,
            LEXEME_RECORD,
            LEXEME_OBJECT,
            LEXEME_EXTENDS,
            LEXEME_SUPER,
            LEXEME_UNION,
            LEXEME_REPEAT,
            LEXEME_WHILE,
            LEXEME_WITH,
            LEXEME_AS,
            LEXEME_ADDR,
            LEXEME_MOD
        ];

    const types = [
            LEXEME_NUMBER,
            LEXEME_STRING
        ];

    const numericOperators = [
            LEXEME_DIV,
            LEXEME_MUL,
            LEXEME_SUB,
            LEXEME_ADD,
            LEXEME_EQUAL,
            LEXEME_GREATER_EQUAL,
            LEXEME_LESS_EQUAL,
            LEXEME_NOT_EQUAL,
            LEXEME_LESS,
            LEXEME_GREATER
        ];

    const assignmentOperators = [
            LEXEME_ASSIGN,
            LEXEME_ASSIGN_ADD,
            LEXEME_ASSIGN_SUB,
            LEXEME_ASSIGN_MUL,
            LEXEME_ASSIGN_DIV
        ];

    const booleanOperators = [
            LEXEME_AND,
            LEXEME_OR
        ];

    function is(lexeme) {
        return (this.lexeme === lexeme);
    }

    function makeToken(token) {
        token.is = is.bind(token);
        return token;
    }

    exports.makeToken = makeToken;

    exports.Tokenizer = class {
        constructor() {
            this.reset();
        }

        reset() {
            this._lastNonWhiteSpaceToken = null;
            this._lexeme                 =  '';
            this._tokens                 = [];
            this._offset                 = 0;
            this._lineNum                = 1;
            return this;
        }

        isHex(lexeme) {
            if ((lexeme.length <= 2) || (lexeme.substr(0, 2) !== '0x')) {
                return false;
            }
            lexeme = lexeme.toUpperCase();
            for (let i = 2; i < lexeme.length; i++) {
                if ('0123456789ABCDEF'.indexOf(lexeme[i]) === -1) {
                    return false;
                }
            }
            return true;
        }

        isBin(lexeme) {
            if ((lexeme.length <= 2) || (lexeme.substr(0, 2) !== '0b')) {
                return false;
            }
            for (let i = 2; i < lexeme.length; i++) {
                if ('01'.indexOf(lexeme[i]) === -1) {
                    return false;
                }
            }
            return true;
        }

        binValue(lexeme) {
            let result = 0;
            let bit    = 1;
            for (let i = lexeme.length - 1; i > 1; i--) {
                if (lexeme[i] === '1') {
                    result += bit;
                }
                bit <<= 1;
            }
            return result;
        }

        addToken(lexeme) {
            arguments.length || (lexeme = this._lexeme);
            if (lexeme === '') {
                return;
            }
            let token = makeToken({
                    lexeme:     lexeme,
                    origLexeme: lexeme,
                    cls:        0,
                    done:       false,
                    lineNum:    this._lineNum
                });
            if (this.isBin(lexeme)) {
                token.cls   = TOKEN_NUMBER;
                token.value = this.binValue(lexeme);
            } else if (this.isHex(lexeme)) {
                token.cls   = TOKEN_NUMBER;
                token.value = parseInt(lexeme, 16);
            } else if (isNaN(lexeme)) {
                if (lexeme === LEXEME_COLON) {
                    token.cls        = TOKEN_COLON;
                } else if (lexeme === LEXEME_DOT) {
                    token.cls        = TOKEN_DOT;
                } else if (lexeme === LEXEME_COMMA) {
                    token.cls        = TOKEN_COMMA;
                } else if (lexeme === LEXEME_ADDRESS) {
                    token.cls        = TOKEN_ADDRESS;
                } else if (lexeme === LEXEME_POINTER) {
                    token.cls        = TOKEN_POINTER;
                } else if (lexeme === LEXEME_PARENTHESIS_OPEN) {
                    token.cls        = TOKEN_PARENTHESIS_OPEN;
                } else if (lexeme === LEXEME_PARENTHESIS_CLOSE) {
                    token.cls        = TOKEN_PARENTHESIS_CLOSE;
                } else if (lexeme === LEXEME_BRACKET_OPEN) {
                    token.cls        = TOKEN_BRACKET_OPEN;
                } else if (lexeme === LEXEME_BRACKET_CLOSE) {
                    token.cls        = TOKEN_BRACKET_CLOSE;
                } else if (lexeme === LEXEME_CURLY_OPEN) {
                    token.cls        = TOKEN_CURLY_OPEN;
                } else if (lexeme === LEXEME_CURLY_CLOSE) {
                    token.cls        = TOKEN_CURLY_CLOSE;
                } else if (keywords.indexOf(lexeme) !== -1) {
                    token.cls        = TOKEN_KEYWORD;
                } else if (types.indexOf(lexeme) !== -1) {
                    token.cls        = TOKEN_TYPE;
                    token.type       = types.indexOf(lexeme);
                } else if (numericOperators.indexOf(lexeme) !== -1) {
                    token.cls        = TOKEN_NUMERIC_OPERATOR;
                    token.precedence = numericOperators.indexOf(lexeme);
                } else if (booleanOperators.indexOf(lexeme) !== -1) {
                    token.cls        = TOKEN_BOOLEAN_OPERATOR;
                    token.precedence = booleanOperators.indexOf(lexeme);
                } else if (assignmentOperators.indexOf(lexeme) !== -1) {
                    token.cls        = TOKEN_ASSIGNMENT_OPERATOR;
                } else if (lexeme[0] === LEXEME_HASH) {
                    token.cls        = TOKEN_META;
                } else {
                    token.cls        = TOKEN_IDENTIFIER;
                }
            } else if (lexeme.trim() === '') {
                token.cls   = TOKEN_WHITE_SPACE;
            } else {
                token.cls   = TOKEN_NUMBER;
                token.value = parseFloat(lexeme);
            }
            if (token.cls !== TOKEN_WHITE_SPACE) {
                this._lastNonWhiteSpaceToken = token;
            }
            this._lexeme = '';
            token.index  = this._tokens.length;
            this._tokens.push(token);
        }

        addMinusToken() {
            this._tokens.push(
                makeToken({
                    lexeme:     '-1',
                    origLexeme: '-1',
                    value:      -1,
                    cls:        TOKEN_NUMBER,
                    done:       false,
                    index:      this._tokens.length,
                    lineNum:    this._lineNum
                }),
                makeToken({
                    lexeme:     LEXEME_MUL,
                    origLexeme: LEXEME_MUL,
                    cls:        TOKEN_NUMERIC_OPERATOR,
                    precedence: numericOperators.indexOf(LEXEME_MUL),
                    done:       false,
                    index:      this._tokens.length,
                    lineNum:    this._lineNum
                })
            );
        }

        addIncDecTokens(lexeme) {
            this._tokens.push(
                makeToken({
                    lexeme:     lexeme,
                    origLexeme: lexeme,
                    cls:        TOKEN_ASSIGNMENT_OPERATOR,
                    done:       false,
                    index:      this._tokens.length,
                    lineNum:    this._lineNum
                }),
                makeToken({
                    lexeme:     '1',
                    origLexeme: '1',
                    value:      1,
                    cls:        TOKEN_NUMBER,
                    done:       false,
                    index:      this._tokens.length,
                    lineNum:    this._lineNum
                })
            );
        }

        addDecTokens() {
            this.addIncDecTokens(LEXEME_ASSIGN_SUB);
        }

        addIncTokens() {
            this.addIncDecTokens(LEXEME_ASSIGN_ADD);
        }

        readChar() {
            return (this._offset >= this._input.length) ? null : this._input[this._offset++];
        }

        removeTrailingSpaces(line) {
            let lines = line.split('\n');
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];
                if (line.trimEnd) {
                    lines[i] = line.trimEnd();
                } else {
                    while (line.length && line[line.length - 1] === ' ') {
                        line = line.substr(0, line.length - 1);
                    }
                    lines[i] = line;
                }
            }
            return lines.join('\n');
        }

        parseTag(comment) {
            if ((comment.length < 2) || (comment[0] !== '`')) {
                return null;
            }
            let i = comment.indexOf('`');
            comment = comment.substr(i + 1 - comment.length);
            i       = comment.indexOf('`');
            if (i === -1) {
                return null;
            }
            comment = comment.substr(0, i);
            i       = comment.indexOf(':');
            if (i === -1) {
                return null;
            }
            let tag  = comment.substr(0, i);
            let data = comment.substr(i + 1 - comment.length);
            if (TAGS.indexOf(tag) === -1) {
                return null;
            }
            return {
                name: tag,
                data: data
            };
        }

        tokenize(line) {
            line = this.removeTrailingSpaces(line);
            this.reset();
            this._input = line.trim();
            let s;
            let sc;
            let c = this.readChar();
            while (c !== null) {
                switch (c) {
                    case '\n':
                        this.addToken();
                        this._tokens.push(makeToken({
                            lexeme:  c,
                            cls:     TOKEN_WHITE_SPACE,
                            index:   this._tokens.length,
                            lineNum: this._lineNum
                        }));
                        this._lineNum++;
                        break;
                    case LEXEME_SPACE:
                    case LEXEME_TAB:
                        this.addToken();
                        s  = c;
                        sc = this.readChar();
                        while ((sc === LEXEME_SPACE) || (sc === LEXEME_TAB)) {
                            s += sc;
                            sc = this.readChar();
                        }
                        this._offset--;
                        this._tokens.push(makeToken({
                            lexeme: s,
                            cls:     TOKEN_WHITE_SPACE,
                            index:   this._tokens.length,
                            lineNum: this._lineNum
                        }));
                        break;
                    case LEXEME_QUOTE:
                        s  = c;
                        sc = this.readChar();
                        while ((sc !== null) && (sc !== LEXEME_QUOTE)) {
                            s += sc;
                            sc = this.readChar();
                        }
                        s += c;
                        this._tokens.push(makeToken({
                            lexeme:  s,
                            cls:     TOKEN_STRING,
                            index:   this._tokens.length,
                            lineNum: this._lineNum
                        }));
                        break;
                    case LEXEME_DOT:
                        if (LEXEME_DIGITS.indexOf(line[this._offset] || '') !== -1) {
                            this._lexeme += LEXEME_DOT;
                        } else {
                            this.addToken();
                            this.addToken(c);
                        }
                        break;
                    case LEXEME_ASSIGN:
                    case LEXEME_COMMA:
                    case LEXEME_PARENTHESIS_OPEN:
                    case LEXEME_PARENTHESIS_CLOSE:
                    case LEXEME_BRACKET_OPEN:
                    case LEXEME_BRACKET_CLOSE:
                    case LEXEME_CURLY_OPEN:
                    case LEXEME_CURLY_CLOSE:
                    case LEXEME_COLON:
                        this.addToken();
                        if (line[this._offset] === LEXEME_ASSIGN) {
                            this.addToken(c + this.readChar());
                        } else {
                            this.addToken(c);
                        }
                        break;
                    case LEXEME_POINTER:
                    case LEXEME_ADDRESS:
                        this.addToken();
                        this.addToken(c);
                        break;
                    case LEXEME_SUB:
                        this.addToken();
                        if (line[this._offset] === LEXEME_SUB) { // --
                            this.readChar();
                            this.addDecTokens();
                        } else if (line[this._offset] === LEXEME_ASSIGN) {
                            this.addToken(c + this.readChar());
                        } else if (LEXEME_IDENTIFIER_CHARS.indexOf(line[this._offset] || '') !== -1) {
                            this.addMinusToken();
                            this._lexeme = '';
                        } else if (LEXEME_DIGITS.indexOf(line[this._offset] || '') !== -1) {
                            this._lexeme = c;
                        } else {
                            this.addToken(c);
                        }
                        break;
                    case LEXEME_ADD:
                        this.addToken();
                        if (line[this._offset] === LEXEME_ADD) { // ++
                            this.readChar();
                            this.addIncTokens();
                        } else {
                            if (line[this._offset] === LEXEME_ASSIGN) {
                                this.addToken(c + this.readChar());
                            } else {
                                this.addToken(c);
                            }
                        }
                        break;
                    case LEXEME_MUL:
                    case LEXEME_DIV:
                    case LEXEME_GREATER:
                    case LEXEME_LESS:
                    case '!':
                        this.addToken();
                        if (line[this._offset] === LEXEME_ASSIGN) {
                            this.addToken(c + this.readChar());
                        } else {
                            this.addToken(c);
                        }
                        break;
                    case LEXEME_SEMICOLON:
                        this.addToken();
                        let comment = '';
                        while (c !== null) {
                            c = this.readChar();
                            if (c === LEXEME_NEWLINE) {
                                if (this._lastNonWhiteSpaceToken) {
                                    this._lastNonWhiteSpaceToken.tag = this.parseTag(comment.trim());
                                    this._lastNonWhiteSpaceToken     = null;
                                }
                                this.addToken(c);
                                this._index--;
                                this._lineNum++;
                                break;
                            } else {
                                comment += c;
                            }
                        }
                        break;
                    default:
                        this._lexeme += c;
                        break;
                }
                c = this.readChar();
            }
            this.addToken();
            return this;
        }

        getTokens() {
            return this._tokens;
        }

        getLineNum() {
            return this._lineNum;
        }
    };
})();
