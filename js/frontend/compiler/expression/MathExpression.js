/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $          = require('../../program/commands');
const errors     = require('../errors');
const err        = require('../errors').errors;
const t          = require('../tokenizer/tokenizer');
const tokenUtils = require('../tokenizer/tokenUtils');

class MathExpressionNode {
    constructor(opts) {
        this._scope         = opts.scope;
        this._varExpression = opts.varExpression;
        this._left          = ('left'          in opts) ? opts.left          : null;
        this._right         = ('right'         in opts) ? opts.right         : null;
        this._value         = ('value'         in opts) ? opts.value         : null;
        this._operator      = ('operator'      in opts) ? opts.operator      : null;
        this._operatorToken = ('operatorToken' in opts) ? opts.operatorToken : null;
        this._program       = ('program'       in opts) ? opts.program       : null;
    }

    getOperator() {
        return this._operator;
    }

    setOperator(operator) {
        this._operator = operator;
        return this;
    }

    getLeft() {
        return this._left;
    }

    setLeft(left) {
        this._left = left;
        return this;
    }

    getLeftValue() {
        let left = this._left;
        if (left && left.getValue()) {
            return left.getValue();
        }
        return null;
    }

    getLeftDeepValue() {
        let left = this._left;
        if (left) {
            if (left.getValue()) {
                return left.getValue();
            }
            return left.getLeftDeepValue();
        }
        return null;
    }

    getRight() {
        return this._right;
    }

    setRight(right) {
        this._right = right;
        return this;
    }

    getRightValue() {
        let right = this._right;
        if (right && right.getValue()) {
            return right.getValue();
        }
        return null;
    }

    getRightDeepValue() {
        let right = this._right;
        if (right) {
            if (right.getValue()) {
                return right.getValue();
            }
            return right.getRightDeepValue();
        }
        return null;
    }

    getValue() {
        return this._value;
    }

    setValue(value) {
        this._value = value;
        return this;
    }

    operatorTokenToCmd(operator) {
        switch (operator) {
            case t.LEXEME_ADD: return $.CMD_ADD;
            case t.LEXEME_SUB: return $.CMD_SUB;
            case t.LEXEME_MUL: return $.CMD_MUL;
            case t.LEXEME_DIV: return $.CMD_DIV;
        }
        return $.CMD_SET;
    }

    compile(expectedType) {
        let scope   = this._scope;
        let value   = this._value;
        let program = this._program;
        if (value) {
            program.nextBlockId(value[0], scope);
            if (value[0].cls === t.TOKEN_STRING) {
                this._program.addCommand($.CMD_SET, $.T_NUM_L, scope.getStackOffset(), $.T_NUM_C, program.addConstantString(value[0].lexeme));
            } else {
                let identifier = scope.findIdentifier(value[0].lexeme);
                if (identifier && identifier.getType && (identifier.getType().type !== expectedType)) {
                    const AssignmentExpression = require('./AssignmentExpression');
                    if (AssignmentExpression.checkType(identifier.getType().type, {tokens: value}).type !== t.LEXEME_NUMBER) {
                        throw errors.createError(err.TYPE_MISMATCH, value[0], 'Type mismatch.');
                    }
                }
                this._varExpression.compileExpressionToRegister({
                    identifier: identifier,
                    expression: {tokens: value},
                    reg:        $.REG_PTR
                });
                this._program.addCommand($.CMD_SET, $.T_NUM_L, scope.getStackOffset(), $.T_NUM_P, 0);
            }
        } else {
            this._right.compile(expectedType);
            scope.incStackOffset();
            this._left.compile(expectedType);
            let stackOffset = scope.getStackOffset();
            let operator    = this.operatorTokenToCmd(this._operator);
            if (expectedType === t.LEXEME_STRING) {
                if (this._operator === t.LEXEME_ADD) {
                    // A program.addCommand(
                    // B    $.CMD_ADDS, $.T_NUM_L, stackOffset,     $.T_NUM_L, stackOffset - 1,
                    // C    $.CMD_SETS, $.T_NUM_L, stackOffset - 1, $.T_NUM_L, stackOffset
                    // D );
                    program.addCommand(
                        $.CMD_ADDS, $.T_NUM_L, stackOffset,     $.T_NUM_L, stackOffset - 1,
                        $.CMD_SET,  $.T_NUM_L, stackOffset - 1, $.T_NUM_L, stackOffset
                    );
                } else {
                    throw errors.createError(err.INVALID_OPERATION, this._right.getValue()[0], 'Invalid operation.');
                }
            } else if ((this._operator !== t.LEXEME_SUB) && (this._operator !== t.LEXEME_DIV)) {
                program
                    .addCommand(operator, $.T_NUM_L, stackOffset - 1, $.T_NUM_L, stackOffset)
                    .addInfoToLastCommand({token: this._operatorToken, scope: this._scope});
            } else {
                program
                    .addCommand(operator, $.T_NUM_L, stackOffset, $.T_NUM_L, stackOffset - 1)
                    .addInfoToLastCommand({token: this._operatorToken, scope: this._scope});
                program.addCommand($.CMD_SET, $.T_NUM_L, stackOffset - 1, $.T_NUM_L, stackOffset);
            }
            scope.decStackOffset();
        }
    }
}

