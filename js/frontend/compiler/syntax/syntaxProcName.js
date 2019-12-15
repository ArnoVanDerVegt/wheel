/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const t     = require('../tokenizer/tokenizer');
const utils = require('./utils');

exports.procNameScopeTokens = function() {
    let tokens = utils.createTokens();

    // "(" -> IDENTIFIER | "number" | "string"
    let follow05 = [
            {token: t.TOKEN_IDENTIFIER},
            {token: t.TOKEN_TYPE, lexeme: [t.LEXEME_NUMBER, t.LEXEME_STRING]}
        ];
    tokens[t.TOKEN_PARENTHESIS_OPEN] = follow05;

    // IDENTIFIER -> "("
    let follow06 = [
            {token: t.TOKEN_PARENTHESIS_OPEN}
        ];
    tokens[t.TOKEN_IDENTIFIER] = follow06;

    return utils.updateTokens(tokens);
};
