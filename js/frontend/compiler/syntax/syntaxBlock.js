/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const t     = require('../tokenizer/tokenizer');
const utils = require('./utils');

exports.blockScopeTokens = function() {
    let tokens = utils.createTokens();

    // "*" | "/" | "-" | "+"                 -> IDENTIFIER | NUMBER | "("
    // "<=" | ">=" | "!=" | "==" | "<" | ">" -> IDENTIFIER | NUMBER | "("
    // "+=" | "-=" | "*=" | "/="             -> IDENTIFIER | NUMBER | "("
    let follow01 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_PARENTHESIS_OPEN}
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
    tokens[t.TOKEN_BOOLEAN_OPERATOR   ][t.LEXEME_AND          ] = follow01;
    tokens[t.TOKEN_BOOLEAN_OPERATOR   ][t.LEXEME_OR           ] = follow01;
    tokens[t.TOKEN_ASSIGNMENT_OPERATOR][t.LEXEME_ASSIGN_ADD   ] = follow01;
    tokens[t.TOKEN_ASSIGNMENT_OPERATOR][t.LEXEME_ASSIGN_SUB   ] = follow01;
    tokens[t.TOKEN_ASSIGNMENT_OPERATOR][t.LEXEME_ASSIGN_MUL   ] = follow01;
    tokens[t.TOKEN_ASSIGNMENT_OPERATOR][t.LEXEME_ASSIGN_DIV   ] = follow01;

    // "=" -> IDENTIFIER| NUMBER | STRING | "(" | "[" | "@"
    let follow02 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_STRING},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_ADDRESS}
        ];
    tokens[t.TOKEN_ASSIGNMENT_OPERATOR][t.LEXEME_ASSIGN] = follow02;

    // "[" -> IDENTIFIER | NUMBER | STRING | "("
    let follow03 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_STRING},
            {token: t.TOKEN_PARENTHESIS_OPEN}
        ];
    tokens[t.TOKEN_BRACKET_OPEN][t.LEXEME_BRACKET_OPEN] = follow03;

    // "proc" | "record" | "addr" | "for" | "elseif" | "." | "^" | "@" -> IDENTIFIER
    let follow04 = [
            {token: t.TOKEN_IDENTIFIER}
        ];
    tokens[t.TOKEN_KEYWORD][t.LEXEME_PROC   ] = follow04;
    tokens[t.TOKEN_KEYWORD][t.LEXEME_RECORD ] = follow04;
    tokens[t.TOKEN_KEYWORD][t.LEXEME_ADDR   ] = follow04;
    tokens[t.TOKEN_KEYWORD][t.LEXEME_FOR    ] = follow04;
    tokens[t.TOKEN_KEYWORD][t.LEXEME_ELSEIF ] = follow04;
    tokens[t.TOKEN_DOT    ][t.LEXEME_DOT    ] = follow04;
    tokens[t.TOKEN_POINTER][t.LEXEME_POINTER] = follow04;
    tokens[t.TOKEN_ADDRESS][t.LEXEME_ADDRESS] = follow04;

    // "number" | "string" -> IDENTIFIER | "^"
    let follow05 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_POINTER}
        ];
    tokens[t.TOKEN_TYPE][t.LEXEME_NUMBER] = follow05;
    tokens[t.TOKEN_TYPE][t.LEXEME_STRING] = follow05;

    // "case" | "mod" -> NUMBER
    let follow06 = [
            {token: t.TOKEN_NUMBER}
        ];
    tokens[t.TOKEN_KEYWORD][t.LEXEME_CASE] = follow06;
    tokens[t.TOKEN_KEYWORD][t.LEXEME_MOD ] = follow06;

    // "default" -> ":"
    let follow07 = [
            {token: t.TOKEN_COLON}
        ];
    tokens[t.TOKEN_KEYWORD][t.LEXEME_DEFAULT] = follow07;

    // "]" | ")" -> "+" | "-" | "*" | "/" | "[" | "]" | ")" | "+=" | "-=" | "*=" | "/=" | "," | "." | "\n"
    let follow08 = [
            {token: t.TOKEN_NUMERIC_OPERATOR},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_ASSIGNMENT_OPERATOR},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_DOT},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_PARENTHESIS_CLOSE][t.LEXEME_PARENTHESIS_CLOSE] = follow08;
    tokens[t.TOKEN_BRACKET_CLOSE    ][t.LEXEME_BRACKET_CLOSE    ] = follow08;

    // "(" -> IDENTIFIER | NUMBER | STRING | "number" | "string" | "(" | ")" | "[" | "@"
    let follow09 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_STRING},
            {token: t.TOKEN_TYPE},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_ADDRESS}
        ];
    tokens[t.TOKEN_PARENTHESIS_OPEN][t.LEXEME_PARENTHESIS_OPEN ] = follow09;

    // "," -> IDENTIFIER | NUMBER | STRING | "number" | "string" | "(" | "[" | "@" | "^"
    let follow10 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_STRING},
            {token: t.TOKEN_TYPE},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_BRACKET_OPEN},
            {token: t.TOKEN_ADDRESS},
            {token: t.TOKEN_POINTER}
        ];
    tokens[t.TOKEN_COMMA][t.LEXEME_COMMA] = follow10;

    // META ->  NUMBER | STRING | "\n"
    let follow11 = [
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_STRING},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_META] = follow11;

    // "repeat" | "break" -> IDENTIFIER | "\n"
    let follow12 = [
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]},
            {token: t.TOKEN_IDENTIFIER}
        ];
    tokens[t.TOKEN_KEYWORD][t.LEXEME_REPEAT] = follow12;
    tokens[t.TOKEN_KEYWORD][t.LEXEME_BREAK ] = follow12;

    // "if" | "elseif" | "while" | "select" -> IDENTIFIER | "("
    let follow13 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_PARENTHESIS_OPEN},
            {token: t.TOKEN_KEYWORD, lexeme: t.LEXEME_NOT}
        ];
    tokens[t.TOKEN_KEYWORD][t.LEXEME_IF    ] = follow13;
    tokens[t.TOKEN_KEYWORD][t.LEXEME_ELSEIF] = follow13;
    tokens[t.TOKEN_KEYWORD][t.LEXEME_WHILE ] = follow13;

    // "if" | "elseif" | "while" | "select" -> IDENTIFIER | "("
    let follow14 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_PARENTHESIS_OPEN}
        ];
    tokens[t.TOKEN_KEYWORD][t.LEXEME_SELECT] = follow14;

    // "else" -> "\n"
    let follow15 = [
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_KEYWORD][t.LEXEME_ELSE] = follow15;

    // "ret" -> NUMBER | IDENTIFIER | "\n"
    let follow16 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_NUMBER},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_KEYWORD][t.LEXEME_RET] = follow16;

    // NUMBER -> "+" | "-" | "*" | "/" | ")" | "]" | "," | ":" | "\n"
    let follow17 = [
            {token: t.TOKEN_NUMERIC_OPERATOR},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_COLON},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_NUMBER] = follow17;

    // STRING -> IDENTIFIER | STRING | "," | ")" | "]" | "\n"
    let follow18 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_STRING},
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_PARENTHESIS_CLOSE},
            {token: t.TOKEN_BRACKET_CLOSE},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_STRING] = follow18;

    // IDENTIFIER -> IDENTIFIER | "+" | "-" | "*" | "/" | "+=" | "-=" | "*=" | "/=" |
    // IDENTIFIER -> "(" | ")" | "[" | "]" | "," | "." | "^" | "\n"
    let follow19 = [
            {token: t.TOKEN_IDENTIFIER},
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
    tokens[t.TOKEN_IDENTIFIER] = follow19;

    return utils.updateTokens(tokens);
};
