/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $           = require('../../program/commands');
const errors      = require('../errors');
const err         = require('../errors').errors;
const t           = require('../tokenizer/tokenizer');
const CompileLoop = require('../compiler/CompileLoop').CompileLoop;

exports.CompileRepeat = class extends CompileLoop {
    compile(iterator) {
        this.checkNotInGlobalScope(iterator);
        let expression = iterator.skipWhiteSpaceWithoutNewline().nextUntilLexeme([t.LEXEME_NEWLINE, t.TOKEN_IDENTIFIER]);
        let id         = null;
        if (expression.firstToken.cls === t.TOKEN_IDENTIFIER) {
            id = expression.firstToken.lexeme;
        }
        this._compiler.pushLoop({loop: this, id: id});
        let startIndex = this._program.getLength();
        this.compileBlock(iterator, null);
        this._program.addCommand($.CMD_SET, $.T_NUM_G, $.REG_CODE, $.T_NUM_C, startIndex - 1);
        this._compiler.popLoop(this);
    }
};
