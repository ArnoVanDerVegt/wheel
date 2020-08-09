/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $                 = require('../../program/commands');
const errors            = require('../errors');
const err               = require('../errors').errors;
const t                 = require('../tokenizer/tokenizer');
const CompileLoop       = require('../compiler/CompileLoop').CompileLoop;
const BooleanExpression = require('../expression/BooleanExpression').BooleanExpression;

exports.CompileWhile = class extends CompileLoop {
    compile(iterator) {
        this.checkNotInGlobalScope(iterator);
        this._compiler.pushLoop({loop: this, id: null});
        let scope               = this._scope;
        let program             = this._program;
        let conditionExpression = iterator.nextUntilLexeme([t.LEXEME_NEWLINE]);
        let startIndex          = program.getLength() - 1;
        new BooleanExpression({
            varExpression: this._varExpression,
            compiler:      this._compiler,
            program:       program,
            scope:         scope
        })
            .compile(conditionExpression)
            .compile();
        program.addCommand(
            $.CMD_CMP,  $.T_NUM_L, scope.getStackOffset(), $.T_NUM_C, 0,
            $.CMD_JMPC, $.T_NUM_C, $.FLAG_EQUAL,           $.T_NUM_C, 0
        );
        let jmpIndex = program.getLength() - 1;
        this.compileBlock(iterator, null);
        program.addCommand($.CMD_SET, $.T_NUM_G, $.REG_CODE, $.T_NUM_C, startIndex);
        if (program.getCodeUsed()) {
            program.setCommandParamValue2(jmpIndex, program.getLength());
        }
    }
};
