/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $             = require('../../program/commands');
const t             = require('../tokenizer/tokenizer');
const errors        = require('../errors');
const err           = require('../errors').errors;
const CompileScope  = require('../compiler/CompileScope').CompileScope;

exports.CompileAddr = class extends CompileScope {
    compile(iterator) {
        this.checkNotInGlobalScope(iterator);
        let addrExpression = iterator.nextUntilLexeme([t.LEXEME_NEWLINE]);
        let token          = addrExpression.tokens[0];
        let identifier     = this._scope.findIdentifier(token.lexeme);
        if (identifier === null) {
            throw errors.createError(err.UNDEFINED_IDENTIFIER, token, 'Undefined identifier "' + token.lexeme + '".');
        }
        this._program.nextBlockId(token, this._scope);
        this._varExpression.compileExpressionToRegister(identifier, addrExpression, $.REG_SRC, false, false);
    }
};
