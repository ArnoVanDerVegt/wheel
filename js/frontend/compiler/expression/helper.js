/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $      = require('../../program/commands');
const errors = require('../errors');
const err    = require('../errors').errors;
const t      = require('../tokenizer/tokenizer');
const Record = require('../types/Record').Record;

exports.assertRecord = (opts) => {
    if (opts.identifierType.type instanceof Record) {
        return;
    }
    throw errors.createError(err.RECORD_TYPE_EXPECTED, opts.token, 'Record type expected.');
};

exports.assertArray = (identifier, token) => {
    if (identifier.getArraySize() === false) {
        throw errors.createError(err.ARRAY_TYPE_EXPECTED, token, 'Array type expected.');
    }
};

exports.assertIdentifier = (identifier, expression) => {
    if (identifier !== null) {
        return;
    }
    let token = expression.tokens[0];
    if (token.cls === t.TOKEN_IDENTIFIER) {
        throw errors.createError(err.UNDEFINED_IDENTIFIER, token, 'Undefined identifier "' + token.lexeme + '".');
    } else {
        throw errors.createError(err.SYNTAX_ERROR, token, 'Syntax error.');
    }
};

exports.addToReg = (program, reg, type2, value2) => {
    program.addCommand($.CMD_ADD, $.T_NUM_G, reg, type2, value2);
};

exports.setReg = (program, reg, type2, value2) => {
    program.addCommand($.CMD_SET, $.T_NUM_G, reg, type2, value2);
    return this;
};

exports.setStackOffsetToPtr = (program, scope) => {
    program.addCommand(
        $.CMD_SET, $.T_NUM_G, $.REG_PTR, $.T_NUM_G, $.REG_STACK,
        $.CMD_ADD, $.T_NUM_G, $.REG_PTR, $.T_NUM_C, scope.getStackOffset()
    );
    return this;
};

exports.assignToPtr = (program, cmd, type2, value2) => {
    program.addCommand(cmd, $.T_NUM_P, 0, type2, value2);
};

exports.savePtrValueInLocalVar = (program, scope) => {
    program.addCommand($.CMD_SET, $.T_NUM_L, scope.getStackOffset(), $.T_NUM_P, 0);
};

exports.savePtrPointerValueInLocalVar = (program, scope) => {
    program.addCommand(
        $.CMD_SET, $.T_NUM_G, $.REG_PTR,              $.T_NUM_P, 0,
        $.CMD_SET, $.T_NUM_L, scope.getStackOffset(), $.T_NUM_P, 0
    );
};

exports.savePtrInLocalVar = (program, scope) => {
    program.addCommand($.CMD_SET, $.T_NUM_L, scope.getStackOffset(), $.T_NUM_G, $.REG_PTR);
};

exports.saveStringInLocalVar = (program, scope, s) => {
    program.addCommand($.CMD_SET, $.T_NUM_L, scope.getStackOffset(), $.T_NUM_C, program.addConstantString(s));
};
