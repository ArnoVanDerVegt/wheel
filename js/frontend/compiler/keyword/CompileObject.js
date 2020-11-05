/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const errors        = require('../errors');
const err           = require('../errors').errors;
const t             = require('../tokenizer/tokenizer');
const Objct         = require('../types/Objct').Objct;
const Var           = require('../types/Var');
const CompileRecord = require('./CompileRecord').CompileRecord;

exports.CompileObject = class extends CompileRecord {
    getDataType() {
        return new Objct(null, this.getNamespacedRecordName(this._token.lexeme), false, this._compiler.getNamespace()).setToken(this._token);
    }
};
