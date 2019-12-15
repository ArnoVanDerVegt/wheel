/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $                    = require('../../program/commands');
const t                    = require('../tokenizer/tokenizer');
const tokenUtils           = require('../tokenizer/tokenUtils');
const AssignmentExpression = require('./AssignmentExpression');

class BooleanExpressionNode {
    constructor(opts) {
        this._scope         = opts.scope;
        this._varExpression = opts.varExpression;
        this._left          = ('left'     in opts) ? opts.left     : null;
        this._right         = ('right'    in opts) ? opts.right    : null;
        this._value         = ('value'    in opts) ? opts.value    : null;
        this._not           = ('not'      in opts) ? opts.not      : null;
        this._operator      = ('operator' in opts) ? opts.operator : null;
        this._compiler      = null;
        this._program       = null;
    }

    setProgram(program) {
        this._program = program;
        return this;
    }

    setCompiler(compiler) {
        this._compiler = compiler;
        return this;
    }

    getValue() {
        return this._value;
    }

    compileCompare() {
        let value = this._value;
        let found = false;
        let operator;
        for (let index = 0; index < value.length; index++) {
            operator = [
                t.LEXEME_EQUAL,
                t.LEXEME_NOT_EQUAL,
                t.LEXEME_LESS,
                t.LEXEME_LESS_EQUAL,
                t.LEXEME_GREATER,
                t.LEXEME_GREATER_EQUAL
            ].indexOf(value[index].lexeme);
            if (operator !== -1) {
                if (this._not) {
                    switch (operator) {
                        case 0: operator = 1; break; // Equal         -> Not equal
                        case 1: operator = 0; break; // Not equal     -> Equal
                        case 2: operator = 5; break; // Less          -> Greater equal
                        case 3: operator = 4; break; // Less equal    -> Greater
                        case 4: operator = 3; break; // Greater       -> Less equal
                        case 5: operator = 2; break; // Greater equal -> Less
                    }
                }
                found = index;
                break;
            }
        }
        let scope   = this._scope;
        let program = this._program.nextBlockId(value[0], scope);
        if (found) {
            let left        = tokenUtils.getTokensFromRange(value, 0, found);
            let right       = tokenUtils.getTokensFromRange(value, found + 1, value.length);
            let stackOffset = scope.getStackOffset();
            AssignmentExpression.compileToTempStackValue(this._compiler, program, scope, {tokens: left});
            program.nextBlockId(right[0], scope);
            scope.incStackOffset();
            AssignmentExpression.compileToTempStackValue(this._compiler, program, scope, {tokens: right});
            scope.decStackOffset();
            program.addCommand(
                $.CMD_CMP,  $.T_NUM_L, stackOffset, $.T_NUM_L, stackOffset + 1,
                $.CMD_SETF, $.T_NUM_L, stackOffset, $.T_NUM_C, 1 << operator
            );
        } else {
            this._varExpression.compileExpressionToRegister(scope.findIdentifier(value[0].lexeme), {tokens: value}, $.REG_PTR);
            program.addCommand(
                $.CMD_SET,  $.T_NUM_G, $.REG_SRC,              $.T_NUM_P, 0,
                $.CMD_CMP,  $.T_NUM_G, $.REG_SRC,              $.T_NUM_C, 0,
                $.CMD_SETF, $.T_NUM_L, scope.getStackOffset(), $.T_NUM_C, this._not ? $.FLAG_EQUAL : $.FLAG_NOT_EQUAL
            );
        }
    }

    compile() {
        let indent = '';
        let depth  = 0;
        let scope  = this._scope;
        if (this._value) {
            this.compileCompare();
        } else {
            this._left.compile();
            scope.incStackOffset();
            this._right.compile();
            scope.decStackOffset();
            let cmd = (this._operator === 'and') ? $.CMD_AND : $.CMD_OR;
            this._program.addCommand(cmd, $.T_NUM_L, scope.getStackOffset(), $.T_NUM_L, scope.getStackOffset() + 1);
        }
        return !!this._value || (!!this._left.getValue() && !!this._right.getValue());
    }
}

exports.BooleanExpression = class {
    constructor(opts) {
        this._varExpression = opts.varExpression;
        this._compiler      = opts.compiler;
        this._program       = opts.program;
        this._scope         = opts.scope;
    }

    compileToTree(tokens, startIndex, endIndex) {
        let operator            = null;
        let operatorIndex       = -1;
        let not                 = false;
        let removedParenthesis  = tokenUtils.removeParenthesis(tokens, startIndex, endIndex);
        startIndex = removedParenthesis.startIndex;
        endIndex   = removedParenthesis.endIndex;
        let token = tokens[startIndex];
        if ((token.cls === t.TOKEN_KEYWORD) && (token.lexeme === t.LEXEME_NOT)) {
            not = true;
        }
        for (let index = startIndex; index < endIndex; index++) {
            token = tokens[index];
            switch (token.cls) {
                case t.TOKEN_PARENTHESIS_OPEN:
                    let indexAndExpression = tokenUtils.getIndexAfterTokenPairs(
                            {tokens: tokens}, index + 1,
                            [t.TOKEN_PARENTHESIS_OPEN, t.TOKEN_PARENTHESIS_CLOSE]
                        );
                    index = indexAndExpression.index - 1;
                    break;
                case t.TOKEN_BOOLEAN_OPERATOR:
                    if ((operator === null) || ((operator === t.LEXEME_AND) && token.is(t.LEXEME_OR))) {
                        operator      = token.lexeme;
                        operatorIndex = index;
                    }
                    break;
            }
        }
        if (not && (operator === null)) {
            startIndex++;
        }
        if (operatorIndex === -1) {
            return new BooleanExpressionNode({
                    scope:         this._scope,
                    varExpression: this._varExpression,
                    value:         tokenUtils.getTokensFromRange(tokens, startIndex, endIndex, operator),
                    not:           not
                })
                .setCompiler(this._compiler)
                .setProgram(this._program);
        }
        return new BooleanExpressionNode({
                scope:         this._scope,
                varExpression: this._varExpression,
                left:          this.compileToTree(tokens, startIndex, operatorIndex),
                right:         this.compileToTree(tokens, operatorIndex + 1, endIndex, operator),
                not:           not,
                operator:      tokens[operatorIndex].lexeme
            })
            .setCompiler(this._compiler)
            .setProgram(this._program);
    }

    compile(expression) {
        return this.compileToTree(expression.tokens, 0, expression.tokens.length);
    }
};
