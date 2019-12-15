/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const t     = require('../tokenizer/tokenizer');
const utils = require('./utils');

exports.procParamsScopeTokens = function() {
    let tokens = utils.createTokens();

    // "]" -> "," | ")" | "["
    let follow01 = [
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_OPEN}
        ];
    tokens[t.TOKEN_BRACKET_CLOSE][t.LEXEME_BRACKET_CLOSE] = follow01;

    // "(" | "proc" -> IDENTIFIER
    let follow02 = [
            {token: t.TOKEN_IDENTIFIER}
        ];
    tokens[t.TOKEN_PARENTHESIS_OPEN][t.LEXEME_PARENTHESIS_OPEN] = follow02;
    tokens[t.TOKEN_KEYWORD         ][t.LEXEME_PROC            ] = follow02;

    // "[" -> NUMBER
    let follow03 = [
            {token: t.TOKEN_NUMBER}
        ];
    tokens[t.TOKEN_BRACKET_OPEN][t.LEXEME_BRACKET_OPEN] = follow03;

    // "," -> "number" | "string" | "proc" | IDENTIFIER
    let follow04 = [
            {token: t.TOKEN_TYPE},
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_PROC}
        ];
    tokens[t.TOKEN_COMMA][t.LEXEME_COMMA] = follow04;

    // "proc" | "number" | "string" -> IDENTIFIER | "^"
    let follow05 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_POINTER}
        ];
    tokens[t.TOKEN_TYPE][t.LEXEME_NUMBER] = follow05;
    tokens[t.TOKEN_TYPE][t.LEXEME_STRING] = follow05;

    // "^" -> IDENTIFIER
    let follow06 = [
            {token: t.TOKEN_IDENTIFIER}
        ];
    tokens[t.TOKEN_POINTER][t.LEXEME_POINTER] = follow06;

    // NUMBER -> "]"
    let follow07 = [
            {token: t.TOKEN_BRACKET_CLOSE}
        ];
    tokens[t.TOKEN_NUMBER] = follow07;

    // IDENTIFIER -> IDENTIFIER | "[" | "," | ")" | "^"
    let follow08 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_POINTER}
        ];
    tokens[t.TOKEN_IDENTIFIER] = follow08;

    return utils.updateTokens(tokens);
};
