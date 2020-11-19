/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $              = require('../../program/commands');
const t              = require('../tokenizer/tokenizer');
const CompileScope   = require('../compiler/CompileScope').CompileScope;
const MathExpression = require('../expression/MathExpression').MathExpression;

exports.CompileRet = class extends CompileScope {
    compile(iterator) {
        this.checkNotInGlobalScope(iterator);
        let retExpression       = iterator.nextUntilLexeme([t.LEXEME_NEWLINE]);
        let scope               = this._scope;
        let program             = this._program.nextBlockId(retExpression.tokens[0], scope);

        if (retExpression.tokens.length) {
            let mathExpressionNode  = new MathExpression({
                    varExpression: this._varExpression,
                    compiler:      this._compiler,
                    program:       program,
                    scope:         scope
                }).compile(retExpression, this._compiler.getPass());
            if (mathExpressionNode.getValue()) {
                let token = mathExpressionNode.getValue()[0];
                if (token.cls === t.TOKEN_NUMBER) {
                   program.addCommand($.CMD_RET, $.T_NUM_C, token.value, 0, 0);
                } else {
                    this._varExpression.compileExpressionToRegister({
                        identifier:             scope.findIdentifier(retExpression.tokens[0].lexeme),
                        expression:             {tokens: mathExpressionNode.getValue()},
                        reg:                    $.REG_PTR,
                        forWriting:             false,
                        selfPointerStackOffset: false
                    });
                    program.addCommand($.CMD_RET, $.T_NUM_P, 0, 0, 0);
                }
            } else {
                mathExpressionNode.compile(t.LEXEME_NUMBER);
                program.addCommand($.CMD_RET, $.T_NUM_L, scope.getStackOffset(), 0, 0);
            }
        } else {
            program.addCommand($.CMD_RET, $.T_NUM_C, 0, 0, 0);
        }
    }
};
