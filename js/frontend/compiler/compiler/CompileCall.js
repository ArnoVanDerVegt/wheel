/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $              = require('../../program/commands');
const errors         = require('../errors');
const err            = require('../errors').errors;
const t              = require('../tokenizer/tokenizer');
const MathExpression = require('../expression/MathExpression').MathExpression;
const Record         = require('../types/Record').Record;
const CompileScope   = require('./CompileScope').CompileScope;
const compileData    = require('./CompileData').compileData;

exports.CompileCall = class CompileCall extends CompileScope {
    constructor(opts) {
        super(opts);
        this._parameterIndex = 0;
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
        return procVars ? procVars[2 + this._parameterIndex] : null;
    }

    getParameterOffset(scope) {
        return scope.getStackOffset() + 2;
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
        if (vr.getType() !== type) {
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
        if ((tokens.length === 1) && (tokens[0].cls === t.TOKEN_STRING)) {
            program.addCommand($.CMD_SET, $.T_NUM_L, this.getParameterOffset(scope), $.T_NUM_C, program.addConstantString(tokens[0].lexeme));
            this.addParameter(scope, 1);
            return result;
        }
        // Set the stack offset above the highest parameter for temp variables...
        let stackOffset = scope.getStackOffset();
        scope.addStackOffset(2);
        let vr                 = this.getParameterVr(procVars);
        let vrOrType;
        let mathExpressionNode = new MathExpression({
                varExpression: this._varExpression,
                compiler:      this._compiler,
                program:       program,
                scope:         scope
            }).compile({tokens: tokens}, this._compiler.getPass());
        let done               = false;
        if (mathExpressionNode.getValue()) {
            vrOrType = varExpression.compileExpressionToRegister(
                scope.findIdentifier(tokens[0].lexeme),
                {tokens: mathExpressionNode.getValue()},
                $.REG_PTR
            ).type;
            // If the parameter is a pointer then check if an address or pointer value is given...
            if (vr && vr.getPointer() && !(address || vrOrType.getPointer())) {
                throw errors.createError(err.PARAM_TYPE_MISMATCH, token, 'Parameter type mismatch.');
            }
            // "number" or "string" types don't have a getName function!
            if (vr && vr.getType && vr.getType().getName &&
                    vrOrType.getType && vrOrType.getType().getName &&
                    (vrOrType.getType().getName() !== vr.getType().getName())) {
                throw errors.createError(err.PARAM_TYPE_MISMATCH, token, 'Parameter type mismatch.');
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
        let size = false;
        let type = varExpression.getTypeFromIdentifier(vrOrType);
        if ([t.LEXEME_NUMBER, t.LEXEME_PROC, t.LEXEME_STRING].indexOf(type) !== -1) {
            size = this.compilePrimitiveParameter(token, address, vr, type, vrOrType);
        } else {
            let pointer = false;
            if (vr) {
                // The type of parameter is known...
                if (varExpression.getTypeFromIdentifier(vr) !== varExpression.getTypeFromIdentifier(vrOrType)) {
                    throw errors.createError(err.PARAM_TYPE_MISMATCH, token, 'Parameter type mismatch.');
                }
                pointer = vr.getPointer();
                if (address || pointer) {
                    program.addCommand($.CMD_SET, $.T_NUM_L, this.getParameterOffset(scope), $.T_NUM_G, $.REG_PTR);
                }
            }
            if (!address && !pointer) {
                size = vrOrType.getTotalSize ? vrOrType.getTotalSize() : vrOrType.getSize();
            }
        }
        if (address) {
            program.addCommand($.CMD_SET, $.T_NUM_L, this.getParameterOffset(scope), $.T_NUM_G, $.REG_PTR);
        } else if (size !== false) {
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
        let dataVar = scope.getParentScope().addVar(null, '!_' + iterator.current().index, t.LEXEME_NUMBER, data.length);
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
        if (vr && !(vr.getType() instanceof Record)) {
            throw errors.createError(err.TYPE_MISMATCH, token, 'Type mismatch.');
        }
        compileData.readRecordToData(iterator, vr.getType(), data);
        let program = this._program;
        let scope   = this._scope;
        let dataVar = scope.getParentScope().addVar(null, '!_' + iterator.current().index, t.LEXEME_NUMBER, data.length);
        program
            .addConstant({offset: dataVar.getOffset(), data: data})
            .addCommand($.CMD_SET, $.T_NUM_G, $.REG_PTR, $.T_NUM_C, dataVar.getOffset());
        this
            .copyParameter(scope, data.length)
            .addParameter(scope, data.length);
        token = iterator.skipWhiteSpace().next();
        return token && (token.cls === t.TOKEN_PARENTHESIS_CLOSE);
    }

    compile(iterator, procExpression, proc, procIdentifier) {
        let procVars          = null;
        let token             = iterator.next();
        let done              = false;
        let scope             = this._scope;
        let returnStackOffset = scope.getStackOffset();
        if (proc === t.LEXEME_PROC) {
            if (procIdentifier.getAssignedProc()) {
                let assignedProc = procIdentifier.getAssignedProc();
                procVars = assignedProc.getVars();
                this._compiler.getUseInfo().setUseProc(assignedProc.getName(), assignedProc); // Set the proc as used...
            }
        } else {
            procVars = proc.getVars();
            this._compiler.getUseInfo().setUseProc(proc.getName(), proc); // Set the proc as used...
        }
        scope.addStackOffset(scope.getSize() + 2);
        this._parameterIndex = 0;
        while (!done && token) {
            token = iterator.skipWhiteSpace().peek();
            switch (token.cls) {
                case t.TOKEN_PARENTHESIS_CLOSE:
                    token = iterator.next();
                    done  = true;
                    break;
                case t.TOKEN_BRACKET_OPEN:
                    token = iterator.next();
                    done  = this.compileConstantArrayParameter(iterator, token, proc, procVars);
                    break;
                case t.TOKEN_CURLY_OPEN:
                    token = iterator.next();
                    done  = this.compileConstantRecordParameter(iterator, token, proc, procVars);
                    break;
                case t.TOKEN_PARENTHESIS_OPEN:
                case t.TOKEN_ADDRESS:
                case t.TOKEN_NUMBER:
                case t.TOKEN_STRING:
                case t.TOKEN_IDENTIFIER:
                    done = this.compileParameter(iterator, proc, procVars);
                    break;
                default:
                    throw errors.createError(err.SYNTAX_ERROR, token, 'Syntax error.');
            }
        }
        if ((proc !== t.LEXEME_PROC) && (proc.getParamCount() !== this._parameterIndex)) {
            throw errors.createError(err.PARAM_COUNT_MISMATCH, token, 'Parameter count mismatch.');
        }
        let program = this._program;
        if (proc === t.LEXEME_PROC) {
            let identifier    = scope.findIdentifier(procExpression.tokens[0].lexeme);
            let varExpression = this._varExpression;
            let vrOrType      = varExpression.compileExpressionToRegister(identifier, procExpression, $.REG_PTR).type;
            program.addCommand($.CMD_CALL, $.T_NUM_P, 0, $.T_NUM_C, returnStackOffset + scope.getSize() + 2);
        } else {
            program.addCommand($.CMD_CALL, $.T_NUM_C, proc.getEntryPoint() - 1, $.T_NUM_C, returnStackOffset + scope.getSize() + 2);
        }
        scope.setStackOffset(returnStackOffset);
    }
};
