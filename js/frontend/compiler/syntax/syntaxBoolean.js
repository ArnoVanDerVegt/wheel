/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const t     = require('../tokenizer/tokenizer');
const utils = require('./utils');

exports.booleanScopeTokens = function() {
    let tokens = utils.createTokens();

    // "*" | "/" | "-" | "+"                 -> IDENTIFIER | NUMBER | "("
    // "<=" | ">=" | "!=" | "==" | "<" | ">" -> IDENTIFIER | NUMBER | "("
    // "+=" | "-=" | "*=" | "/="             -> IDENTIFIER | NUMBER | "("
    let follow01 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_KEYWORD, lexeme: [t.LEXEME_NOT]}
        ];
    tokens[t.TOKEN_NUMERIC_OPERATOR   ][t.LEXEME_MUL          ] = follow01;
    tokens[t.TOKEN_NUMERIC_OPERATOR   ][t.LEXEME_DIV          ] = follow01;
    tokens[t.TOKEN_NUMERIC_OPERATOR   ][t.LEXEME_SUB          ] = follow01;
    tokens[t.TOKEN_NUMERIC_OPERATOR   ][t.LEXEME_ADD          ] = follow01;
    tokens[t.TOKEN_NUMERIC_OPERATOR   ][t.LEXEME_EQUAL        ] = follow01;
    tokens[t.TOKEN_NUMERIC_OPERATOR   ][t.LEXEME_GREATER_EQUAL] = follow01;
    tokens[t.TOKEN_NUMERIC_OPERATOR   ][t.LEXEME_LESS_EQUAL   ] = follow01;
    tokens[t.TOKEN_NUMERIC_OPERATOR   ][t.LEXEME_NOT_EQUAL    ] = follow01;
    tokens[t.TOKEN_NUMERIC_OPERATOR   ][t.LEXEME_LESS         ] = follow01;
    tokens[t.TOKEN_NUMERIC_OPERATOR   ][t.LEXEME_GREATER      ] = follow01;
    tokens[t.TOKEN_ASSIGNMENT_OPERATOR][t.LEXEME_ASSIGN_ADD   ] = follow01;
    tokens[t.TOKEN_ASSIGNMENT_OPERATOR][t.LEXEME_ASSIGN_SUB   ] = follow01;
    tokens[t.TOKEN_ASSIGNMENT_OPERATOR][t.LEXEME_ASSIGN_MUL   ] = follow01;
    tokens[t.TOKEN_ASSIGNMENT_OPERATOR][t.LEXEME_ASSIGN_DIV   ] = follow01;

    // "and" | "or" -> IDENTIFIER | NUMBER | "(" | "not"
    let follow02 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_KEYWORD, lexeme: [t.LEXEME_NOT]}
        ];

    tokens[t.TOKEN_BOOLEAN_OPERATOR][t.LEXEME_AND] = follow02;
    tokens[t.TOKEN_BOOLEAN_OPERATOR][t.LEXEME_OR ] = follow02;

    // "]" | ")" -> "and" | "or" | "+" | "-" | "*" | "/" | "[" | "]" | ")" | "," | "." | "\n"
    let follow03 = [
            {token: t.TOKEN_BOOLEAN_OPERATOR},
            {token: t.TOKEN_NUMERIC_OPERATOR},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_DOT},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_PARENTHESIS_CLOSE][t.LEXEME_PARENTHESIS_CLOSE] = follow03;
    tokens[t.TOKEN_BRACKET_CLOSE    ][t.LEXEME_BRACKET_CLOSE    ] = follow03;

    // "(" -> IDENTIFIER | NUMBER | STRING | "(" | ")" | "["
    let follow04 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_STRING},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_OPEN}
        ];
    tokens[t.TOKEN_PARENTHESIS_OPEN][t.LEXEME_PARENTHESIS_OPEN] = follow04;

    // "[" -> NUMBER | IDENTIFER
    let follow05 = [
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_IDENTIFIER}
        ];
    tokens[t.TOKEN_BRACKET_OPEN][t.LEXEME_BRACKET_OPEN] = follow05;

    // "," -> IDENTIFIER | NUMBER | "(" | "["
    let follow06 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_BRACKET_OPEN}
        ];
    tokens[t.TOKEN_COMMA][t.LEXEME_COMMA] = follow06;

    // "." -> IDENTIFIER
    let follow07 = [
            {token: t.TOKEN_IDENTIFIER}
        ];
    tokens[t.TOKEN_DOT][t.LEXEME_DOT] = follow07;

    // NUMBER -> "and" | "or" | "+" | "-" | "*" | "/" | ")" | "[" | "]" | "," | "\n"
    let follow08 = [
            {token: t.TOKEN_BOOLEAN_OPERATOR},
            {token: t.TOKEN_NUMERIC_OPERATOR},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_NUMBER] = follow08;

    // STRING -> ")"
    let follow09 = [
            {token: t.TOKEN_PARENTHESIS_CLOSE}
        ];
    tokens[t.TOKEN_STRING] = follow09;

    // IDENTIFIER -> "and" | "or" | "+" | "-" | "*" | "/" | "(" | ")" | "[" | "]" | "," | "." | "\n"
    let follow10 = [
            {token: t.TOKEN_BOOLEAN_OPERATOR},
            {token: t.TOKEN_NUMERIC_OPERATOR},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_DOT},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_IDENTIFIER] = follow10;

    // "not" -> "(" | IDENTIFIER
    let follow11 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_PARENTHESIS_OPEN}
        ];
    tokens[t.TOKEN_KEYWORD][t.LEXEME_NOT] = follow11;

    return utils.updateTokens(tokens);
};
