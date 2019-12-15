/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const t     = require('../tokenizer/tokenizer');
const utils = require('./utils');

exports.forToAssignmentScopeTokens = function() {
    let tokens = utils.createTokens();

    // ")" -> "to" | "downto" | "+" | "-" | "*" | "/" | "]" | ")" | "," | "." | "\n"
    let follow01 = [
            {token: t.TOKEN_NUMERIC_OPERATOR},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_DOT},
            {token: t.TOKEN_KEYWORD,     lexeme: [t.LEXEME_TO, t.LEXEME_DOWNTO]},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_PARENTHESIS_CLOSE][t.LEXEME_PARENTHESIS_CLOSE] = follow01;

    // "]" -> "to" | "downto" | "+" | "-" | "*" | "/" | "[" | "]" | ")" | "," | "." | "\n"
    let follow02 = [
            {token: t.TOKEN_NUMERIC_OPERATOR},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_DOT},
            {token: t.TOKEN_KEYWORD,     lexeme: [t.LEXEME_TO, t.LEXEME_DOWNTO]},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_BRACKET_CLOSE][t.LEXEME_BRACKET_CLOSE] = follow02;

    // "(" -> IDENTIFIER | NUMBER | "(" | ")" | "["
    let follow03 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_OPEN}
        ];
    tokens[t.TOKEN_PARENTHESIS_OPEN][t.LEXEME_PARENTHESIS_OPEN] = follow03;
    tokens[t.TOKEN_NUMERIC_OPERATOR][t.LEXEME_MUL             ] = follow03;
    tokens[t.TOKEN_NUMERIC_OPERATOR][t.LEXEME_DIV             ] = follow03;
    tokens[t.TOKEN_NUMERIC_OPERATOR][t.LEXEME_SUB             ] = follow03;
    tokens[t.TOKEN_NUMERIC_OPERATOR][t.LEXEME_ADD             ] = follow03;

    // "[" -> NUMBER
    let follow04 = [
            {token: t.TOKEN_NUMBER}
        ];
    tokens[t.TOKEN_BRACKET_OPEN][t.LEXEME_BRACKET_OPEN] = follow04;

    // "," -> IDENTIFIER | NUMBER | "(" | "["
    let follow05 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_BRACKET_OPEN}
        ];
    tokens[t.TOKEN_COMMA][t.LEXEME_COMMA] = follow05;

    // "." -> IDENTIFIER
    let follow06 = [
            {token: t.TOKEN_IDENTIFIER}
        ];
    tokens[t.TOKEN_DOT][t.LEXEME_DOT] = follow06;

    // NUMBER -> "to" | "downto" | "+" | "-" | "*" | "/" | ")" | "]" | "," | "\n"
    let follow07 = [
            {token: t.TOKEN_NUMERIC_OPERATOR},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_KEYWORD,     lexeme: [t.LEXEME_TO, t.LEXEME_DOWNTO]},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_NUMBER] = follow07;

    // IDENTIFIER -> "+" | "-" | "*" | "/" | "(" | ")" | "[" | "]" | "," | "." | "\n"
    let follow09 = [
            {token: t.TOKEN_NUMERIC_OPERATOR},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_DOT},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_IDENTIFIER] = follow09;

    return utils.updateTokens(tokens);
};
