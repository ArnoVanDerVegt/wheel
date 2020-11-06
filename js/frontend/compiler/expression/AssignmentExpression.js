/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $              = require('../../program/commands');
const errors         = require('../errors');
const err            = require('../errors').errors;
const t              = require('../tokenizer/tokenizer');
const Iterator       = require('../tokenizer/TokenIterator').Iterator;
const tokenUtils     = require('../tokenizer/tokenUtils');
const compileData    = require('../compiler/CompileData').compileData;
const Record         = require('../types/Record').Record;
const Proc           = require('../types/Proc').Proc;
const MathExpression = require('./MathExpression').MathExpression;
const VarExpression  = require('./VarExpression');

exports.compileToTempStackValue = function(compiler, program, scope, expression) {
    let varExpression = new VarExpression.VarExpression({compiler: compiler, program: program, scope: scope});
    program.nextBlockId(expression.tokens[0], scope);
    let mathExpressionNode = new MathExpression({
            varExpression: varExpression,
            compiler:      compiler,
            program:       program,
            scope:         scope
        }).compile(expression, compiler.getPass());
    let stackOffset        = scope.getStackOffset();
    if (mathExpressionNode.getValue()) {
        let tokens = expression.tokens;
        let token  = tokens[0];
        if (token.cls === t.TOKEN_NUMBER) {
            program.addCommand($.CMD_SET, $.T_NUM_L, stackOffset, $.T_NUM_C, tokens[0].value);
        } else {
            let identifier = scope.findIdentifier(token.lexeme);
            let vrOrType   = varExpression.compileExpressionToRegister(identifier, expression, $.REG_PTR, false, false).type;
            if (varExpression.getTypeFromIdentifier(vrOrType) === t.LEXEME_NUMBER) {
                program.addCommand($.CMD_SET, $.T_NUM_L, stackOffset, $.T_NUM_P, 0);
            } else {
                throw errors.createError(err.NUMBER_TYPE_EXPECTED, tokens[0], 'Number type expected.');
            }
        }
    } else {
        mathExpressionNode.compile(t.LEXEME_NUMBER);
    }
};

exports.checkType = function(type, expression) {
    let index            = 0;
    let tokens           = expression.tokens;
    let done             = false;
    let expectIdentifier = false;
    index++;
    while ((index < tokens.length) && !done) {
        let token = tokens[index++];
        switch (token.cls) {
            case t.TOKEN_DOT:
                expectIdentifier = true;
                break;
            case t.TOKEN_IDENTIFIER:
                VarExpression.assertRecord({identifierType: type, token: token});
                let identifier = type.findIdentifier(token.lexeme);
                if (identifier === null) {
                    throw errors.createError(errors.errors.UNDEFINED_FIELD, token, 'Undefined field "' + token.lexeme + '".');
                }
                type = identifier.getType();
                expectIdentifier = false;
                break;
            case t.TOKEN_BRACKET_OPEN:
                let open = 1;
                while (open && (index < tokens.length)) {
                    let token = tokens[index++];
                    switch (token.cls) {
                        case t.TOKEN_BRACKET_OPEN:
                            open++;
                            break;
                        case t.TOKEN_BRACKET_CLOSE:
                            open--;
                            break;
                    }
                }
                break;
            case t.TOKEN_PARENTHESIS_OPEN:
                return {procCall: (type === t.LEXEME_PROC)};
        }
    }
    return {procCall: false, type: type};
};

