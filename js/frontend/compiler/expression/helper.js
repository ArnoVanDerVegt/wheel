/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $      = require('../../program/commands');
const errors = require('../errors');
const err    = require('../errors').errors;
const t      = require('../tokenizer/tokenizer');
const Record = require('../types/Record').Record;
const Objct  = require('../types/Objct').Objct;
const Proc   = require('../types/Proc').Proc;

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

exports.saveSelfPointerToLocal = (program, selfPointerStackOffset, reg) => {
    // This command may not be optimized away!!!
    program
        .nextBlockId()
        .addCommand($.CMD_SET, $.T_NUM_L, selfPointerStackOffset, $.T_NUM_G, reg)
        .nextBlockId();
};

exports.getIdentifierSize = (type) => {
    return ([t.LEXEME_NUMBER, t.LEXEME_STRING, t.LEXEME_PROC].indexOf(type) !== -1) ? 1 : type.getTotalSize();
};

exports.getTypeFromIdentifier = (identifier) => {
    if ([t.LEXEME_NUMBER, t.LEXEME_PROC].indexOf(identifier) !== -1) {
        return identifier;
    }
    if (identifier.getType) {
        identifier = identifier.getType().type;
    }
    if (identifier instanceof Proc) {
        identifier = t.LEXEME_NUMBER;
    }
    if (identifier.getName) {
        identifier = identifier.getName();
    }
    return identifier;
};

exports.getAssignmentTokenFromCmd = (token) => {
    switch (token.lexeme) {
        case t.LEXEME_ASSIGN_ADD: return $.CMD_ADD;
        case t.LEXEME_ASSIGN_SUB: return $.CMD_SUB;
        case t.LEXEME_ASSIGN_MUL: return $.CMD_MUL;
        case t.LEXEME_ASSIGN_DIV: return $.CMD_DIV;
    }
    return $.CMD_SET;
};

/**
 * Check if the given types share the same parent...
**/
exports.getObjectsShareParent = (type1, type2) => {
    const checkScopeWithParentScope = (type1, type2) => {
            // Check if it's an extended object...
            let parentScope = type2;
            while (parentScope) {
                // Check the name, the instance can be cloned for immutability...
                if (parentScope.getName() === type1.getName()) {
                    return true;
                }
                parentScope = parentScope.getParentScope();
            }
            return false;
        };
    return checkScopeWithParentScope(type1, type2) || checkScopeWithParentScope(type2, type1);
};

exports.getTypesEqual = (vrOrType1, vrOrType2) => {
    let type1 = exports.getTypeFromIdentifier(vrOrType1);
    let type2 = exports.getTypeFromIdentifier(vrOrType2);
    if (type1 === type2) {
        return true;
    }
    if ((vrOrType1.getType && (vrOrType1.getType().type instanceof Objct)) &&
        (vrOrType2.getType && (vrOrType2.getType().type instanceof Objct))) {
        return exports.getObjectsShareParent(vrOrType1.getType().type, vrOrType2.getType().type);
    }
    return false;
};

exports.findIdentifier = (scope, token) => {
    let identifier = scope.findIdentifier(token.lexeme);
    if (!identifier) {
        throw errors.createError(err.UNDEFINED_IDENTIFIER, token, 'Undefined identifier "' + token.lexeme + '".');
    }
    return identifier;
};
