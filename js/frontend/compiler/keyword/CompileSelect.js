/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $                    = require('../../program/commands');
const errors               = require('../errors');
const err                  = require('../errors').errors;
const tokenUtils           = require('../tokenizer/tokenUtils');
const t                    = require('../tokenizer/tokenizer');
const CompileScope         = require('../compiler/CompileScope').CompileScope;
const CompileBlock         = require('../compiler/CompileBlock').CompileBlock;
const AssignmentExpression = require('../expression/AssignmentExpression');

exports.CompileSelect = class extends CompileBlock {
    compile(iterator) {
        this.checkNotInGlobalScope(iterator);
        let program       = this._program;
        let scope         = this._scope;
        let done          = false;
        let lastCaseIndex = null;
        let selectOffset  = scope.getStackOffset() + 1;
        let exitJumps     = [];
        let lastCase      = null;
        let doneCase      = false;
        let doneDefault   = false;
        let tokens;

        scope.incStackOffset();
        AssignmentExpression.compileToTempStackValue(this._compiler, program, scope, iterator.nextUntilLexeme([t.LEXEME_NEWLINE]));
        scope.incStackOffset();
        while (!done) {
            let lastToken = this.compileBlock(iterator, [t.LEXEME_CASE, t.LEXEME_DEFAULT]);
            switch (lastToken.lexeme) {
                case t.LEXEME_END:
                    done = true;
                    break;
                case t.LEXEME_DEFAULT:
                    exitJumps.push(program.addCommand($.CMD_SET, $.T_NUM_G, $.REG_CODE, 0, 0).getLength() - 1);
                    if (doneDefault) {
                        throw errors.createError(err.DEFAULT_ALREADY_DEFINED, tokens[0], '"default" Case is already defined.');
                    }
                    doneDefault = true;
                    lastCase    = t.LEXEME_DEFAULT;
                    let defaultExpression = iterator.nextUntilLexeme([t.LEXEME_COLON, t.LEXEME_NEWLINE]);
                    tokens = defaultExpression.tokens; // Tokens needed to show duplicate default error!
                    if ((lastCaseIndex !== null) && program.getCodeUsed()) { // Check if code is removed by optimizer...
                        program.setCommandParamValue2(lastCaseIndex, program.getLength() + 1);
                    }
                    program.addCommand(
                        $.CMD_SET, $.T_NUM_G, $.REG_CODE, $.T_NUM_C, 0
                    );
                    lastCaseIndex = program.getLength() - 1;
                    break;
                case t.LEXEME_CASE:
                    if (doneCase) {
                        exitJumps.push(program.addCommand($.CMD_SET, $.T_NUM_G, $.REG_CODE, 0, 0).getLength() - 1);
                    }
                    doneCase = true;
                    if (lastCase === t.LEXEME_DEFAULT) {
                        throw errors.createError(err.DEFAULT_LAST_EXPECTED, tokens[0], 'Last case should be "default".');
                    }
                    lastCase = t.LEXEME_CASE;
                    let caseExpression = iterator.nextUntilLexeme([t.LEXEME_COLON, t.LEXEME_NEWLINE]);
                    tokens = caseExpression.tokens;
                    if ((lastCaseIndex !== null) && program.getCodeUsed()) { // Check if code is removed by optimizer...
                        program.setCommandParamValue2(lastCaseIndex, program.getLength());
                    }
                    program.addCommand(
                        $.CMD_CMP,  $.T_NUM_L, selectOffset,     $.T_NUM_C, tokens[0].value,
                        $.CMD_JMPC, $.T_NUM_C, $.FLAG_NOT_EQUAL, $.T_NUM_C, 0
                    );
                    lastCaseIndex = program.getLength() - 1;
                    break;
            }
        }
        if (lastCaseIndex !== null) {
            let index = program.getLength();
            if (lastCase === t.LEXEME_DEFAULT) {
                index--;
            }
            if (program.getCodeUsed()) { // Check if code is removed by optimizer...
                program.setCommandParamValue2(lastCaseIndex, index);
            }
        }
        if (program.getCodeUsed()) {
            let index = program.getLength() - 1;
            exitJumps.forEach((exitJump) => {
                program.setCommandParamValue2(exitJump, index);
            });
        }
        scope
            .decStackOffset()
            .decStackOffset();
    }
};
