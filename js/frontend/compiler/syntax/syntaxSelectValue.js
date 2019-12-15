/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const t     = require('../tokenizer/tokenizer');
const utils = require('./utils');

exports.selectValueScopeTokens = function() {
    let tokens = utils.createTokens();

    // "*" | "/" | "-" | "+" -> IDENTIFIER | NUMBER | "("
    let follow01 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_PARENTHESIS_OPEN}
        ];
    tokens[t.TOKEN_NUMERIC_OPERATOR][t.LEXEME_MUL] = follow01;
    tokens[t.TOKEN_NUMERIC_OPERATOR][t.LEXEME_DIV] = follow01;
    tokens[t.TOKEN_NUMERIC_OPERATOR][t.LEXEME_SUB] = follow01;
    tokens[t.TOKEN_NUMERIC_OPERATOR][t.LEXEME_ADD] = follow01;

    // "]" | ")" -> "+" | "-" | "*" | "/" | "]" | ")" | "," | "." | "\n"
    let follow02 = [
            {token: t.TOKEN_NUMERIC_OPERATOR},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_DOT},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_PARENTHESIS_CLOSE][t.LEXEME_PARENTHESIS_CLOSE] = follow02;
    tokens[t.TOKEN_BRACKET_CLOSE    ][t.LEXEME_BRACKET_CLOSE    ] = follow02;

    // "(" -> IDENTIFIER | NUMBER | STRING | "(" | ")" | "["
    let follow03 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_OPEN}
        ];
    tokens[t.TOKEN_PARENTHESIS_OPEN][t.LEXEME_PARENTHESIS_OPEN ] = follow03;

    // "," -> IDENTIFIER | NUMBER | "(" | "["
    let follow04 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_BRACKET_OPEN}
        ];
    tokens[t.TOKEN_COMMA][t.LEXEME_COMMA] = follow04;

    // "." -> IDENTIFIER
    let follow05 = [
            {token: t.TOKEN_IDENTIFIER}
        ];
    tokens[t.TOKEN_DOT][t.LEXEME_DOT] = follow05;

    // NUMBER -> "+" | "-" | "*" | "/" | ")" | "]" | "," | "\n"
    let follow06 = [
            {token: t.TOKEN_NUMERIC_OPERATOR},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_NUMBER] = follow06;

    // IDENTIFIER -> "+" | "-" | "*" | "/" | "(" | ")" | "[" | "]" | "," | "." | "\n"
    let follow07 = [
            {token: t.TOKEN_NUMERIC_OPERATOR},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_DOT},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_IDENTIFIER] = follow07;

    return utils.updateTokens(tokens);
};
