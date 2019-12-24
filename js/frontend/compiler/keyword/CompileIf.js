/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $                 = require('../../program/commands');
const tokenUtils        = require('../tokenizer/tokenUtils');
const t                 = require('../tokenizer/tokenizer');
const CompileScope      = require('../compiler/CompileScope').CompileScope;
const CompileBlock      = require('../compiler/CompileBlock').CompileBlock;
const BooleanExpression = require('../expression/BooleanExpression').BooleanExpression;

exports.CompileIf = class extends CompileBlock {
    compileCondition(iterator) {
        let program             = this._program;
        let conditionExpression = iterator.nextUntilLexeme([t.LEXEME_NEWLINE]);
        let simple              = new BooleanExpression({
                varExpression: this._varExpression,
                compiler:      this._compiler,
                program:       program,
                scope:         this._scope
            })
                .compile(conditionExpression)
                .compile();
        if (simple) {
            let lastCommand = program.getLastCommand();
            if (lastCommand) {
                simple = (lastCommand.getCmd() === $.CMD_SETF);
            } else {
                simple = false;
            }
            if (simple) {
                // It's a simple condition with one compare statement,
                // We can use the flag of the last compare...
                let flag = lastCommand.getParam2().getValue();
                switch (flag) {
                    case $.FLAG_EQUAL:          flag = $.FLAG_NOT_EQUAL;     break;
                    case $.FLAG_NOT_EQUAL:      flag = $.FLAG_EQUAL;         break;
                    case $.FLAG_LESS:           flag = $.FLAG_GREATER_EQUAL; break;
                    case $.FLAG_LESS_EQUAL:     flag = $.FLAG_GREATER;       break;
                    case $.FLAG_GREATER:        flag = $.FLAG_LESS_EQUAL;    break;
                    case $.FLAG_GREATER_EQUAL:  flag = $.FLAG_LESS;          break;
                }
                program.removeLastCommand();
                program.addCommand($.CMD_JMPC, $.T_NUM_C, flag, $.T_NUM_C, 0);
            }
        }
        if (!simple) {
            // It's a condition with AND and OR operators...
            program.addCommand(
                $.CMD_CMP,  $.T_NUM_L, this._scope.getStackOffset(), $.T_NUM_C, 0,
                $.CMD_JMPC, $.T_NUM_C, $.FLAG_EQUAL,                 $.T_NUM_C, 0
            );
        }
    }

    compile(iterator) {
        let program = this._program;
        this.checkNotInGlobalScope(iterator);
        this.compileCondition(iterator);
        let jmpIndex  = program.getLength() - 1;
        let lastToken = this.compileBlock(iterator, [t.LEXEME_ELSE, t.LEXEME_ELSEIF]);
        let done      = false;
        let elseIndex = [];
        while (!done) {
            if (lastToken.is(t.LEXEME_ELSEIF)) {
                elseIndex.push(program.getLength());
                if (program.getCodeUsed()) {
                    program
                        .addCommand($.CMD_SET, $.T_NUM_G, $.REG_CODE, $.T_NUM_C, 0)
                        .setCommandParamValue2(jmpIndex, program.getLength());
                }
                this.compileCondition(iterator);
                jmpIndex  = program.getLength() - 1;
                lastToken = this.compileBlock(iterator, [t.LEXEME_ELSE, t.LEXEME_ELSEIF]);
            } else if (lastToken.is(t.LEXEME_ELSE)) {
                elseIndex.push(program.getLength());
                if (program.getCodeUsed()) {
                    program
                        .addCommand($.CMD_SET, $.T_NUM_G, $.REG_CODE, $.T_NUM_C, 0)
                        .setCommandParamValue2(jmpIndex, program.getLength());
                }
                this.compileBlock(iterator, null);
                done = true;
            } else if (program.getCodeUsed()) {
                done = true;
                program.setCommandParamValue2(jmpIndex, program.getLength());
            }
        }
        if (program.getCodeUsed()) {
            elseIndex.forEach(function(index) {
                program.setCommandParamValue2(index, program.getLength() - 1);
            });
        }
    }
};
