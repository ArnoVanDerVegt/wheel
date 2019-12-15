/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const t     = require('../tokenizer/tokenizer');
const utils = require('./utils');

exports.selectDefaultScopeTokens = function() {
    let tokens = utils.createTokens();

    // ":" -> "\n"
    let follow01 = [
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_COLON][t.LEXEME_COLON] = follow01;

    return utils.updateTokens(tokens);
};
