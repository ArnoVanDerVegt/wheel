/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const t     = require('../tokenizer/tokenizer');
const utils = require('./utils');

exports.procScopeTokens = function() {
    let tokens = utils.createTokens();

    // "ret"                                 -> IDENTIFIER | NUMBER | "("
    // "*" | "/" | "-" | "+"                 -> IDENTIFIER | NUMBER | "("
    // "<=" | ">=" | "!=" | "==" | "<" | ">" -> IDENTIFIER | NUMBER | "("
    // "+=" | "-=" | "*=" | "/="             -> IDENTIFIER | NUMBER | "("
    let follow01 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_PARENTHESIS_OPEN}
        ];
    tokens[t.TOKEN_KEYWORD            ][t.LEXEME_RET          ] = follow01;
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
    tokens[t.TOKEN_BOOLEAN_OPERATOR   ][t.LEXEME_AND          ] = follow01;
    tokens[t.TOKEN_BOOLEAN_OPERATOR   ][t.LEXEME_OR           ] = follow01;
    tokens[t.TOKEN_ASSIGNMENT_OPERATOR][t.LEXEME_ASSIGN_ADD   ] = follow01;
    tokens[t.TOKEN_ASSIGNMENT_OPERATOR][t.LEXEME_ASSIGN_SUB   ] = follow01;
    tokens[t.TOKEN_ASSIGNMENT_OPERATOR][t.LEXEME_ASSIGN_MUL   ] = follow01;
    tokens[t.TOKEN_ASSIGNMENT_OPERATOR][t.LEXEME_ASSIGN_DIV   ] = follow01;

    // "=" -> IDENTIFIER| NUMBER | STRING "(" | "[" | "}" | "@"
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

    // "[" -> IDENTIFIER | NUMBER | STRING | "[" | "(" | "{" | "\n"
    let follow03 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_STRING},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_CURLY_OPEN},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_BRACKET_OPEN][t.LEXEME_BRACKET_OPEN] = follow03;

    // "else" | ":" -> "\n"
    let follow04 = [
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_KEYWORD][t.LEXEME_ELSE ] = follow04;
    tokens[t.TOKEN_COLON  ][t.LEXEME_COLON] = follow04;

    // "end" -> META | "\n"
    let follow05 = [
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]},
            {token: t.TOKEN_META}
        ];
    tokens[t.TOKEN_KEYWORD][t.LEXEME_END] = follow05;

    // "repeat" | "break" -> IDENTIFIER | "\n"
    let follow06 = [
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]},
            {token: t.TOKEN_IDENTIFIER}
        ];
    tokens[t.TOKEN_KEYWORD][t.LEXEME_REPEAT] = follow06;
    tokens[t.TOKEN_KEYWORD][t.LEXEME_BREAK ] = follow06;

    // "proc" | "record" | "addr" | "for" | "." | "^" | "@" -> IDENTIFIER
    let follow07 = [
            {token: t.TOKEN_IDENTIFIER}
        ];
    tokens[t.TOKEN_KEYWORD][t.LEXEME_PROC   ] = follow07;
    tokens[t.TOKEN_KEYWORD][t.LEXEME_RECORD ] = follow07;
    tokens[t.TOKEN_KEYWORD][t.LEXEME_ADDR   ] = follow07;
    tokens[t.TOKEN_KEYWORD][t.LEXEME_FOR    ] = follow07;
    tokens[t.TOKEN_DOT    ][t.LEXEME_DOT    ] = follow07;
    tokens[t.TOKEN_POINTER][t.LEXEME_POINTER] = follow07;
    tokens[t.TOKEN_ADDRESS][t.LEXEME_ADDRESS] = follow07;

    // "number" | "string" -> IDENTIFIER | "^"
    let follow08 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_POINTER}
        ];
    tokens[t.TOKEN_TYPE][t.LEXEME_NUMBER] = follow08;
    tokens[t.TOKEN_TYPE][t.LEXEME_STRING] = follow08;

    // "case" | "mod" -> NUMBER
    let follow09 = [
            {token: t.TOKEN_NUMBER}
        ];
    tokens[t.TOKEN_KEYWORD][t.LEXEME_CASE] = follow09;
    tokens[t.TOKEN_KEYWORD][t.LEXEME_MOD ] = follow09;

    // "default" -> ":"
    let follow10 = [
            {token: t.TOKEN_COLON}
        ];
    tokens[t.TOKEN_KEYWORD][t.LEXEME_DEFAULT] = follow10;

    // "if" | "while" | "select" -> IDENTIFIER | "(" | "not"
    let follow11 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_KEYWORD, lexeme: [t.LEXEME_NOT]}
        ];
    tokens[t.TOKEN_KEYWORD][t.LEXEME_IF    ] = follow11;
    tokens[t.TOKEN_KEYWORD][t.LEXEME_WHILE ] = follow11;
    tokens[t.TOKEN_KEYWORD][t.LEXEME_SELECT] = follow11;

    // ")" -> "and" | "or" | "+" | "-" | "*" | "/" | "]" | ")" | "+=" | "-=" | "*=" | "/=" | "," | "." | "\n"
    let follow12 = [
            {token: t.TOKEN_BOOLEAN_OPERATOR},
            {token: t.TOKEN_NUMERIC_OPERATOR},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_ASSIGNMENT_OPERATOR},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_DOT},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_PARENTHESIS_CLOSE][t.LEXEME_PARENTHESIS_CLOSE] = follow12;

    // "]" -> "and" | "or" | "+" | "-" | "*" | "/" | "]" | "[" | ")" | "}" | "+=" | "-=" | "*=" | "/=" | "," | "." | "\n"
    let follow13 = [
            {token: t.TOKEN_BOOLEAN_OPERATOR},
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
    tokens[t.TOKEN_BRACKET_CLOSE][t.LEXEME_BRACKET_CLOSE] = follow13;

    // "(" -> IDENTIFIER | NUMBER | STRING | "number" | "string" | "(" | "[" | "{" | ")" | "@"
    let follow14 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_STRING},
            {token: t.TOKEN_TYPE},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_CURLY_OPEN},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_ADDRESS}
        ];
    tokens[t.TOKEN_PARENTHESIS_OPEN][t.LEXEME_PARENTHESIS_OPEN] = follow14;

    // "{" -> NUMBER | STRING | "[" | "{"
    let follow15 = [
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_STRING},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_CURLY_OPEN}
        ];
    tokens[t.TOKEN_CURLY_OPEN][t.LEXEME_CURLY_OPEN] = follow15;

    // "}" -> "," | ")" | "]" | "}" | "\n"
    let follow16 = [
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_CURLY_CLOSE},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_CURLY_CLOSE][t.LEXEME_CURLY_CLOSE] = follow16;

    // "," -> IDENTIFIER | NUMBER | STRING | "number" | "string" | "(" | "[" | "{" | "@" | "^" | "\n"
    let follow17 = [
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
    tokens[t.TOKEN_COMMA][t.LEXEME_COMMA] = follow17;

    // META ->  NUMBER "|" STRING
    let follow18 = [
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_STRING}
        ];
    tokens[t.TOKEN_META] = follow18;

    // NUMBER -> "and" | "or" | "+" | "-" | "*" | "/" | ")" | "]" | "}" | "," | ":" | "\n"
    let follow19 = [
            {token: t.TOKEN_BOOLEAN_OPERATOR},
            {token: t.TOKEN_NUMERIC_OPERATOR},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_CURLY_CLOSE},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_COLON},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_NUMBER] = follow19;

    // STRING -> IDENTIFIER | STRING | "," | ")" | "]" | "}" | "\n"
    let follow20 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_STRING},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_CURLY_CLOSE},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_STRING] = follow20;

    // IDENTIFIER -> IDENTIFIER | "and" | "or" | "+" | "-" | "*" | "/" | "+=" | "-=" | "*=" | "/=" |
    // IDENTIFIER -> "(" | ")" | "[" | "]" | "," | "." | "^" | "\n"
    let follow21 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_BOOLEAN_OPERATOR},
            {token: t.TOKEN_NUMERIC_OPERATOR},
            {token: t.TOKEN_ASSIGNMENT_OPERATOR},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_DOT},
            {token: t.TOKEN_POINTER},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_IDENTIFIER] = follow21;

    return utils.updateTokens(tokens);
};
