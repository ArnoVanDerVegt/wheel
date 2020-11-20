/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $                    = require('../../program/commands');
const errors               = require('../errors');
const err                  = require('../errors').errors;
const t                    = require('../tokenizer/tokenizer');
const CompileLoop          = require('../compiler/CompileLoop').CompileLoop;
const MathExpression       = require('../expression/MathExpression').MathExpression;
const AssignmentExpression = require('../expression/AssignmentExpression');

exports.CompileFor = class extends CompileLoop {
    compileExpressionTokensToStack(tokens, releaseStack) {
        let scope   = this._scope;
        let program = this._program;
        if (releaseStack) {
            scope.incStackOffset();
        }
        let mathExpressionNode = new MathExpression({
                varExpression: this._varExpression,
                compiler:      this._compiler,
                program:       program,
                scope:         scope
            }).compile({tokens: tokens}, this._compiler.getPass());
        if (mathExpressionNode.getValue()) {
            if (tokens[0].cls === t.TOKEN_NUMBER) {
                program.addCommand($.CMD_SET, $.T_NUM_L, scope.getStackOffset(), $.T_NUM_C, tokens[0].value);
            } else {
                this._varExpression.compileExpressionToRegister({
                    identifier: scope.findIdentifier(tokens[0].lexeme),
                    expression: {tokens: tokens},
                    reg:        $.REG_PTR
                });
                program.addCommand($.CMD_SET, $.T_NUM_L, scope.getStackOffset(), $.T_NUM_P, 0);
            }
        } else {
            mathExpressionNode.compile(t.LEXEME_NUMBER);
        }
        if (releaseStack) {
            scope.decStackOffset();
        }
    }

    compileIndexAssignment(iterator) {
        let fromExpression = iterator.nextUntilTokenCls([t.TOKEN_KEYWORD]);
        let program        = this._program.nextBlockId(fromExpression.tokens[0], this._scope);
        this._direction = [t.LEXEME_DOWNTO, t.LEXEME_TO].indexOf(fromExpression.lastToken.lexeme);
        // Compile the counter assignment...
        new AssignmentExpression.AssignmentExpression({
            compiler: this._compiler,
            program:  program,
            scope:    this._scope
        }).compile(this._indexExpression, fromExpression);
    }

    compileSaveIndexToStack(iterator) {
        let scope   = this._scope;
        let program = this._program;
        program.nextBlockId(this._indexTokens[0], scope);
        this._varExpression.compileExpressionToRegister({
            identifier: this._indexIdentifier,
            expression: this._indexExpression,
            reg:        $.REG_PTR
        });
        program.addCommand($.CMD_SET, $.T_NUM_L, scope.getStackOffset(), $.T_NUM_P, 0);
    }

    compileCheckExceedsMax(iterator) {
        let scope   = this._scope;
        let program = this._program;
        this.compileExpressionTokensToStack(this._toTokens, true);
        program.addCommand($.CMD_CMP, $.T_NUM_L, scope.getStackOffset(), $.T_NUM_L, scope.getStackOffset() + 1);
        this._skipIndex = this._program.getLength();
        let compareFlag = this._direction ? $.FLAG_GREATER : $.FLAG_LESS;
        program.addCommand($.CMD_JMPC, $.T_NUM_C, compareFlag, $.T_NUM_C, 0);
    }

    compileCounterUpdate(iterator) {
        let scope   = this._scope;
        let program = this._program;
        program.nextBlockId(this._indexTokens[0], scope);
        this._varExpression.compileExpressionToRegister({
            identifier: this._indexIdentifier,
            expression: {tokens: this._indexTokens},
            reg:        $.REG_PTR
        });
        let counterCmd = this._direction ? $.CMD_ADD : $.CMD_SUB;
        this._compareFlag = this._direction ? $.FLAG_LESS_EQUAL : $.FLAG_GREATER_EQUAL;
        if (this._step) {
            program.addCommand(counterCmd, $.T_NUM_P, 0, $.T_NUM_L, scope.getStackOffset() - 1);
        } else {
            program.addCommand(counterCmd, $.T_NUM_P, 0, $.T_NUM_C, 1);
        }
    }

    compileJumpToStartIfInRange() {
        let scope   = this._scope;
        let program = this._program;
        program.nextBlockId(this._indexTokens[0], scope);
        this._varExpression.compileExpressionToRegister({
            identifier: this._indexIdentifier,
            expression: {tokens: this._indexTokens},
            reg:        $.REG_PTR
        });
        program.addCommand($.CMD_SET, $.T_NUM_L, scope.getStackOffset(), $.T_NUM_P, 0);
        // Check if the max or min value is reached...
        this.compileExpressionTokensToStack(this._toTokens, true);
        program.addCommand(
            $.CMD_CMP,  $.T_NUM_L, scope.getStackOffset(), $.T_NUM_L, scope.getStackOffset() + 1,
            $.CMD_JMPC, $.T_NUM_C, this._compareFlag,      $.T_NUM_C, this._startIndex - 1
        );
    }

    compile(iterator) {
        let program = this._program;
        let scope   = this._scope;
        this.checkNotInGlobalScope(iterator);
        this._compiler.pushLoop({loop: this, id: null});
        this._indexExpression = iterator.nextUntilTokenCls([t.TOKEN_ASSIGNMENT_OPERATOR]);
        this._indexTokens     = this._indexExpression.tokens;
        this._indexIdentifier = scope.findIdentifier(this._indexTokens[0].lexeme);
        this.compileIndexAssignment(iterator);
        let toExpression = iterator.nextUntilLexeme([t.LEXEME_STEP, t.LEXEME_NEWLINE]);
        this._toTokens = toExpression.tokens;
        this._step     = (toExpression.lastToken.lexeme === t.LEXEME_STEP);
        if (this._step) {
            let stepTokens = iterator.nextUntilLexeme([t.LEXEME_NEWLINE]).tokens;
            this.compileExpressionTokensToStack(stepTokens, false);
            scope.incStackOffset();
        }
        this._toIdentifier = scope.findIdentifier(this._toTokens[0].lexeme);
        this.compileSaveIndexToStack(iterator);
        program.nextBlockId(this._toTokens[0], scope);
        // Check if the counter exceeds the maximum value, skip loop if out of range...
        this.compileCheckExceedsMax(iterator);
        // Compile the nested code...
        this._startIndex = program.getLength();
        this.compileBlock(iterator, null);
        // Increase or decrease the counter...
        this.compileCounterUpdate();
        // Compile the counter value to the pointer register again and store the value in the stack...
        this.compileJumpToStartIfInRange();
        if (program.getCodeUsed()) {
            program.setCommandParamValue2(this._skipIndex, program.getLength());
        }
        this._compiler.popLoop();
        if (this._step) {
            scope.decStackOffset();
        }
    }
};
