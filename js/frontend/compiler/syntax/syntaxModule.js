/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const t     = require('../tokenizer/tokenizer');
const utils = require('./utils');

exports.moduleScopeTokens = function() {
    let tokens = utils.createTokens();

    // "," -> NUMBER
    let follow01 = [
            {token: t.TOKEN_NUMBER}
        ];
    tokens[t.TOKEN_COMMA][t.LEXEME_COMMA] = follow01;

    // NUMBER -> "," | "\n"
    let follow02 = [
            {token: t.TOKEN_COMMA},
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_NUMBER] = follow02;

    return utils.updateTokens(tokens);
};