exports.MathExpression = class {
    constructor(opts) {
        this._varExpression = opts.varExpression;
        this._compiler      = opts.compiler;
        this._program       = opts.program;
        this._scope         = opts.scope;
    }

    compileToTree(tokens, startIndex, endIndex) {
        let maxPrecedence       = -1;
        let operatorIndex       = -1;
        let operatorToken;
        let removedParenthesis  = tokenUtils.removeParenthesis(tokens, startIndex, endIndex);
        startIndex = removedParenthesis.startIndex;
        endIndex   = removedParenthesis.endIndex;
        for (let index = startIndex; index < endIndex; index++) {
            let token = tokens[index];
            switch (token.cls) {
                case t.TOKEN_PARENTHESIS_OPEN:
                    let indexAndExpression = tokenUtils.getIndexAfterTokenPairs(
                            {tokens: tokens}, index + 1,
                            [t.TOKEN_PARENTHESIS_OPEN, t.TOKEN_PARENTHESIS_CLOSE]
                        );
                    index = indexAndExpression.index - 1;
                    break;
                case t.TOKEN_NUMERIC_OPERATOR:
                    if (token.precedence >= maxPrecedence) {
                        operatorIndex = index;
                        operatorToken = token;
                        maxPrecedence = token.precedence;
                    }
                    break;
            }
        }
        if (operatorIndex === -1) {
            return new MathExpressionNode({
                scope:         this._scope,
                varExpression: this._varExpression,
                value:         tokenUtils.getTokensFromRange(tokens, startIndex, endIndex),
                program:       this._program
            });
        }
        return new MathExpressionNode({
            scope:         this._scope,
            varExpression: this._varExpression,
            left:          this.compileToTree(tokens, startIndex, operatorIndex),
            right:         this.compileToTree(tokens, operatorIndex + 1, endIndex),
            operator:      tokens[operatorIndex].lexeme,
            operatorToken: operatorToken,
            program:       this._program
        });
    }

    getNumberValue(node) {
        if (!node) {
            return null;
        }
        if (node[0] && (node[0].cls === t.TOKEN_NUMBER)) {
            return node[0].value;
        }
        return null;
    }

    optimizeConstants(node) {
        if (node.getLeft()) {
            this.optimizeConstants(node.getLeft());
        }
        if (node.getRight()) {
            this.optimizeConstants(node.getRight());
        }
        let left  = this.getNumberValue(node.getLeftValue());
        let right = this.getNumberValue(node.getRightValue());
        if ((left !== null) && (right !== null)) {
            let value = node.getLeft().getValue();
            switch (node.getOperator()) {
                case t.LEXEME_ADD: value[0].value = left + right; break;
                case t.LEXEME_SUB: value[0].value = left - right; break;
                case t.LEXEME_MUL: value[0].value = left * right; break;
                case t.LEXEME_DIV: value[0].value = left / right; break;
            }
            value[0].cls = t.TOKEN_NUMBER;
            node
                .setValue(value)
                .setOperator(null)
                .setLeft(null)
                .setRight(null);
        }
    }

    compile(expression, pass) {
        let node = this.compileToTree(expression.tokens, 0, expression.tokens.length);
        if ((pass === 1) && this._program.getOptimize()) {
           this.optimizeConstants(node);
        }
        return node;
    }
};
