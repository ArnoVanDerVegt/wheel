/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $            = require('../../program/commands');
const errors       = require('../errors');
const err          = require('../errors').errors;
const t            = require('../tokenizer/tokenizer');
const CompileBlock = require('../compiler/CompileBlock').CompileBlock;
const Record       = require('../types/Record').Record;
const Objct        = require('../types/Objct').Objct;

exports.CompileWith = class extends CompileBlock {
    compile(iterator) {
        this.checkNotInGlobalScope(iterator);
        let scope          = this._scope;
        let program        = this._program;
        let withExpression = iterator.nextUntilLexeme([t.LEXEME_NEWLINE, t.LEXEME_AS]);
        let token          = withExpression.tokens[0];
        let identifier     = this._scope.findIdentifier(token.lexeme);
        let asObject       = null;
        if (identifier === null) {
            throw errors.createError(err.UNDEFINED_IDENTIFIER, token, 'Undefined identifier "' + token.lexeme + '".');
        }
        if (withExpression.lastToken.lexeme === t.LEXEME_AS) {
            asObject = iterator.skipWhiteSpace().peek();
            iterator.skipWhiteSpace().next();
        }
        program.nextBlockId(token, scope);
        this._varExpression.compileExpressionToRegister({
            identifier: identifier,
            expression: withExpression,
            reg:        $.REG_PTR
        });
        let lastRecordType = this._varExpression.getLastRecordType();
        if (!(lastRecordType instanceof Record)) {
            throw errors.createError(err.PARAM_TYPE_MISMATCH, token, 'Type mismatch, record type expected.');
        }
        if (asObject) {
            let castObject = scope.findIdentifier(asObject.lexeme);
            if (castObject === null) {
                throw errors.createError(err.UNDEFINED_IDENTIFIER, token, 'Undefined identifier "' + asObject.lexeme + '".');
            }
            if (!(castObject instanceof Objct)) {
                throw errors.createError(err.PARAM_TYPE_MISMATCH, token, 'Type mismatch, object type expected.');
            }
            program.addCommand($.CMD_SET, $.T_NUM_L, scope.pushWith(castObject), $.T_NUM_G, $.REG_PTR);
        } else {
            program.addCommand($.CMD_SET, $.T_NUM_L, scope.pushWith(lastRecordType), $.T_NUM_G, $.REG_PTR);
        }
        this.compileBlock(iterator, null);
        scope.popWith();
    }
};
