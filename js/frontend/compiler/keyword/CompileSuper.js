/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $             = require('../../program/commands');
const t             = require('../tokenizer/tokenizer');
const errors        = require('../errors');
const err           = require('../errors').errors;
const CompileScope  = require('../compiler/CompileScope').CompileScope;
const CompileCall   = require('../compiler/CompileCall').CompileCall;

exports.CompileSuper = class extends CompileScope {
    compile(iterator) {
        let opts = {compiler: this._compiler, program: this._program, scope: this._scope};
        this.checkNotInGlobalScope(iterator);
        new CompileCall(opts).compile({
            iterator:       iterator,
            proc:           t.LEXEME_PROC,
            procExpression: t.LEXEME_SUPER,
            procIdentifier: t.LEXEME_SUPER
        });
    }
};
