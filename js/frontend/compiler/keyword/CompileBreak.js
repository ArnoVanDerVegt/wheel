/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const commands     = require('../../program/commands');
const t            = require('../tokenizer/tokenizer');
const errors       = require('../errors');
const err          = require('../errors').errors;
const CompileScope = require('../compiler/CompileScope').CompileScope;

exports.CompileBreak = class extends CompileScope {
    compile(iterator) {
        this.checkNotInGlobalScope(iterator);
        let p  = iterator.skipWhiteSpace().peek();
        let id = null;
        if (p.cls === t.TOKEN_IDENTIFIER) {
            let token = iterator.next();
            id = token.lexeme;
        }
        let loop = this._compiler.getLoop(id);
        if (loop === null) {
            throw errors.createError(err.BREAK_WITHOUT_LOOP, iterator.current(), 'Break without loop.');
        }
        loop.loop.addBreak();
    }
};
