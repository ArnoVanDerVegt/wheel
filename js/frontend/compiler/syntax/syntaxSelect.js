/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const t     = require('../tokenizer/tokenizer');
const utils = require('./utils');

exports.selectScopeTokens = function() {
    let tokens = utils.createTokens();

    // "case" -> NUMBER
    let follow01 = [
            {token: t.TOKEN_NUMBER}
        ];
    tokens[t.TOKEN_KEYWORD][t.LEXEME_CASE] = follow01;

    // ":" -> "\n"
    let follow02 = [
            {token: t.TOKEN_WHITE_SPACE, lexeme: [t.LEXEME_NEWLINE]}
        ];
    tokens[t.TOKEN_COLON][t.LEXEME_COLON] = follow02;

    // NUMBER -> ":"
    let follow03 = [
            {token: t.TOKEN_COLON}
        ];
    tokens[t.TOKEN_NUMBER] = follow03;

    return utils.updateTokens(tokens);
};
