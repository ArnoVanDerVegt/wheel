/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $              = require('../../program/commands');
const errors         = require('../errors');
const err            = require('../errors').errors;
const t              = require('../tokenizer/tokenizer');
const MathExpression = require('../expression/MathExpression').MathExpression;
const helper         = require('../expression/helper');
const Record         = require('../types/Record').Record;
const Var            = require('../types/Var').Var;
const Proc           = require('../types/Proc').Proc;
const CompileScope   = require('./CompileScope').CompileScope;
const compileData    = require('./CompileData').compileData;

exports.CompileCall = class CompileCall extends CompileScope {
    constructor(opts) {
        super(opts);
        this._parameterIndex  = 0;
        this._parameterOffset = 2;
    }

    copyParameter(scope, size) {
        this._program.addCommand(
            $.CMD_SET,  $.T_NUM_G, $.REG_SRC,  $.T_NUM_G, $.REG_PTR,
            $.CMD_SET,  $.T_NUM_G, $.REG_DEST, $.T_NUM_G, $.REG_STACK,
            $.CMD_ADD,  $.T_NUM_G, $.REG_DEST, $.T_NUM_C, this.getParameterOffset(scope),
            $.CMD_COPY, 0,         0,          $.T_NUM_C, size
        );
        return this;
    }

    addParameter(scope, size) {
        scope.addStackOffset(size);
        this._parameterIndex++;
    }

    getParameterVr(procVars) {
        return procVars ? procVars[this._parameterIndex] : null;
    }

    getParameterOffset(scope) {
        return scope.getStackOffset() + this._parameterOffset;
    }

    /**
     * Try to find an instance of the Proc type.
     * We need to know if the proc is a method.
    **/
    getProc(token, proc, procExpression, procIdentifier) {
        if (procExpression === t.LEXEME_SUPER) {
            if (!this._scope.getSuper()) {
                throw errors.createError(err.NO_SUPER_PROC_FOUND, token, 'No super proc found.');
            }
            return this._scope.getSuper();
        }
        if (proc instanceof Proc) {
            return proc;
        }
        if ((procIdentifier instanceof Var) && procIdentifier.getAssignedProc()) {
            return procIdentifier.getAssignedProc();
        }
        let program  = this._program;
        let codeUsed = program.getCodeUsed();
        program.setCodeUsed(false);
        this._varExpression.compileExpressionToRegister({
            identifier: procIdentifier,
            expression: procExpression,
            reg:        $.REG_PTR
        });
        program.setCodeUsed(codeUsed);
        return this._varExpression.getLastProcField();
    }

    /**
     * Get the parameter vars from a proc.
     * If the proc is of an unknown type the parse the expression to find the type.
    **/
    getProcVars(proc, procExpression, procIdentifier) {
        if (procExpression === t.LEXEME_SUPER) {
            return this._scope.getSuper().getVars();
        }
        if (proc instanceof Proc) {
            this._compiler.getUseInfo().setUseProc(proc.getName(), proc); // Set the proc as used...
            return proc.getVars();
        }
        return null;
    }

    /**
     * Move the iterator to the "(" lexeme...
    **/
    skipUntilParenthesisOpen(iterator, token) {
        if (token.cls === t.TOKEN_PARENTHESIS_OPEN) {
            return;
        }
        iterator.skipWhiteSpace();
        while (iterator.peek() && (iterator.peek().cls !== t.TOKEN_PARENTHESIS_OPEN)) {
            iterator.skipWhiteSpace();
            iterator.next();
        }
        iterator.next();
    }

    compilePrimitiveParameter(token, address, vr, type, vrOrType) {
        let program = this._program;
        let scope   = this._scope;
        if (!vr) {
            // Unknown proc type, just push parameter to stack...
            program.addCommand($.CMD_SET, $.T_NUM_L, this.getParameterOffset(scope), $.T_NUM_P, 0);
            return false;
        }
        // The type of parameter is known...
        if (vr.getType().type !== type) {
            throw errors.createError(err.PARAM_TYPE_MISMATCH, token, 'Parameter type mismatch.');
        }
        let size = false;
        if (!vr.getArraySize || (vr.getArraySize() === false)) {
            if (address) {
                if (!vr.getPointer()) {
                    throw errors.createError(err.POINTER_TYPE_EXPECTED, token, 'Pointer type expected.');
                }
                program.addCommand($.CMD_SET, $.T_NUM_L, this.getParameterOffset(scope), $.T_NUM_G, $.REG_PTR);
            } else if (type === t.LEXEME_PROC) {
                program.addCommand($.CMD_SET, $.T_NUM_L, this.getParameterOffset(scope), $.T_NUM_G, $.REG_PTR);
            } else {
                program.addCommand($.CMD_SET, $.T_NUM_L, this.getParameterOffset(scope), $.T_NUM_P, 0);
            }
        } else {
            if (!vrOrType.getArraySize || (vrOrType.getArraySize() === false)) {
                throw errors.createError(err.ARRAY_TYPE_EXPECTED, token, 'Array type expected.');
            }
            let arraySize = vr.getArraySize();
            size = arraySize;
            if (((typeof arraySize === 'number') && (arraySize !== vrOrType.getArraySize())) ||
                (JSON.stringify(arraySize) !== JSON.stringify(vrOrType.getArraySize()))) {
                throw errors.createError(err.ARRAY_SIZE_MISMATCH, token, 'Array size mismatch.');
            }
            if (typeof arraySize === 'object') {
                size = 1;
                for (let i = 0; i < arraySize.length; i++) {
                    size *= arraySize[i];
                }
            }
        }
        return size;
    }

    compileParameter(iterator, proc, procVars) {
        let parameterTokens = iterator.nextUntilTokenCls([t.TOKEN_PARENTHESIS_CLOSE, t.TOKEN_COMMA]);
        let tokens          = parameterTokens.tokens;
        let token           = tokens[0];
        let result          = (parameterTokens.lastToken.cls  === t.TOKEN_PARENTHESIS_CLOSE);
        let address         = (parameterTokens.firstToken.cls === t.TOKEN_ADDRESS);
        let scope           = this._scope;
        let program         = this._program.nextBlockId(token, scope);
        let varExpression   = this._varExpression;
        if (address) {
            tokens.shift();
        }
        if (tokens.length === 1) {
            if (tokens[0].cls === t.TOKEN_STRING) {
                program.addCommand($.CMD_SET, $.T_NUM_L, this.getParameterOffset(scope), $.T_NUM_C, program.addConstantString(tokens[0].lexeme));
                this.addParameter(scope, 1);
                return result;
            } else if (tokens[0].lexeme === t.LEXEME_SELF) {
                program.addCommand($.CMD_SET, $.T_NUM_L, this.getParameterOffset(scope), $.T_NUM_L, 0);
                this.addParameter(scope, 1);
                return result;
            }
        }
        // Set the stack offset above the highest parameter for temp variables...
        let stackOffset = scope.getStackOffset();
        scope.addStackOffset(this._parameterOffset);
        let vrOrType;
        let vr                 = this.getParameterVr(procVars);
        let mathExpressionNode = new MathExpression({
                varExpression: this._varExpression,
                compiler:      this._compiler,
                program:       program,
                scope:         scope
            }).compile({tokens: tokens}, this._compiler.getPass());
        let done               = false;
        if (mathExpressionNode.getValue()) {
            vrOrType = varExpression.compileExpressionToRegister({
                identifier: scope.findIdentifier(tokens[0].lexeme),
                expression: {tokens: mathExpressionNode.getValue()},
                reg:        $.REG_PTR
            }).type;
            // If the parameter is a pointer then check if an address or pointer value is given...
            if (vr && vr.getPointer() && !(address || vrOrType.getPointer())) {
                throw errors.createError(err.PARAM_TYPE_MISMATCH, token, 'Parameter type mismatch.');
            }
            // "number" or "string" types don't have a getName function!
            if (vr && vr.getType && vr.getType().type.getName &&
                    vrOrType.getType && vrOrType.getType().type.getName &&
                    (vrOrType.getType().type.getName() !== vr.getType().type.getName())) {
                throw errors.createError(err.PARAM_TYPE_MISMATCH, token, 'Parameter type mismatch.');
            }
            // If it's a pointer in a field used in a "with" statement then dereference the pointer...
            if (vrOrType.getWithOffset && (vrOrType.getWithOffset() !== null) && vrOrType.getPointer && vrOrType.getPointer()) {
                program.addCommand($.CMD_SET, $.T_NUM_G, $.REG_PTR, $.T_NUM_P, 0);
            }
        } else {
            mathExpressionNode.compile(t.LEXEME_NUMBER);
            vrOrType = t.LEXEME_NUMBER;
            done = true;
        }
        scope.setStackOffset(stackOffset); // Restore the stack value!
        if (done) {
            this.addParameter(scope, 1);
            return result;
        }
        let pointer = false;
        let size    = false;
        let type    = helper.getTypeFromIdentifier(vrOrType);
        if ([t.LEXEME_NUMBER, t.LEXEME_PROC, t.LEXEME_STRING].indexOf(type) !== -1) {
            size = this.compilePrimitiveParameter(token, address, vr, type, vrOrType);
        } else {
            if (vr) {
                // The type of parameter is known...
                if (helper.getTypeFromIdentifier(vr) !== helper.getTypeFromIdentifier(vrOrType)) {
                    throw errors.createError(err.PARAM_TYPE_MISMATCH, token, 'Parameter type mismatch.');
                }
                pointer = vr.getPointer();
            }
            if (!address && !pointer) {
                size = vrOrType.getTotalSize();
            }
        }
        if (address || pointer) {
            program.addCommand($.CMD_SET, $.T_NUM_L, this.getParameterOffset(scope), $.T_NUM_G, $.REG_PTR);
        }
        if (!address && (size !== false)) {
            this.copyParameter(scope, size);
        }
        if (vr) {
            this.addParameter(scope, vr.getTotalSize());
        } else {
            this.addParameter(scope, size === false ? 1 : size);
        }
        return result;
    }

    compileConstantArrayParameter(iterator, token, proc, procVars) {
        let done = false;
        let data = [];
        let vr   = this.getParameterVr(procVars);
        if (vr && (vr.getArraySize() === false)) {
            throw errors.createError(err.TYPE_MISMATCH, token, 'Type mismatch.');
        }
        compileData.readArrayToData(iterator, vr, data);
        let program = this._program;
        let scope   = this._scope;
        let dataVar = scope.getParentScope().addVar({
                compiler:    this._compiler,
                token:       null,
                name:        '!_' + iterator.current().index,
                type:        t.LEXEME_NUMBER,
                typePointer: false,
                arraySize:   data.length
            });
        program
            .addConstant({offset: dataVar.getOffset(), data: data})
            .addCommand($.CMD_SET, $.T_NUM_G, $.REG_PTR, $.T_NUM_C, dataVar.getOffset());
        this
            .copyParameter(scope, data.length)
            .addParameter(scope, data.length);
        token = iterator.skipWhiteSpace().next();
        return token && (token.cls === t.TOKEN_PARENTHESIS_CLOSE);
    }

    compileConstantRecordParameter(iterator, token, proc, procVars) {
        let done = false;
        let data = [];
        let vr   = this.getParameterVr(procVars);
        if (vr && !(vr.getType().type instanceof Record)) {
            throw errors.createError(err.TYPE_MISMATCH, token, 'Type mismatch.');
        }
        compileData.readRecordToData(iterator, vr.getType().type, data);
        let program = this._program;
        let scope   = this._scope;
        let dataVar = scope.getParentScope().addVar({
                compiler:    this._compiler,
                token:       null,
                name:        '!_' + iterator.current().index,
                type:        t.LEXEME_NUMBER,
                typePointer: false,
                arraySize:   data.length
            });
        program
            .addConstant({offset: dataVar.getOffset(), data: data})
            .addCommand($.CMD_SET, $.T_NUM_G, $.REG_PTR, $.T_NUM_C, dataVar.getOffset());
        this
            .copyParameter(scope, data.length)
            .addParameter(scope, data.length);
        token = iterator.skipWhiteSpace().next();
        return token && (token.cls === t.TOKEN_PARENTHESIS_CLOSE);
    }

    compile(opts) {
        opts.selfPointerStackOffset = ('selfPointerStackOffset' in opts) ? opts.selfPointerStackOffset : false;
        let iterator                = opts.iterator;
        let proc                    = opts.proc           || null;
        let procExpression          = opts.procExpression || null;
        let procIdentifier          = opts.procIdentifier || null;
        let token                   = iterator.next();
        let program                 = this._program;
        let scope                   = this._scope;
        let callProc;
        let callProcVars;
        let callMethod;
        if (opts.callMethod) {
            // This function is called from VarExpression!
            callProc                = procIdentifier.getProc();
            callProcVars            = procIdentifier.getProc().getVars();
            callMethod              = true;
            proc                    = t.LEXEME_PROC;
        } else {
            callProc                = this.getProc(token, proc, procExpression, procIdentifier);
            callProcVars            = this.getProcVars(callProc, procExpression, procIdentifier);
            callMethod              = callProc && callProc.getMethod();
        }
        let callStackSize           = callMethod ? 3 : 2;
        let returnStackOffset       = scope.getStackOffset();
        let selfPointerStackOffset  = scope.addStackOffset(scope.getTotalSize() + callStackSize).getStackOffset();
        let done                    = false;
        this.skipUntilParenthesisOpen(iterator, token);
        this._parameterIndex  = callStackSize;
        this._parameterOffset = callStackSize;
        while (!done && token) {
            token = iterator.skipWhiteSpace().peek();
            switch (token.cls) {
                case t.TOKEN_PARENTHESIS_CLOSE:
                    token = iterator.next();
                    done  = true;
                    break;
                case t.TOKEN_BRACKET_OPEN:
                    token = iterator.next();
                    done  = this.compileConstantArrayParameter(iterator, token, proc, callProcVars);
                    break;
                case t.TOKEN_CURLY_OPEN:
                    token = iterator.next();
                    done  = this.compileConstantRecordParameter(iterator, token, proc, callProcVars);
                    break;
                case t.TOKEN_PARENTHESIS_OPEN:
                case t.TOKEN_ADDRESS:
                case t.TOKEN_NUMBER:
                case t.TOKEN_STRING:
                case t.TOKEN_IDENTIFIER:
                    done = this.compileParameter(iterator, proc, callProcVars);
                    break;
                default:
                    throw errors.createError(err.SYNTAX_ERROR, token, 'Syntax error.');
            }
        }
        if (callProc && (callProc.getTotalParamCount() !== this._parameterIndex)) {
            throw errors.createError(err.PARAM_COUNT_MISMATCH, token, 'Parameter count mismatch.');
        }
        if (opts.selfPointerStackOffset !== false) {
            program.addCommand($.CMD_SET, $.T_NUM_L, selfPointerStackOffset, $.T_NUM_L, opts.selfPointerStackOffset);
        }
        if (procExpression === t.LEXEME_SUPER) {
            program.addCommand(
                $.CMD_SET,  $.T_NUM_G, $.REG_PTR,                               $.T_NUM_L, 0,
                $.CMD_SET,  $.T_NUM_L, returnStackOffset + scope.getTotalSize() + 3, $.T_NUM_G, $.REG_PTR,
                $.CMD_CALL, $.T_NUM_C, scope.getSuper().getCodeOffset() - 1,    $.T_NUM_C, returnStackOffset + scope.getTotalSize() + 3
            );
        } else if (proc === t.LEXEME_PROC) {
            if (!opts.callMethod) {
                // When callMethod is true then this function is called from VarExpression and the address setup is already done!
                let vrOrType = this._varExpression.compileExpressionToRegister({
                        identifier:             procIdentifier,
                        expression:             procExpression,
                        reg:                    $.REG_PTR,
                        selfPointerStackOffset: selfPointerStackOffset
                    }).type;
            }
            program.addCommand($.CMD_CALL, $.T_NUM_P, 0, $.T_NUM_C, returnStackOffset + scope.getTotalSize() + callStackSize);
        } else {
            program.addCommand($.CMD_CALL, $.T_NUM_C, proc.getEntryPoint() - 1, $.T_NUM_C, returnStackOffset + scope.getTotalSize() + 2);
        }
        scope.setStackOffset(returnStackOffset);
    }
};
