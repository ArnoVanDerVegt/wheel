/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $            = require('../../program/commands');
const errors       = require('../errors');
const err          = require('../errors').errors;
const t            = require('../tokenizer/tokenizer');
const CompileScope = require('../compiler/CompileScope').CompileScope;

exports.CompileModule = class extends CompileScope {
    compile(iterator) {
        this.checkNotInGlobalScope(iterator);
        let token  = iterator.skipWhiteSpace().next();
        let module = token.value;
        token = iterator.skipWhiteSpace().next();
        token = iterator.skipWhiteSpace().next();
        let moduleProc = token.value;
        this._compiler.getUseInfo().setUseModule(module, moduleProc);
        this._program.addCommand($.CMD_MOD, $.T_NUM_C, module, $.T_NUM_C, moduleProc);
    }
};
