/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const t = require('../tokenizer/tokenizer');

exports.createTokens = function() {
    let tokens = [];
    tokens[t.TOKEN_COLON              ] = {e: true};
    tokens[t.TOKEN_COMMA              ] = {e: true};
    tokens[t.TOKEN_DOT                ] = {e: true};
    tokens[t.TOKEN_PARENTHESIS_OPEN   ] = {e: true};
    tokens[t.TOKEN_PARENTHESIS_CLOSE  ] = {e: true};
    tokens[t.TOKEN_BRACKET_OPEN       ] = {e: true};
    tokens[t.TOKEN_BRACKET_CLOSE      ] = {e: true};
    tokens[t.TOKEN_CURLY_OPEN         ] = {e: true};
    tokens[t.TOKEN_CURLY_CLOSE        ] = {e: true};
    tokens[t.TOKEN_KEYWORD            ] = {e: true};
    tokens[t.TOKEN_NUMERIC_OPERATOR   ] = {e: true};
    tokens[t.TOKEN_BOOLEAN_OPERATOR   ] = {e: true};
    tokens[t.TOKEN_ASSIGNMENT_OPERATOR] = {e: true};
    tokens[t.TOKEN_TYPE               ] = {e: true};
    tokens[t.TOKEN_META               ] = {e: true};
    tokens[t.TOKEN_POINTER            ] = {e: true};
    tokens[t.TOKEN_ADDRESS            ] = {e: true};
    return tokens;
};

exports.updateTokens = function(tokens) {
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] && tokens[i].e && (Object.keys(tokens[i]).length === 1)) {
            delete tokens[i];
        }
    }
    return tokens;
};