exports.AssignmentExpression = class {
    constructor(opts) {
        this._compiler      = opts.compiler;
        this._program       = opts.program;
        this._scope         = opts.scope;
        this._varExpression = new VarExpression.VarExpression(opts);
    }

    validateTypes(opts) {
        if (!this._varExpression.getTypesEqual(opts.srcVrOrType, opts.destVrOrType)) {
            throw errors.createError(err.TYPE_MISMATCH, opts.destExpression.tokens[0], 'Type mismatch.');
        }
        return this;
    }

    validateDataSize(opts) {
        if ((opts.srcInfo.dataSize !== undefined) && (opts.destInfo.dataSize !== undefined)) {
            if (opts.srcInfo.dataSize !== opts.destInfo.dataSize) {
                if (opts.srcInfo.fullArrayAddress !== opts.destInfo.fullArrayAddress) {
                    throw errors.createError(err.ARRAY_TYPE_EXPECTED, opts.destExpression.tokens[0], 'Array type expected.');
                }
            }
        }
        return this;
    }

    validateRecords(opts) {
        let srcType  = opts.srcVrOrType.getType  ? opts.srcVrOrType.getType()  : opts.srcVrOrType;
        let destType = opts.destVrOrType.getType ? opts.destVrOrType.getType() : opts.destVrOrType;
        if ((srcType instanceof Record) && (destType instanceof Record)) {
            if ((srcType.getName() !== destType.getName()) || (opts.srcInfo.arrayIndex !== opts.destInfo.arrayIndex)) {
                if (opts.destInfo.dataSize !== opts.srcInfo.dataSize) {
                    throw errors.createError(err.TYPE_MISMATCH, opts.destExpression.tokens[0], 'Type mismatch.');
                }
            }
        }
        return this;
    }

    validateArrayAssignment(opts) {
        if (opts.srcVrOrType && opts.srcVrOrType.getArraySize && (opts.srcVrOrType.getArraySize() !== false) &&
            (opts.destVrOrType && opts.destVrOrType.getArraySize) && (opts.destVrOrType.getArraySize() !== false)) {
            if (JSON.stringify(opts.srcVrOrType.getArraySize()) !== JSON.stringify(opts.destVrOrType.getArraySize())) {
                throw errors.createError(err.ARRAY_SIZE_MISMATCH, opts.destExpression.tokens[0], 'Array size mismatch.');
            }
            return true;
        }
        return false;
    }

    /**
     * Check if a proc var already has been assigned before,
     * if so then check if the new assigned proc interface matches the already
     * assigned interface...
    **/
    validateProcAssignment(opts) {
        if (!opts.srcIdentifier || !opts.destIdentifier) {
            return;
        }
        let assignedProc = opts.destIdentifier.getAssignedProc();
        if (!assignedProc) {
            opts.destIdentifier.setAssignedProc(opts.srcIdentifier);
            return;
        }
        if (opts.srcIdentifier.getParamCount() !== assignedProc.getParamCount()) {
            throw errors.createError(
                err.PARAM_COUNT_MISMATCH,
                opts.srcExpression.tokens[0],
                'Parameter count mismatch, "' + assignedProc.getName() + '" and "' + opts.srcIdentifier.getName() + '" have different parameter counts.'
            );
        }
        let assignedVars = assignedProc.getVars();
        let srcVars      = opts.srcIdentifier.getVars();
        for (let i = 0; i < opts.srcIdentifier.getParamCount(); i++) {
            let assignedVar = assignedVars[2 + i]; // Skip the first two -return- values...
            let srcVar      = srcVars[2 + i];
            if (assignedVar.getType() !== srcVar.getType()) {
                throw errors.createError(
                    err.TYPE_MISMATCH,
                    opts.srcExpression.tokens[0],
                    'Type mismatch, parameter types of "' + assignedVar.getName() + '" and "' + srcVar.getName() + '" do not match.'
                );
            }
            if (JSON.stringify(assignedVar.getArraySize()) !== JSON.stringify(srcVar.getArraySize())) {
                throw errors.createError(
                    err.TYPE_MISMATCH,
                    opts.srcExpression.tokens[0],
                    'Type mismatch, parameter sizes of "' + assignedVar.getName() + '" and "' + srcVar.getName() + '" do not match.'
                );
            }
        }
    }

    compileSourceExpression(opts) {
        let result        = {};
        let token         = opts.srcExpression.tokens[0];
        let varExpression = this._varExpression;
        let srcVrOrType;
        if (token.cls === t.TOKEN_STRING) {
            result.type = t.LEXEME_STRING;
            varExpression.saveStringInLocalVar(token.lexeme);
        } else {
            let srcIdentifier = this._scope.findIdentifier(token.lexeme);
            result      = varExpression.compileExpressionToRegister(srcIdentifier, opts.srcExpression, $.REG_PTR, false, false);
            srcVrOrType = result.type;
            switch (varExpression.getTypeFromIdentifier(srcVrOrType)) {
                case t.LEXEME_STRING:
                    if (opts.address || !result.fullArrayAddress) {
                        varExpression.savePtrValueInLocalVar();
                    } else if (srcVrOrType.getPointer && srcVrOrType.getPointer()) {
                        varExpression.savePtrInLocalVar();
                    } else {
                        varExpression.savePtrValueInLocalVar();
                    }
                    break;
                case t.LEXEME_NUMBER:
                    if (srcVrOrType.getPointer && srcVrOrType.getPointer()) {
                        varExpression.savePtrPointerValueInLocalVar();
                    } else if (opts.address || !result.fullArrayAddress) {
                        varExpression.savePtrInLocalVar();
                    } else {
                        varExpression.savePtrValueInLocalVar();
                    }
                    break;
                default:
                    varExpression.savePtrInLocalVar();
                    break;
            }
        }
        return result;
    }

    compileStringAssignment(opts) {
        let operator = opts.destExpression.lastToken.lexeme;
        if ([t.LEXEME_ASSIGN, t.LEXEME_ASSIGN_ADD].indexOf(operator) === -1) {
            throw errors.createError(err.INVALID_OPERATION, opts.destExpression.lastToken, 'Invalid operation.');
        } else if (operator === t.LEXEME_ASSIGN) {
            if (opts.address) {
                if (opts.destVrOrType.getPointer && !opts.destVrOrType.getPointer()) {
                    throw errors.createError(err.TYPE_MISMATCH, opts.destExpression.tokens[0], 'Type mismatch.');
                }
                this._program.addCommand($.CMD_SET, $.T_NUM_P, 0, $.T_NUM_L, this._scope.getStackOffset());
            } else if (opts.destVrOrType.getPointer && opts.destVrOrType.getPointer()) {
                if (opts.srcVrOrType.getPointer && !opts.srcVrOrType.getPointer()) {
                    throw errors.createError(err.POINTER_TYPE_EXPECTED, opts.srcExpression.tokens[0], 'Pointer type expected.');
                }
                this._program.addCommand($.CMD_SET, $.T_NUM_P, 0, $.T_NUM_L, this._scope.getStackOffset());
            } else if (opts.srcVrOrType.getPointer && opts.srcVrOrType.getPointer()) {
                throw errors.createError(err.TYPE_MISMATCH, opts.destExpression.tokens[0], 'Type mismatch.');
            } else if (opts.srcExpression.tokens[0].cls === t.TOKEN_STRING) { // Todo: handle expression where first item is constant...
                this._program.addCommand($.CMD_SETS, $.T_NUM_P, 0, $.T_NUM_L, this._scope.getStackOffset());
            } else {
                this._program.addCommand($.CMD_SET, $.T_NUM_P, 0, $.T_NUM_L, this._scope.getStackOffset());
            }
        } else {
            this._program.addCommand($.CMD_ADDS, $.T_NUM_P, 0, $.T_NUM_L, this._scope.getStackOffset());
        }
    }

    compileNumberAssignment(opts) {
        if (this.validateArrayAssignment(opts)) {
            return opts.srcVrOrType.getTotalSize();
        }
        if (opts.address && !opts.destVrOrType.getPointer()) {
            throw errors.createError(err.POINTER_TYPE_EXPECTED, opts.destExpression.tokens[0], 'Pointer type expected.');
        }
        if (!opts.address && opts.destVrOrType.getPointer()) {
            if (opts.destIdentifier.getArraySize() && opts.destIdentifier.getPointer() && (opts.destIdentifier.getType() === t.LEXEME_NUMBER)) {
                this._program.addCommand($.CMD_SET, $.T_NUM_P, 0, $.T_NUM_L, this._scope.getStackOffset());
            } else {
                this._program.addCommand(
                    $.CMD_SET, $.T_NUM_G, $.REG_PTR, $.T_NUM_P, 0,
                    $.CMD_SET, $.T_NUM_P, 0,         $.T_NUM_L, this._scope.getStackOffset()
                );
            }
        } else {
            let varExpression = this._varExpression;
            let token         = opts.destExpression.lastToken;
            varExpression.assignToPtr(varExpression.assignmentTokenToCmd(token), $.T_NUM_L, this._scope.getStackOffset());
            this._program.addInfoToLastCommand({token: token, scope: this._scope});
        }
        return 0;
    }

    compileAddressPointerAssignment(opts) {
        if (!opts.destVrOrType.getPointer || !opts.destVrOrType.getPointer()) {
            throw errors.createError(err.POINTER_TYPE_EXPECTED, opts.destExpression.tokens[0], 'Pointer type expected.');
        }
        this._program.addCommand($.CMD_SET, $.T_NUM_P, 0, $.T_NUM_L, this._scope.getStackOffset());
    }

    /**
     * Compile a constant array assignment like: v = [...]
    **/
    compileArrayConstantAssignment(opts) {
        let destVrOrType = this._varExpression.compileExpressionToRegister(opts.destIdentifier, opts.destExpression, $.REG_PTR, true, false).type;
        if (destVrOrType.getArraySize() === false) {
            throw errors.createError(err.TYPE_MISMATCH, opts.destExpression.tokens[0], 'Type mismatch.');
        }
        let iterator = new Iterator({tokens: [].concat(opts.srcExpression.tokens), compiler: this._compiler});
        let data     = [];
        iterator.next(); // Skip "["
        compileData.readArrayToData(iterator, destVrOrType, data);
        let globalScope = this._scope.getGlobal() ? this._scope : this._scope.getParentScope();
        let dataVar     = globalScope.addVar(null, '!data' + this._scope.getTempVarIndex(), t.LEXEME_NUMBER, data.length);
        this._program
            .addConstant({offset: dataVar.getOffset(), data: data})
            .addCommand(
                $.CMD_SET,  $.T_NUM_G, $.REG_SRC,   $.T_NUM_C, dataVar.getOffset(),
                $.CMD_SET,  $.T_NUM_G, $.REG_DEST,  $.T_NUM_G, $.REG_PTR,
                $.CMD_COPY, 0,         0, $.T_NUM_C, data.length
            );
    }

    /**
     * Compile a constant record assignment like: v = {...}
    **/
    compileRecordConstantAssignment(opts) {
        let destVrOrType = this._varExpression.compileExpressionToRegister(opts.destIdentifier, opts.destExpression, $.REG_PTR, true).type;
        if (!(destVrOrType.getType() instanceof Record)) {
            throw errors.createError(err.TYPE_MISMATCH, opts.destExpression.tokens[0], 'Type mismatch.');
        }
        let iterator = new Iterator({tokens: [].concat(opts.srcExpression.tokens), compiler: this._compiler});
        let data     = [];
        iterator.next(); // Skip "{"
        compileData.readRecordToData(iterator, destVrOrType.getType(), data);
        let globalScope = this._scope.getGlobal() ? this._scope : this._scope.getParentScope();
        let dataVar     = globalScope.addVar(null, '!data' + this._scope.getTempVarIndex(), t.LEXEME_NUMBER, data.length);
        this._program
            .addConstant({offset: dataVar.getOffset(), data: data})
            .addCommand(
                $.CMD_SET,  $.T_NUM_G, $.REG_SRC,  $.T_NUM_C, dataVar.getOffset(),
                $.CMD_SET,  $.T_NUM_G, $.REG_DEST, $.T_NUM_G, $.REG_PTR,
                $.CMD_COPY, 0,         0,          $.T_NUM_C, data.length
            );
    }

    /**
     * Compile a math expression assignment like: v = i * j, v = (i + 1) * j
    **/
    compileMathExpressionAssignment(opts) {
        let mathExpressionNode = new MathExpression({
                varExpression: this._varExpression,
                compiler:      this._compiler,
                program:       this._program,
                scope:         this._scope
            }).compile(opts.srcExpression, this._compiler.getPass());
        let value = mathExpressionNode.getValue() || mathExpressionNode.getLeftDeepValue();
        if (value && (value[0].cls === t.TOKEN_NUMBER)) {
            opts.srcVrOrType = t.LEXEME_NUMBER;
        } else if (value && (value[0].cls === t.TOKEN_STRING)) {
            opts.srcVrOrType = t.LEXEME_STRING;
        } else {
            value = mathExpressionNode.getValue() || mathExpressionNode.getRightDeepValue();
            if (value && (value[0].cls === t.TOKEN_NUMBER)) {
                opts.srcVrOrType = t.LEXEME_NUMBER;
            } else {
                opts.srcIdentifier = this._scope.findIdentifier(value[0].lexeme);
                if (opts.srcIdentifier) {
                    if (opts.srcIdentifier instanceof Proc) {
                        opts.srcVrOrType = t.LEXEME_NUMBER;
                    } else if (opts.srcIdentifier.getType() === t.LEXEME_NUMBER) {
                        opts.srcVrOrType = t.LEXEME_NUMBER;
                    } else if (opts.srcIdentifier.getType() === t.LEXEME_STRING) {
                        opts.srcVrOrType = t.LEXEME_STRING;
                    } else {
                        opts.srcVrOrType = t.LEXEME_NUMBER;
                    }
                } else {
                    opts.srcVrOrType = opts.destIdentifier.getType();
                }
            }
        }
        let varExpression = this._varExpression;
        mathExpressionNode.compile(opts.srcVrOrType);
        opts.destVrOrType = varExpression.compileExpressionToRegister(opts.destIdentifier, opts.destExpression, $.REG_PTR, true, false).type;
        if (!varExpression.getTypesEqual(opts.srcVrOrType, opts.destVrOrType)) {
            throw errors.createError(err.TYPE_MISMATCH, destExpression.tokens[0], 'Type mismatch.');
        }
        switch (varExpression.getTypeFromIdentifier(opts.srcVrOrType)) {
            case t.LEXEME_STRING:
                this.compileStringAssignment(opts);
                break;
            case t.LEXEME_PROC:
                this.validateProcAssignment(opts);
                this.compileNumberAssignment(opts);
                break;
            case t.LEXEME_NUMBER:
                this.compileNumberAssignment(opts);
                break;
            default:
                console.log('ERROR!!!');
                break;
        }
    }

    /**
     * Compile an assignment like: a = b, a[1] = b, a = b[2]
    **/
    compileDataAssignment(opts) {
        opts.srcInfo      = this.compileSourceExpression(opts);
        opts.destInfo     = this._varExpression.compileExpressionToRegister(opts.destIdentifier, opts.destExpression, $.REG_PTR, true, false);
        opts.srcVrOrType  = opts.srcInfo.type;
        opts.destVrOrType = opts.destInfo.type;
        this
            .validateRecords(opts)
            .validateTypes(opts)
            .validateDataSize(opts);
        let copySize = 0;
        let type     = this._varExpression.getTypeFromIdentifier(opts.srcVrOrType);
        if (opts.address) {
            if (opts.destInfo.type && opts.destInfo.type.getPointer && !opts.destInfo.type.getPointer()) {
                throw errors.createError(err.POINTER_TYPE_EXPECTED, opts.destInfo.type.getToken(), 'Pointer type expected.');
            }
            this.compileAddressPointerAssignment(opts);
        } else if (type === t.LEXEME_STRING) {
            this.compileStringAssignment(opts);
        } else if (type === t.LEXEME_PROC) {
            opts.srcIdentifier = this._scope.findIdentifier(opts.srcExpression.tokens[0].lexeme);
            this.validateProcAssignment(opts);
            copySize = this.compileNumberAssignment(opts);
        } else if (type === t.LEXEME_NUMBER) {
            copySize = this.compileNumberAssignment(opts);
        } else {
            copySize = opts.srcVrOrType.getTotalSize ? opts.srcVrOrType.getTotalSize() : opts.srcVrOrType.getSize();
        }
        if (copySize) {
            this._program.addCommand(
                $.CMD_SET,  $.T_NUM_G, $.REG_DEST, $.T_NUM_G, $.REG_PTR,
                $.CMD_SET,  $.T_NUM_G, $.REG_SRC,  $.T_NUM_L, this._scope.getStackOffset(),
                $.CMD_COPY, 0,         0,          $.T_NUM_C, copySize
            );
        }
    }

    compile(destExpression, srcExpression) {
        this._program.nextBlockId(srcExpression.tokens[0], this._scope);
        srcExpression.tokens = tokenUtils.getTokensWithoutParenthesis(srcExpression.tokens);
        let opts = {
                srcExpression:  srcExpression,
                destIdentifier: this._scope.findIdentifier(destExpression.tokens[0].lexeme),
                destVrOrType:   null,
                destExpression: destExpression,
                address:        false
            };
        if (srcExpression.tokens[0].cls === t.TOKEN_ADDRESS) {
            opts.address = true;
            srcExpression.tokens.shift();
        }
        switch (tokenUtils.assignmentType(srcExpression.tokens)) {
            case tokenUtils.ASSIGMMENT_RECORD:
                return this.compileRecordConstantAssignment(opts);
            case tokenUtils.ASSIGNMENT_ARRAY:
                return this.compileArrayConstantAssignment(opts);
            case tokenUtils.ASSIGNMENT_MATH_EXPRESSION:
                return this.compileMathExpressionAssignment(opts);
            default:
                return this.compileDataAssignment(opts);
        }
    }
};
