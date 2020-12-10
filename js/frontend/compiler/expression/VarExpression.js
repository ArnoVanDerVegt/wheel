/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $              = require('../../program/commands');
const errors         = require('../errors');
const err            = require('../errors').errors;
const t              = require('../tokenizer/tokenizer');
const tokenUtils     = require('../tokenizer/tokenUtils');
const Iterator       = require('../tokenizer/TokenIterator').Iterator;
const Record         = require('../types/Record').Record;
const Objct          = require('../types/Objct').Objct;
const Proc           = require('../types/Proc').Proc;
const Var            = require('../types/Var').Var;
const MathExpression = require('./MathExpression').MathExpression;
const helper         = require('./helper');

exports.VarExpression = class {
    constructor(opts) {
        this._scope                  = opts.scope;
        this._program                = opts.program;
        this._compiler               = opts.compiler;
        this._lastRecordType         = null;
        this._lastProcField          = null;
        this._selfPointerStackOffset = false;
        this._methodCall             = false;
    }

    getLastRecordType() {
        return this._lastRecordType;
    }

    setLastRecordType(lastRecordType) {
        if (lastRecordType instanceof Record) {
            this._lastRecordType = lastRecordType;
        }
    }

    getLastProcField() {
        return this._lastProcField;
    }

    getFieldFromIndexToken(opts) {
        let token = opts.expression.tokens[opts.index];
        let field = opts.identifierType.type.findVar(token.lexeme);
        if (!field) {
            throw errors.createError(err.UNDEFINED_FIELD, token, 'Undefined field "' + token.lexeme + '".');
        }
        return field;
    }

    /**
     * Check it the expression end with ")" (this._methodCall) and the identifier type is an object...
    **/
    getMakeMethodCall(identifier) {
        return identifier.getType && (identifier.getType().type instanceof Objct) && this._methodCall;
    }

    addVarIndexToReg(opts) {
        let program = this._program;
        let offset  = this._scope.getStackOffset() + 1;
        let type    = opts.indexIdentifier.getGlobal() ? $.T_NUM_G : $.T_NUM_L;
        if (this._compiler.getRangeCheck()) {
            program
                .addCommand(
                    $.CMD_SET, $.T_NUM_G, $.REG_RANGE0, $.T_NUM_C, opts.maxArraySize,
                    $.CMD_SET, $.T_NUM_G, $.REG_RANGE1, type,      opts.indexIdentifier.getOffset(),
                    $.CMD_MOD, $.T_NUM_C, 0,            $.T_NUM_C, 0
                )
                .addInfoToLastCommand({token: opts.token, scope: this._scope});
        }
        if (opts.indexIdentifier.getWithOffset() === null) {
            program.addCommand(
                $.CMD_SET, $.T_NUM_L, offset, type,      opts.indexIdentifier.getOffset(),
                $.CMD_MUL, $.T_NUM_L, offset, $.T_NUM_C, opts.identifier.getType().type.getElementSize() * opts.arraySize
            );
        } else {
            // Get the "with" offset:
            program.addCommand(
                $.CMD_SET, $.T_NUM_L, offset + 1, $.T_NUM_G, $.REG_PTR,     // Save the pointer register....
                $.CMD_SET, $.T_NUM_G, $.REG_PTR,  $.T_NUM_L, opts.indexIdentifier.getWithOffset(),
                $.CMD_ADD, $.T_NUM_G, $.REG_PTR,  $.T_NUM_C, opts.indexIdentifier.getOffset(),
                $.CMD_SET, $.T_NUM_L, offset,     $.T_NUM_P, 0,
                $.CMD_MUL, $.T_NUM_L, offset,     $.T_NUM_C, opts.identifier.getType().type.getElementSize() * opts.arraySize,
                $.CMD_SET, $.T_NUM_G, $.REG_PTR,  $.T_NUM_L, offset + 1     // Restore the pointer register...
            );
        }
        helper.addToReg(this._program, opts.reg, $.T_NUM_L, offset);
    }

    compileDerefecencePointer(opts) {
        if (opts.reg === $.REG_PTR) {
            this._program.addCommand($.CMD_SET, $.T_NUM_G, $.REG_PTR, $.T_NUM_P, 0);
        } else {
            this._program.addCommand(
                $.CMD_SET, $.T_NUM_G, $.REG_PTR, $.T_NUM_G, opts.reg,
                $.CMD_SET, $.T_NUM_G, $.REG_PTR, $.T_NUM_P, 0,
                $.CMD_SET, $.T_NUM_G, opts.reg,  $.T_NUM_G, $.REG_PTR
            );
        }
        opts.dereferencedPointer = true;
        return opts;
    }

    /**
     * Add the value of the index identifier to the register.
     * This happens when the index identifier is a single token and the array element size is 1.
    **/
    compileAddIndexIdentifierToReg(opts) {
        let program = this._program;
        let scope   = this._scope;
        if (opts.indexIdentifier.getWithOffset() === null) {
            if (this._compiler.getRangeCheck()) {
                program
                    .addCommand(
                        $.CMD_SET, $.T_NUM_G, $.REG_RANGE0, $.T_NUM_C,      opts.maxArraySize,
                        $.CMD_SET, $.T_NUM_G, $.REG_RANGE1, opts.paramType, opts.indexIdentifier.getOffset(),
                        $.CMD_MOD, $.T_NUM_C, 0,            $.T_NUM_C,      0
                    )
                    .addInfoToLastCommand({token: opts.indexToken, scope: this._scope});
            }
            // It's a single dimensional array or the last array of a multidemensional array...
            helper.addToReg(this._program, opts.reg, opts.paramType, opts.indexIdentifier.getOffset());
            if (!opts.identifier.getPointer() && opts.identifier.getType().typePointer &&
                !opts.forWriting && (opts.selfPointerStackOffset === false)) {
                opts = this.compileDerefecencePointer(opts);
            }
            return opts;
        }
        // It's a self pointer or a field of a "with" record...
        if (opts.reg === $.REG_PTR) {
            // Todo: add range check...
            program.addCommand(
                $.CMD_SET, $.T_NUM_L, scope.getStackOffset() + 1, $.T_NUM_G, $.REG_PTR,                     // Save ptr on stack...
                $.CMD_SET, $.T_NUM_G, $.REG_PTR,                  $.T_NUM_L, opts.indexIdentifier.getWithOffset(),
                $.CMD_ADD, $.T_NUM_G, $.REG_PTR,                  $.T_NUM_C, opts.indexIdentifier.getOffset(),
                $.CMD_SET, $.T_NUM_L, scope.getStackOffset() + 2, $.T_NUM_P, 0,
                $.CMD_SET, $.T_NUM_G, $.REG_PTR,                  $.T_NUM_L, scope.getStackOffset() + 1,
                $.CMD_ADD, $.T_NUM_G, $.REG_PTR,                  $.T_NUM_L, scope.getStackOffset() + 2     // Restore the ptr...
            );
        } else {
            // Todo: add range check...
            program.addCommand(
                $.CMD_SET, $.T_NUM_G, $.REG_PTR,                  $.T_NUM_L, opts.indexIdentifier.getWithOffset(),
                $.CMD_ADD, $.T_NUM_G, $.REG_PTR,                  $.T_NUM_C, opts.indexIdentifier.getOffset(),
                $.CMD_ADD, $.T_NUM_G, reg,                        $.T_NUM_P, 0
            );
        }
        return opts;
    }

    /**
     * Multiply the index with the array size and add to the register...
    **/
    compileCalculateAndAddIndexToReg(opts) {
        let program = this._program;
        let scope   = this._scope;
        scope.incStackOffset();
        if (this._compiler.getRangeCheck()) {
            // Compile with range checking...
            program
                .addCommand(
                    $.CMD_SET, $.T_NUM_L, scope.getStackOffset(), opts.paramType, opts.indexIdentifier.getOffset(),
                    $.CMD_SET, $.T_NUM_G, $.REG_RANGE0,           $.T_NUM_C,      opts.maxArraySize,
                    $.CMD_SET, $.T_NUM_G, $.REG_RANGE1,           $.T_NUM_L,      scope.getStackOffset(),
                    $.CMD_MOD, $.T_NUM_C, 0,                      $.T_NUM_C,      0
                )
                .addInfoToLastCommand({token: opts.indexToken, scope: this._scope})
                .addCommand(
                    $.CMD_MUL, $.T_NUM_L, scope.getStackOffset(), $.T_NUM_C, opts.arraySize,
                    $.CMD_ADD, $.T_NUM_G, opts.reg,               $.T_NUM_L, scope.getStackOffset()
                );
        } else {
            // Add to offset: offset = [local] * arraySize
            program.addCommand(
                $.CMD_SET, $.T_NUM_L, scope.getStackOffset(), opts.paramType, opts.indexIdentifier.getOffset(),
                $.CMD_MUL, $.T_NUM_L, scope.getStackOffset(), $.T_NUM_C,      opts.arraySize,
                $.CMD_ADD, $.T_NUM_G, opts.reg,               $.T_NUM_L,      scope.getStackOffset()
            );
        }
        scope.decStackOffset();
    }

    /**
     * Compile the index of an array and add the offset to a register
    **/
    compileArrayIndexToReg(opts) {
        let scope              = this._scope;
        let program            = this._program;
        let indexAndExpression = tokenUtils.getIndexAfterTokenPairs(opts.expression, opts.index, [t.TOKEN_BRACKET_OPEN, t.TOKEN_BRACKET_CLOSE]);
        let indexExpression    = indexAndExpression.expression;
        opts.index = indexAndExpression.index - 1;
        if (indexExpression.length === 1) {
            let indexToken = indexExpression[0];
            opts.token = indexToken;
            if (indexToken.cls === t.TOKEN_NUMBER) {
                if (indexToken.value > 0) {
                    if (indexToken.value >= opts.maxArraySize) {
                        throw errors.createError(err.ARRAY_INDEX_OUT_OF_RANGE, indexToken, 'Array index out of range.');
                    }
                    helper.addToReg(this._program, opts.reg, $.T_NUM_C, indexToken.value * opts.identifierSize * opts.arraySize);
                } else if (indexToken.value < 0) {
                    throw errors.createError(err.INVALID_ARRAY_INDEX, indexToken, 'Invalid array index.');
                }
                if (!opts.identifier.getPointer() && opts.identifier.getType().typePointer &&
                    !opts.forWriting && (opts.selfPointerStackOffset === false)) {
                    opts = this.compileDerefecencePointer(opts);
                }
            } else if (indexToken.cls === t.TOKEN_IDENTIFIER) {
                opts.indexIdentifier = helper.findIdentifier(this._scope, indexToken);
                opts.paramType       = opts.indexIdentifier.getGlobal() ? $.T_NUM_G : $.T_NUM_L;
                opts.indexToken      = indexToken;
                if (opts.arraySize === 1) {
                    if (opts.identifierSize === 1) {
                        opts = this.compileAddIndexIdentifierToReg(opts);
                    } else {
                        this.addVarIndexToReg(opts);
                    }
                } else if (opts.identifierSize === 1) {
                    // Calculate the array offset...
                    this.compileCalculateAndAddIndexToReg(opts);
                } else {
                    this.addVarIndexToReg(opts);
                }
            }
        } else {
            // The index is a math expression...
            let lastRecordType     = this._lastRecordType;
            let mathExpressionNode = new MathExpression({
                    varExpression: this,
                    compiler:      this._compiler,
                    program:       program,
                    scope:         scope
                }).compile({tokens: indexExpression}, this._compiler.getPass());
            scope.incStackOffset();
            if (!mathExpressionNode.getValue()) {
                program.addCommand($.CMD_SET, $.T_NUM_L, scope.getStackOffset(), $.T_NUM_G, $.REG_PTR);
            }
            scope.incStackOffset();
            mathExpressionNode.compile(t.LEXEME_NUMBER);
            this._lastRecordType = lastRecordType;
            if (this._compiler.getRangeCheck()) {
                program
                    .addCommand(
                        $.CMD_SET, $.T_NUM_G, $.REG_RANGE0, $.T_NUM_C, opts.maxArraySize,
                        $.CMD_SET, $.T_NUM_G, $.REG_RANGE1, $.T_NUM_L, scope.getStackOffset(),
                        $.CMD_MOD, $.T_NUM_C, 0,            $.T_NUM_C, 0
                    )
                    .addInfoToLastCommand({token: indexExpression[0], scope: this._scope});
            }
            if (opts.identifierSize * opts.arraySize > 1) {
                program.addCommand($.CMD_MUL, $.T_NUM_L, scope.getStackOffset(), $.T_NUM_C, opts.identifierSize * opts.arraySize);
            }
            scope.decStackOffset();
            if (!mathExpressionNode.getValue()) {
                program.addCommand($.CMD_SET, $.T_NUM_G, $.REG_PTR, $.T_NUM_L, scope.getStackOffset());
            }
            scope.decStackOffset();
            helper.addToReg(this._program, opts.reg, $.T_NUM_L, this._scope.getStackOffset() + 2);
            if (!opts.identifier.getPointer() && opts.identifier.getType().typePointer &&
                !opts.forWriting && (opts.selfPointerStackOffset === false)) {
                opts = this.compileDerefecencePointer(opts);
            }
        }
    }

    /**
     * Compile a procedure call and add the return register to the register
    **/
    compileProcCall(opts, result) {
        let scope       = this._scope;
        let iterator    = new Iterator({tokens: opts.expression.tokens, compiler: this._compiler});
        let CompileCall = require('../compiler/CompileCall').CompileCall;
        iterator.skipWhiteSpace().next();
        new CompileCall({compiler: this._compiler, program: this._program, scope: scope}).compile({
            iterator:               iterator,
            proc:                   opts.identifier,
            procExpression:         null,
            procIdentifier:         opts.identifier,
            callMethod:             opts.callMethod,
            selfPointerStackOffset: this._selfPointerStackOffset
        });
        helper.setStackOffsetToPtr(this._program, this._scope);
        helper.assignToPtr(this._program, $.CMD_SET, $.T_NUM_G, $.REG_RET);
        opts.index      = opts.expression.tokens.length;
        result.dataSize = 1;
    }

    /**
     * Compile an array index to add to a register, examples: [2], [5][4], [i * 2], [i[2]]
    **/
    compileArrayIndex(opts, result) {
        opts.dereferencedPointer = false;
        helper.assertArray(opts.identifier, opts.token);
        let program        = this._program;
        let identifier     = opts.identifier;
        let arraySize      = identifier.getArraySize();
        // Check if it's a number, string or pointer then the size is 1.
        // If it's a record then it's the size of the record...
        let identifierSize = identifier.getType().typePointer ? 1 : helper.getIdentifierSize(identifier.getType().type);
        if (typeof arraySize === 'number') {
            // It's a single dimensional array...
            opts.index++;
            opts.identifierSize = identifierSize;
            opts.arraySize      = 1;
            opts.maxArraySize   = arraySize;
            result.dataSize     = identifierSize;
            this.compileArrayIndexToReg(opts);
        } else {
            // It's a multi dimensional array...
            // Calculate the array sized with the nested arrays inside...
            let arraySizes = [];
            let size       = identifierSize;
            for (let i = arraySize.length - 1; i > 0; i--) {
                size *= arraySize[i];
                arraySizes.unshift(size);
            }
            arraySizes.push(identifierSize);
            for (let i = 0; i < arraySize.length; i++) {
                opts.index++;
                opts.identifierSize = 1;
                opts.arraySize      = arraySizes[i];
                opts.maxArraySize   = arraySize[i];
                this.compileArrayIndexToReg(opts);
                opts.index++;
                if ((opts.index >= opts.expression.tokens.length) && (i < arraySize.length - 1)) {
                    // It's part of a multidimensional array, create an intermediary result type...
                    result.fullArrayAddress = false;
                    result.dataSize         = arraySize[i];
                    let resultArraySize = [];
                    for (let j = i + 1; j < arraySize.length; j++) {
                        resultArraySize.push(arraySize[j]);
                    }
                    if (resultArraySize.length === 1) {
                        resultArraySize = resultArraySize[0];
                    }
                    result.type = new Var({
                        compiler:    this._compiler,
                        unionId:     0,
                        name:        '?',
                        arraySize:   resultArraySize,
                        offset:      identifier.getOffset(),
                        token:       identifier.getToken(),
                        type:        identifier.getType().type,
                        typePointer: identifier.getType().typePointer,
                        global:      identifier.getGlobal(),
                        pointer:     identifier.getPointer()
                    });
                    break;
                }
            }
            opts.index--;
        }
        // When writing the last field then we don't dereference the pointer...
        if (identifier.getPointer() && (!opts.forWriting || (opts.index + 1 < opts.expression.tokens.length))) {
            if (opts.identifier.getType().typePointer && (opts.reg !== $.REG_PTR)) {
                program.addCommand(
                    $.CMD_SET, $.T_NUM_G, $.REG_PTR, $.T_NUM_G, opts.reg,
                    $.CMD_SET, $.T_NUM_G, $.REG_PTR, $.T_NUM_P, 0,
                    $.CMD_SET, $.T_NUM_G, opts.reg,  $.T_NUM_G, $.REG_PTR
                );
            } else {
                if (!opts.dereferencedPointer && !opts.dereferencedPointerForWriting) {
                    program.addCommand($.CMD_SET, $.T_NUM_G, $.REG_PTR, $.T_NUM_P, 0);
                }
                opts.dereferencedPointerForWriting = false;
            }
            opts.dereferencedPointer = true;
        }
        return opts;
    }

    /**
     * Compile a single token value to a register, examples: 1, "string", local, global
    **/
    compileSingleTokenToRegister(opts, result) {
        let program = this._program;
        result.dataSize = 1;
        if (opts.identifier && opts.identifier.getType) {
            this.setLastRecordType(opts.identifier.getType().type);
        }
        if (opts.expression.tokens[0].cls === t.TOKEN_NUMBER) {
            program.addCommand($.CMD_SET, $.T_NUM_L, this._scope.getStackOffset(), $.T_NUM_C, opts.expression.tokens[0].value);
            helper.setReg(this._program, opts.reg, $.T_NUM_G, $.REG_STACK);
            helper.addToReg(this._program, opts.reg, $.T_NUM_C, this._scope.getStackOffset());
        } else if (opts.identifier === null) {
            let token = opts.expression.tokens[0];
            throw errors.createError(err.UNDEFINED_IDENTIFIER, token, 'Undefined identifier "' + token.lexeme + '".');
        } else if (opts.identifier instanceof Proc) {
            this._compiler.getUseInfo().setUseProc(opts.identifier.getName(), opts.identifier); // Set the proc as used...
            helper.setReg(this._program, opts.reg, $.T_NUM_C, opts.identifier.getEntryPoint() - 1);
            result.type = t.LEXEME_PROC;
        } else {
            if (opts.identifier.getWithOffset() !== null) {
                helper.setReg(this._program, $.REG_PTR, $.T_NUM_L, opts.identifier.getWithOffset());
                if (opts.identifier.getType().type === t.LEXEME_PROC) {
                    this._lastProcField = opts.identifier.getProc();
                    if (opts.selfPointerStackOffset !== false) {
                        // It's a method to call then save the self pointer on the stack!
                        helper.saveSelfPointerToLocal(program, opts.selfPointerStackOffset, opts.reg);
                    }
                }
                if (opts.reg === $.REG_PTR) {
                    program.addCommand(
                        $.CMD_ADD, $.T_NUM_G, $.REG_PTR, $.T_NUM_C, opts.identifier.getOffset()
                    );
                } else {
                    program.addCommand(
                        $.CMD_ADD, $.T_NUM_G, $.REG_PTR, $.T_NUM_C, opts.identifier.getOffset(),
                        $.CMD_SET, $.T_NUM_G, opts.reg,  $.T_NUM_G, $.REG_PTR
                   );
               }
            } else if (opts.identifier.getPointer() && (opts.identifier.getType().type === t.LEXEME_STRING)) {
                helper.setReg(this._program, $.REG_PTR, $.T_NUM_C, opts.identifier.getOffset());
                // If it's a "with" field then the offset is relative to the pointer on the stack not to the stack register itself!
                if (!opts.identifier.getGlobal() && (opts.identifier.getWithOffset() === null)) {
                    helper.addToReg(this._program, $.REG_PTR, $.T_NUM_G, $.REG_STACK);
                }
                program.addCommand($.CMD_SET, $.T_NUM_G, opts.reg, $.T_NUM_P, 0);
            } else {
                result.dataSize = opts.identifier.getTotalSize();
                helper.setReg(this._program, opts.reg, $.T_NUM_C, opts.identifier.getOffset());
                if (opts.identifier.getWithOffset() === null) {
                    if (opts.identifier.getPointer() && !opts.forWriting && (opts.identifier.getType().type !== t.LEXEME_NUMBER)) {
                        if (!opts.identifier.getGlobal()) {
                            helper.addToReg(this._program, opts.reg, $.T_NUM_G, $.REG_STACK);
                        }
                        program.addCommand(
                            $.CMD_SET, $.T_NUM_G, $.REG_PTR, $.T_NUM_G, opts.reg,
                            $.CMD_SET, $.T_NUM_G, opts.reg,  $.T_NUM_P, 0
                        );
                    } else if (!opts.identifier.getGlobal()) {
                        helper.addToReg(this._program, opts.reg, $.T_NUM_G, $.REG_STACK);
                    }
                }
            }
            result.type = opts.identifier;
        }
        if (opts.identifier && opts.identifier.getArraySize && opts.identifier.getArraySize()) {
            result.fullArrayAddress = false;
        }
        return result;
    }

    /**
     * Check if it's a method call.
     * If so then create a stack entry and save the self pointer on the stack.
    **/
    compileMethodCallSelfPointer(opts) {
        if ((opts.selfPointerStackOffset !== false) || !this.getMakeMethodCall(opts.identifier)) {
            return;
        }
        // It's a method call...
        this._scope.incStackOffset();
        // Save the self pointer of the object on the stack.
        // This value is passed to CompileCall.compile from the compileProcCall method in this class.
        if (this._selfPointerStackOffset === false) {
            this._scope.incStackOffset();
            this._selfPointerStackOffset = this._scope.getStackOffset();
        }
        helper.saveSelfPointerToLocal(this._program, this._selfPointerStackOffset, opts.reg);
    }

    compileAddFieldOffsetToReg(opts) {
        let program = this._program;
        if ((opts.identifier.getOffset() !== 0)  && !opts.typePointer) {
            if (opts.saveSelfPointer) {
                helper.saveSelfPointerToLocal(program, opts.selfPointerStackOffset, opts.reg);
                opts.saveSelfPointer = false;
            }
            helper.addToReg(this._program, opts.reg, $.T_NUM_C, opts.identifier.getOffset());
        }
        if (opts.identifier.getPointer()) {
            if (opts.saveSelfPointer) {
                helper.saveSelfPointerToLocal(program, opts.selfPointerStackOffset, opts.reg);
            }
            // It's a pointer like: number ^n
            // When writing the last field then we don't dereference the pointer...
            if (!opts.forWriting || (opts.index + 1 < opts.expression.tokens.length)) {
                opts = this.compileDerefecencePointer(opts);
            }
        } else if (opts.typePointer) {
            // It's a pointer like: ^RecordType r
            // When writing the last field then we don't dereference the pointer...
            if (!opts.forWriting || (opts.index < opts.expression.tokens.length)) {
                if (opts.reg !== $.REG_PTR) {
                    program.addCommand($.CMD_SET, $.T_NUM_G, $.REG_PTR, $.T_NUM_G, opts.reg);
                }
                if (opts.dereferencedPointer) {
                    opts.dereferencedPointer = false;
                    program.addCommand($.CMD_ADD, $.T_NUM_G, $.REG_PTR, $.T_NUM_C, opts.identifier.getOffset());
                    opts.saveSelfPointer && helper.saveSelfPointerToLocal(program, opts.selfPointerStackOffset, opts.reg);
                } else if (opts.selfPointerStackOffset === false) {
                    program.addCommand($.CMD_SET, $.T_NUM_G, $.REG_PTR, $.T_NUM_P, 0);
                    opts.saveSelfPointer && helper.saveSelfPointerToLocal(program, opts.selfPointerStackOffset, opts.reg);
                    program.addCommand($.CMD_ADD, $.T_NUM_G, $.REG_PTR, $.T_NUM_C, opts.identifier.getOffset());
                } else {
                    program.addCommand($.CMD_SET, $.T_NUM_G, $.REG_PTR, $.T_NUM_P, 0);
                    opts.saveSelfPointer && helper.saveSelfPointerToLocal(program, opts.selfPointerStackOffset, opts.reg);
                    program.addCommand($.CMD_ADD, $.T_NUM_G, $.REG_PTR, $.T_NUM_C, opts.identifier.getOffset());
                }
                if (opts.reg !== $.REG_PTR) {
                    program.addCommand($.CMD_SET, $.T_NUM_G, opts.reg, $.T_NUM_G, $.REG_PTR);
                }
            } else if (opts.forWriting) {
                opts = this.compileDerefecencePointer(opts);
            }
        } else if (opts.saveSelfPointer) {
            helper.saveSelfPointerToLocal(program, opts.selfPointerStackOffset, opts.reg);
        }
        return opts;
    }

    /**
     * Compile a record or array or combination of both...
    **/
    compileComplexTypeToRegister(opts, result) {
        let program = this._program;
        opts.lastToken = opts.expression.tokens.length - 1;
        while (opts.index <= opts.lastToken) {
            opts.token = opts.expression.tokens[opts.index];
            if (opts.identifier.getType) {
                this.setLastRecordType(opts.identifier.getType().type);
            }
            // Check if it's an object, a method call and if the self pointer needs to be saved on the stack...
            this.compileMethodCallSelfPointer(opts);
            if (opts.token.cls === t.TOKEN_BRACKET_OPEN) {
                result.arrayIndex = true;
                opts              = this.compileArrayIndex(opts, result);
            } else if ((opts.token.cls === t.TOKEN_PARENTHESIS_OPEN) && (opts.identifier instanceof Proc)) {
                this.compileProcCall(opts, result);
                helper.setStackOffsetToPtr(program, this._scope);
                opts.identifierType = {type: t.LEXEME_NUMBER, typePointer: false};
            } else if ((opts.token.cls === t.TOKEN_PARENTHESIS_OPEN) && (opts.identifier.getType().type === t.LEXEME_PROC)) {
                opts.callMethod = true;
                this.compileProcCall(opts, result);
                helper.setStackOffsetToPtr(program, this._scope);
                opts.identifierType = {type: t.LEXEME_NUMBER, typePointer: false};
                result.type         = t.LEXEME_NUMBER;
            } else if (opts.token.cls !== t.TOKEN_DOT) {
                throw errors.createError(err.SYNTAX_ERROR_DOT_EXPECTED, opts.token, '"." Expected got "' + opts.token.lexeme + '".');
            } else {
                helper.assertRecord(opts);
                this.setLastRecordType(opts.identifier.getType().type);
                opts.index++;
                opts.saveSelfPointer = (opts.selfPointerStackOffset !== false) && (opts.index === opts.lastToken);
                opts.typePointer     = opts.identifierType.typePointer;
                opts.identifier      = this.getFieldFromIndexToken(opts); // Get the next field from the expression...
                if (opts.identifier.getType().type instanceof Record) {
                    this.setLastRecordType(opts.identifier.getType().type);
                } else if (opts.identifier.getType().type === t.LEXEME_PROC) {
                    this._lastProcField = opts.identifier.getProc();
                }
                opts                 = this.compileAddFieldOffsetToReg(opts);
                opts.identifierType  = opts.identifier.getType();
                result.dataSize      = opts.identifier.getTotalSize();
                result.type          = opts.identifier;
            }
            opts.index++;
        }
        return result;
    }

    compileExpressionToRegister(opts) {
        opts.selfPointerStackOffset  = ('selfPointerStackOffset' in opts) ? opts.selfPointerStackOffset : false;
        opts.forWriting              = !!opts.forWriting;
        opts.index                   = 1;
        opts.identifierType          = null;
        opts.token                   = null;
        this._lastRecordType         = null;
        this._lastProcField          = null;
        this._selfPointerStackOffset = false;
        this._methodCall             = opts.expression.tokens[opts.expression.tokens.length - 1].is(t.LEXEME_PARENTHESIS_CLOSE);
        let program = this._program;
        let scope   = this._scope;
        let result  = {type: t.LEXEME_NUMBER, fullArrayAddress: true};
        if (opts.expression.tokens.length === 1) {
            return this.compileSingleTokenToRegister(opts, result);
        }
        if (opts.identifier instanceof Proc) {
            opts.identifierType = {type: t.LEXEME_NUMBER, typePointer: false};
        } else {
            helper.assertIdentifier(opts.identifier, opts.expression);
            opts.identifierType = opts.identifier.getType();
            this.setLastRecordType(opts.identifierType.type);
            helper.setReg(this._program, opts.reg, $.T_NUM_C, opts.identifier.getOffset());
            // If it's a "with" field then the offset is relative to the pointer on the stack not to the stack register itself!
            if (opts.identifier.getWithOffset() !== null) {
                helper.addToReg(this._program, opts.reg, $.T_NUM_L, opts.identifier.getWithOffset());
            } else if (!opts.identifier.getGlobal()) {
                helper.addToReg(this._program, opts.reg, $.T_NUM_G, $.REG_STACK);
            }
            if (opts.identifier.getPointer()) {
                if (opts.reg !== $.REG_PTR) {
                    program.addCommand($.CMD_SET, $.T_NUM_G, $.REG_PTR, $.T_NUM_G, opts.reg);
                }
                program.addCommand($.CMD_SET, $.T_NUM_G, opts.reg, $.T_NUM_P, 0);
                opts.dereferencedPointerForWriting = opts.forWriting;
            }
        }
        result.type = opts.identifier;
        if ((opts.selfPointerStackOffset === false) && this.getMakeMethodCall(opts.identifier)) {
            // It's a method call...
            scope.incStackOffset();
            // Save the self pointer of the object on the stack.
            // This value is passed to CompileCall.compile from the compileProcCall method in this class.
            this._selfPointerStackOffset = scope.getStackOffset();
            helper.saveSelfPointerToLocal(program, this._selfPointerStackOffset, opts.reg);
        }
        result = this.compileComplexTypeToRegister(opts, result);
        if (this._selfPointerStackOffset !== false) {
            scope.decStackOffset();
        }
        return result;
    }
};
