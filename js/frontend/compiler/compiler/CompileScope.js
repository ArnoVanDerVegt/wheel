/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const errors        = require('../errors');
const err           = require('../errors').errors;
const VarExpression = require('../expression/VarExpression').VarExpression;

exports.CompileScope = class {
    constructor(opts) {
        opts.compiler = opts.compiler || this;
        this._compiler      = opts.compiler;
        this._program       = opts.program;
        this._scope         = opts.scope;
        this._varExpression = new VarExpression(opts);
    }

    checkNotInGlobalScope(iterator) {
        if (this._scope.getGlobal()) {
            throw errors.createError(err.INVALID_STATEMENT_IN_SCOPE, iterator.current(), 'Invalid statement in scope.');
        }
    }
};
