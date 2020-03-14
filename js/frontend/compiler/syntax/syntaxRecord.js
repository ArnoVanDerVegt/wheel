/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const t     = require('../tokenizer/tokenizer');
const utils = require('./utils');

exports.recordScopeTokens = function() {
    let tokens = utils.createTokens();

    // "[" -> NUMBER
    let follow01 = [
            {token: t.TOKEN_NUMBER}
        ];
    tokens[t.TOKEN_BRACKET_OPEN][t.LEXEME_BRACKET_OPEN] = follow01;

    // "proc" | "^" -> IDENTIFIER
    let follow02 = [
            {token: t.TOKEN_IDENTIFIER}
        ];
    tokens[t.TOKEN_POINTER][t.LEXEME_POINTER] = follow02;
    tokens[t.TOKEN_KEYWORD][t.LEXEME_PROC   ] = follow02;
    tokens[t.TOKEN_KEYWORD][t.LEXEME_UNION  ] = follow02;

    // "," -> IDENTIFIER | "^"
    let follow03 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_POINTER}
        ];
    tokens[t.TOKEN_COMMA][t.LEXEME_COMMA] = follow03;

    // "number" | "string" -> IDENTIFIER | "^"
    let follow04 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_POINTER}
        ];
    tokens[t.TOKEN_TYPE][t.LEXEME_NUMBER] = follow04;
    tokens[t.TOKEN_TYPE][t.LEXEME_STRING] = follow04;

    // "]" -> "," | "[" | "\n"
    let follow05 = [
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_BRACKET_CLOSE][t.LEXEME_BRACKET_CLOSE] = follow05;

    // NUMBER -> "]"
    let follow06 = [
            {token: t.TOKEN_BRACKET_CLOSE}
        ];
    tokens[t.TOKEN_NUMBER] = follow06;

    // IDENTIFIER -> IDENTIFIER | "[" | "," | "^" | "\n"
    let follow07 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_POINTER},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_IDENTIFIER] = follow07;

    // "union" -> "\n"
    let follow08 = [
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_KEYWORD][t.LEXEME_UNION] = follow08;

    return utils.updateTokens(tokens);
};
