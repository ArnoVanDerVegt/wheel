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
    compileFirstPass(iterator) {
        this.checkNotInGlobalScope(iterator);
        let tokenHintIndex = iterator.current().index;
        let tokenHint      = {defaultCase: false, cases: []};
        let done           = false;
        let exitJumps      = [];
        let lastCase       = null;
        let doneCase       = false;
        let doneDefault    = false;
        iterator.nextUntilLexeme([t.LEXEME_NEWLINE]);
        while (!done) {
            let lastToken = this.compileBlock(iterator, [t.LEXEME_CASE, t.LEXEME_DEFAULT]);
            switch (lastToken.lexeme) {
                case t.LEXEME_END:
                    done = true;
                    break;
                case t.LEXEME_DEFAULT:
                    if (doneDefault) {
                        throw errors.createError(err.DEFAULT_ALREADY_DEFINED, tokens[0], '"default" Case is already defined.');
                    }
                    tokenHint.defaultCase = true;
                    doneDefault           = true;
                    iterator.nextUntilLexeme([t.LEXEME_COLON, t.LEXEME_NEWLINE]);
                    break;
                case t.LEXEME_CASE:
                    doneCase = true;
                    if (lastCase === t.LEXEME_DEFAULT) {
                        throw errors.createError(err.DEFAULT_LAST_EXPECTED, tokens[0], 'Last case should be "default".');
                    }
                    let caseExpression = iterator.nextUntilLexeme([t.LEXEME_COLON, t.LEXEME_NEWLINE]);
                    tokenHint.cases.push(caseExpression.tokens[0].value);
                    break;
            }
        }
        tokenHint.minCaseValue = Math.min.apply(Math, tokenHint.cases);
        tokenHint.maxCaseValue = Math.max.apply(Math, tokenHint.cases);
        this._compiler.setTokenHint(tokenHintIndex, tokenHint);
    }

    compileWithCompare(iterator) {
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

    compileWithJumpTable(iterator, tokenHint) {
        this.checkNotInGlobalScope(iterator);
        let minCaseValue = tokenHint.minCaseValue;
        let maxCaseValue = tokenHint.maxCaseValue;
        let program      = this._program;
        let scope        = this._scope;
        let done         = false;
        let selectOffset = scope.getStackOffset() + 1;
        let exitJumps    = [];
        let lastCase     = null;
        let doneCase     = false;
        let doneDefault  = false;
        let tokens;
        let index;
        scope.incStackOffset();
        AssignmentExpression.compileToTempStackValue(this._compiler, program, scope, iterator.nextUntilLexeme([t.LEXEME_NEWLINE]));
        scope.incStackOffset();
        let outOfRangeJumpIndex  = program.getLength();
        let defaultCaseJumpIndex = -1;
        program
            .nextBlockId()
            .addCommand(
                $.CMD_CMP,  $.T_NUM_L, selectOffset,   $.T_NUM_C, minCaseValue,
                $.CMD_JMPC, $.T_NUM_C, $.FLAG_LESS,    $.T_NUM_C, 10000,
                $.CMD_CMP,  $.T_NUM_L, selectOffset,   $.T_NUM_C, maxCaseValue,
                $.CMD_JMPC, $.T_NUM_C, $.FLAG_GREATER, $.T_NUM_C, 10000,
                $.CMD_ADD,  $.T_NUM_L, selectOffset,   $.T_NUM_C, program.getLength() + 5 - minCaseValue,
                // Set the address to the offset in the jump table...
                $.CMD_SET,  $.T_NUM_G, $.REG_CODE,     $.T_NUM_L, selectOffset
            )
            .nextBlockId();
        // Create the jump table...
        for (let i = minCaseValue; i <= maxCaseValue; i++) {
            program.addCommand($.CMD_SET, $.T_NUM_G, $.REG_CODE, 0, -2);
        }
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
                    defaultCaseJumpIndex = program.getLength();
                    program
                        .setCommandParamValue2(outOfRangeJumpIndex + 1, defaultCaseJumpIndex)
                        .setCommandParamValue2(outOfRangeJumpIndex + 3, defaultCaseJumpIndex);
                    outOfRangeJumpIndex = -1;
                    doneDefault         = true;
                    lastCase            = t.LEXEME_DEFAULT;
                    let defaultExpression = iterator.nextUntilLexeme([t.LEXEME_COLON, t.LEXEME_NEWLINE]);
                    tokens = defaultExpression.tokens; // Tokens needed to show duplicate default error!
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
                    program.setCommandParamValue2(outOfRangeJumpIndex + 6 + tokens[0].value - minCaseValue, program.getLength() - 1);
                    break;
            }
        }
        index = program.getLength();
        if (lastCase === t.LEXEME_DEFAULT) {
            index--;
        }
        if (outOfRangeJumpIndex !== -1) {
            program
                .setCommandParamValue2(outOfRangeJumpIndex + 1, index)
                .setCommandParamValue2(outOfRangeJumpIndex + 3, index);
        }
        index = program.getLength() - 1;
        if (program.getCodeUsed()) {
            exitJumps.forEach((exitJump) => {
                program.setCommandParamValue2(exitJump, index);
            });
        }
        if (defaultCaseJumpIndex !== -1) {
            index = defaultCaseJumpIndex - 1;
        }
        let commands = program.getCommands();
        for (let i = minCaseValue; i <= maxCaseValue; i++) {
            let command = commands[outOfRangeJumpIndex + 8 + i];
            if (command.getParam2().getValue() === -2) {
                command.getParam2().setValue(index);
            }
        }
        scope
            .decStackOffset()
            .decStackOffset();
    }

    compile(iterator) {
        let compiler = this._compiler;
        if (compiler.getPass() === 0) {
            this.compileFirstPass(iterator);
        } else {
            let tokenHintIndex = iterator.current().index;
            let tokenHint      = this._compiler.getTokenHint(tokenHintIndex);
            let useJumpTable   = true;
            for (let i = 0; i < tokenHint.cases.length; i++) {
                if (tokenHint.cases[i] !== Math.floor(tokenHint.cases[i])) {
                    // Don't use jump table for floating point values...
                    useJumpTable = false;
                }
            }
            if (useJumpTable) {
                // Only use jump table for more than 2 cases and if at least a third of the values are covered in the table...
                useJumpTable = (tokenHint.cases.length > 2) && ((tokenHint.maxCaseValue - tokenHint.minCaseValue) / tokenHint.cases.length) > 0.33;
            }
            if (useJumpTable) {
                this.compileWithJumpTable(iterator, tokenHint);
            } else {
                this.compileWithCompare(iterator);
            }
        }
    }
};
