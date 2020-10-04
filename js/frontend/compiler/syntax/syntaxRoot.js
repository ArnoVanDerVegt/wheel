/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const t     = require('../tokenizer/tokenizer');
const utils = require('./utils');

exports.rootScopeTokens = function() {
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

    // "=" -> IDENTIFIER| NUMBER | STRING | "(" | "[" | "{" | "@"
    let follow02 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_STRING},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_CURLY_OPEN},
            {token: t.TOKEN_ADDRESS}
        ];
    tokens[t.TOKEN_ASSIGNMENT_OPERATOR][t.LEXEME_ASSIGN] = follow02;

    // "[" -> IDENTIFIER | NUMBER | STRING | "(" | "{" | "\n"
    let follow03 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_STRING},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_CURLY_OPEN},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_BRACKET_OPEN][t.LEXEME_BRACKET_OPEN] = follow03;

    // "{" -> NUMBER | STRING | "[" | "{"
    let follow04 = [
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_STRING},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_CURLY_OPEN}
        ];
    tokens[t.TOKEN_CURLY_OPEN][t.LEXEME_CURLY_OPEN] = follow04;

    // "end" -> META | "\n"
    let follow05 = [
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]},
            {token: t.TOKEN_META}
        ];
    tokens[t.TOKEN_KEYWORD][t.LEXEME_END] = follow05;

    // "namespace" | "proc" | "record" | "." | "^" | "@" -> IDENTIFIER
    let follow06 = [
            {token: t.TOKEN_IDENTIFIER}
        ];
    tokens[t.TOKEN_KEYWORD][t.LEXEME_NAMESPACE] = follow06;
    tokens[t.TOKEN_KEYWORD][t.LEXEME_PROC     ] = follow06;
    tokens[t.TOKEN_KEYWORD][t.LEXEME_RECORD   ] = follow06;
    tokens[t.TOKEN_DOT    ][t.LEXEME_DOT      ] = follow06;
    tokens[t.TOKEN_POINTER][t.LEXEME_POINTER  ] = follow06;
    tokens[t.TOKEN_ADDRESS][t.LEXEME_ADDRESS  ] = follow06;

    // "number" | "string" -> IDENTIFIER | "^"
    let follow07 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_POINTER}
        ];
    tokens[t.TOKEN_TYPE][t.LEXEME_NUMBER] = follow07;
    tokens[t.TOKEN_TYPE][t.LEXEME_STRING] = follow07;

    // ")" -> "+" | "-" | "*" | "/" | "]" | ")" | "+=" | "-=" | "*=" | "/=" | "," | "." | "\n"
    let follow08 = [
            {token: t.TOKEN_NUMERIC_OPERATOR},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_ASSIGNMENT_OPERATOR},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_DOT},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_PARENTHESIS_CLOSE][t.LEXEME_PARENTHESIS_CLOSE] = follow08;

    // "]" -> "+" | "-" | "*" | "/" | "]" | "[" | ")" | "}" | "+=" | "-=" | "*=" | "/=" | "," | "." | "\n"
    let follow09 = [
            {token: t.TOKEN_NUMERIC_OPERATOR},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_CURLY_CLOSE},
            {token: t.TOKEN_ASSIGNMENT_OPERATOR},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_DOT},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_BRACKET_CLOSE][t.LEXEME_BRACKET_CLOSE] = follow09;

    // "}" -> "]" | "}" | "," | "\n"
    let follow10 = [
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_CURLY_CLOSE},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_CURLY_CLOSE][t.LEXEME_CURLY_CLOSE] = follow10;

    // "(" -> IDENTIFIER | NUMBER | STRING | "number" | "string" | "(" | ")" | "[" | "@"
    let follow11 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_STRING},
            {token: t.TOKEN_TYPE},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_ADDRESS}
        ];
    tokens[t.TOKEN_PARENTHESIS_OPEN][t.LEXEME_PARENTHESIS_OPEN] = follow11;

    // "," -> IDENTIFIER | NUMBER | STRING | "number" | "string" | "(" | "[" | "{" | "@" | "^" | "\n"
    let follow12 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_STRING},
            {token: t.TOKEN_TYPE},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_CURLY_OPEN},
            {token: t.TOKEN_ADDRESS},
            {token: t.TOKEN_POINTER},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_COMMA][t.LEXEME_COMMA] = follow12;

    // META ->  NUMBER "|" STRING
    let follow13 = [
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_STRING}
        ];
    tokens[t.TOKEN_META] = follow13;

    // NUMBER -> "+" | "-" | "*" | "/" | ")" | "]" | "}" |  "," | ":" | "\n"
    let follow14 = [
            {token: t.TOKEN_NUMERIC_OPERATOR},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_CURLY_CLOSE},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_COLON},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_NUMBER] = follow14;

    // STRING -> IDENTIFIER | STRING | "," | ")" | "]" | "\n"
    let follow15 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_STRING},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_STRING] = follow15;

    // IDENTIFIER -> IDENTIFIER | "=" | "+" | "-" | "*" | "/"
    // IDENTIFIER -> "(" | ")" | "[" | "]" | "," | "." | "^" | "\n"
    let follow16 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMERIC_OPERATOR},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_DOT},
            {token: t.TOKEN_POINTER},
            {token: t.TOKEN_ASSIGNMENT_OPERATOR, lexeme: [t.LEXEME_ASSIGN]},
            {token: t.TOKEN_WHITE_SPACE,         lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_IDENTIFIER] = follow16;

    return utils.updateTokens(tokens);
};
