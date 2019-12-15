/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const t     = require('../tokenizer/tokenizer');
const utils = require('./utils');

exports.assignmentScopeTokens = function() {
    let tokens = utils.createTokens();

    // ")" -> "+" | "-" | "*" | "/" | "]" | ")" | "," | "." | "\n"
    let follow01 = [
            {token: t.TOKEN_NUMERIC_OPERATOR},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_DOT},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_PARENTHESIS_CLOSE][t.LEXEME_PARENTHESIS_CLOSE] = follow01;

    // "]" -> "+" | "-" | "*" | "/" | "]" | "[" | ")" | "}" | "," | "." | "=" | "\n"
    let follow02 = [
            {token: t.TOKEN_NUMERIC_OPERATOR},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_CURLY_CLOSE},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_DOT},
            {token: t.TOKEN_ASSIGNMENT_OPERATOR, lexeme: [t.LEXEME_ASSIGN]},
            {token: t.TOKEN_WHITE_SPACE,         lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_BRACKET_CLOSE][t.LEXEME_BRACKET_CLOSE] = follow02;

    // "}" -> "]" | "}" | "," | "\n"
    let follow03 = [
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_CURLY_CLOSE},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_CURLY_CLOSE][t.LEXEME_CURLY_CLOSE] = follow03;

    // "(" -> IDENTIFIER | NUMBER | STRING | "(" | ")" | "[" | "{" | "@"
    let follow04 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_STRING},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_CURLY_OPEN},
            {token: t.TOKEN_ADDRESS}
        ];
    tokens[t.TOKEN_PARENTHESIS_OPEN][t.LEXEME_PARENTHESIS_OPEN] = follow04;

    // "[" | "{" -> IDENTIFIER | NUMBER | STRING | "(" | ")" | "[" | "{" | "@" | "\n"
    let follow05 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_STRING},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_CURLY_OPEN},
            {token: t.TOKEN_ADDRESS},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_BRACKET_OPEN][t.LEXEME_BRACKET_OPEN] = follow05;
    tokens[t.TOKEN_CURLY_OPEN][t.LEXEME_CURLY_OPEN    ] = follow05;

    // "*" | "/" | "-" -> IDENTIFIER | NUMBER | "("
    let follow06 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_PARENTHESIS_OPEN}
        ];
    tokens[t.TOKEN_NUMERIC_OPERATOR][t.LEXEME_MUL] = follow06;
    tokens[t.TOKEN_NUMERIC_OPERATOR][t.LEXEME_DIV] = follow06;
    tokens[t.TOKEN_NUMERIC_OPERATOR][t.LEXEME_SUB] = follow06;

    // "+" -> IDENTIFIER | NUMBER | STRING | "("
    let follow07 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_STRING},
            {token: t.TOKEN_PARENTHESIS_OPEN}
        ];
    tokens[t.TOKEN_NUMERIC_OPERATOR][t.LEXEME_ADD] = follow07;

    // "," -> IDENTIFIER | NUMBER | STRING | "(" | "[" | "{" | "\n"
    let follow08 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_STRING},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_CURLY_OPEN},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_COMMA][t.LEXEME_COMMA] = follow08;

    // "." | "@" -> IDENTIFIER
    let follow09 = [
            {token: t.TOKEN_IDENTIFIER}
        ];
    tokens[t.TOKEN_DOT    ][t.LEXEME_DOT    ] = follow09;
    tokens[t.TOKEN_ADDRESS][t.LEXEME_ADDRESS] = follow09;

    // "=" -> IDENTIFIER| NUMBER | STRING | "(" | "["
    let follow10 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_STRING},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_PARENTHESIS_OPEN}
        ];
    tokens[t.TOKEN_ASSIGNMENT_OPERATOR][t.LEXEME_ASSIGN] = follow10;

    // NUMBER -> "to" | "downto" | "+" | "-" | "*" | "/" | ")" | "]" | "}" | "," | "\n"
    let follow11 = [
            {token: t.TOKEN_NUMERIC_OPERATOR},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_CURLY_CLOSE},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_KEYWORD,     lexeme: [t.LEXEME_TO, t.LEXEME_DOWNTO]},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_NUMBER] = follow11;

    // STRING -> "+" | ")" | "]" | "}" | "," | "\n"
    let follow12 = [
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_CURLY_CLOSE},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_NUMERIC_OPERATOR, lexeme: [t.LEXEME_ADD]},
            {token: t.TOKEN_WHITE_SPACE,      lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_STRING] = follow12;

    // IDENTIFIER -> "+" | "-" | "*" | "/" | "(" | ")" | "[" | "]" | "," | "." | "=" | "\n"
    let follow13 = [
            {token: t.TOKEN_NUMERIC_OPERATOR},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_DOT},
            {token: t.TOKEN_ASSIGNMENT_OPERATOR, lexeme: [t.LEXEME_ASSIGN]},
            {token: t.TOKEN_WHITE_SPACE,         lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_IDENTIFIER] = follow13;

    return utils.updateTokens(tokens);
};
