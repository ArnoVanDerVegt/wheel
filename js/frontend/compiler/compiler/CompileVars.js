/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $              = require('../../program/commands');
const errors         = require('../errors');
const err            = require('../errors').errors;
const t              = require('../tokenizer/tokenizer');
const Proc           = require('../types/Proc').Proc;
const Record         = require('../types/Record').Record;
const Var            = require('../types/Var');
const CompileCall    = require('./CompileCall').CompileCall;
const compileData    = require('./CompileData').compileData;
const VarExpression  = require('../expression/VarExpression').VarExpression;
const MathExpression = require('../expression/MathExpression').MathExpression;

exports.CompileVars = class {
    constructor(opts) {
        this._compiler      = opts.compiler;
        this._program       = opts.program;
        this._scope         = opts.scope;
        this._varExpression = new VarExpression(opts);
    }

    compileConstantData(vr, data, token) {
        let program = this._program;
        if (vr.getGlobal()) {
            program.addConstant({offset: vr.getOffset(), data: data});
        } else {
            let dataVar = this._scope.getParentScope().addVar(null, '!' + vr.getName(), t.LEXEME_NUMBER, data.length);
            program
                .addConstant({offset: dataVar.getOffset(), data: data})
                .addCommand(
                    $.CMD_SET, $.T_NUM_G, $.REG_SRC,  $.T_NUM_C, dataVar.getOffset(),
                    $.CMD_SET, $.T_NUM_G, $.REG_DEST, $.T_NUM_G, $.REG_STACK
                );
            if (vr.getOffset() !== 0) {
                program.addCommand($.CMD_ADD, $.T_NUM_G, $.REG_DEST, $.T_NUM_C, vr.getOffset());
            }
            program
                .addCommand($.CMD_COPY, 0, 0, $.T_NUM_C, data.length)
                .nextBlockId(token, this._scope);
        }
    }

    compileNumberArrayConstant(iterator, arraySize, vr) {
        let program = this._program;
        let token   = iterator.skipWhiteSpace().next();
        if (token.cls !== t.TOKEN_BRACKET_OPEN) {
            throw errors.createError(err.SYNTAX_ERROR_BRACKET_OPEN_EXPECTED, token, '"[" Expected.');
        }
        let data = [];
        compileData.readArrayToData(iterator, vr, data);
        this.compileConstantData(vr, data, token);
        token = iterator.skipWhiteSpaceWithoutNewline().next();
        return token.is(t.LEXEME_NEWLINE);
    }

    compileStringArrayConstant(iterator, arraySize, vr) {
        let program = this._program;
        let token   = iterator.skipWhiteSpace().next();
        let data    = [];
        compileData.readArrayToData(iterator, vr, data);
        for (let i = 0; i < data.length; i++) {
            data[i] = program.addConstantString(data[i]);
        }
        this.compileConstantData(vr, data, token);
        return iterator.skipWhiteSpaceWithoutNewline().next().is(t.LEXEME_NEWLINE);
    }

    compileRecordArrayConstant(iterator, arraySize, vr) {
        let program = this._program;
        let token   = iterator.skipWhiteSpace().next();
        if (token.cls !== t.TOKEN_BRACKET_OPEN) {
            throw errors.createError(err.SYNTAX_ERROR_BRACKET_OPEN_EXPECTED, token, '"[" Expected.');
        }
        let data = [];
        compileData.readArrayToData(iterator, vr, data);
        this.compileConstantData(vr, data, token);
        return iterator.next().is(t.LEXEME_NEWLINE);
    }

    compileRecordConstant(iterator, arraySize, vr) {
        let program = this._program;
        let token   = iterator.skipWhiteSpace().next(); // Skip "{"
        if ((token.cls === t.TOKEN_NUMBER) || (token.cls === t.TOKEN_STRING)) {
            throw errors.createError(err.INVALID_CONSTANT, token, 'Invalid constant.');
        } else if (token.cls !== t.TOKEN_CURLY_OPEN) {
            throw errors.createError(err.SYNTAX_ERROR, token, 'Syntax error.');
        }
        let data    = [];
        compileData.readRecordToData(iterator, vr.getType(), data);
        this.compileConstantData(vr, data, token);
        return iterator.skipWhiteSpaceWithoutNewline().next().is(t.LEXEME_NEWLINE);
    }

    compileNumberConstant(vr, value) {
        let program = this._program;
        if (vr.getGlobal()) {
            program.addConstant({offset: vr.getOffset(), data: [value]});
        } else {
            program.addCommand($.CMD_SET, $.T_NUM_L, vr.getOffset(), $.T_NUM_C, value);
        }
    }

    compileStringAllocation(lastToken) {
        let stringsAdded = this._scope.getStringsAdded();
        if (!stringsAdded.length) {
            return;
        }
        let program       = this._program;
        let scope         = this._scope;
        let lastArraySize = null;
        program.nextBlockId(lastToken, scope);
        stringsAdded.forEach(
            function(stringAdded) {
                if (stringAdded.done) {
                    return;
                }
                let tempVarIndex = scope.getTempVarIndex();
                let arraySize    = (stringAdded.arraySize === false) ? 1 : stringAdded.arraySize;
                if (arraySize !== lastArraySize) {
                    lastArraySize = arraySize;
                    program.addCommand($.CMD_SET, $.T_NUM_G, $.REG_SRC, $.T_NUM_C, arraySize);
                }
                scope.addStringsAddedCount(arraySize);
                program.addCommand(
                    $.CMD_SET, $.T_NUM_G, $.REG_PTR, $.T_NUM_C, stringAdded.offset,
                    $.CMD_MOD, $.T_NUM_C, 10,        $.T_NUM_C, 0 // STRING_ALLOCATE_STRING
                );
                if (typeof stringAdded.constant === t.LEXEME_STRING) {
                    program.addCommand(
                        $.CMD_SETS, $.T_NUM_L, stringAdded.offset, $.T_NUM_C, program.addConstantString(stringAdded.constant)
                    );
                }
                stringAdded.done = true;
            },
            this
        );
    }

    compileStringRelease(token) {
        let scope        = this._scope;
        let stringsAdded = scope.getStringsAdded();
        if (!stringsAdded.length) {
            return;
        }
        let program = this._program;
        program
            .nextBlockId(token, scope)
            .addCommand(
                $.CMD_SET, $.T_NUM_G, $.REG_SRC, $.T_NUM_C, scope.getStringsAddedCount(),
                $.CMD_MOD, $.T_NUM_C, 10,        $.T_NUM_C, 2 // STRING_RELEASE_STRING
            );
    }

    compileExpressionTokensToStack(tokens) {
        let program            = this._program;
        let scope              = this._scope;
        let mathExpressionNode = new MathExpression({
                varExpression: this._varExpression,
                compiler:      this._compiler,
                program:       program,
                scope:         scope
            }).compile({tokens: tokens}, this._compiler.getPass());
        let varExpression      = new VarExpression({compiler: this._compiler, program: program, scope: this._scope});
        if (mathExpressionNode.getValue()) {
            if (tokens[0].cls === t.TOKEN_NUMBER) {
                program.addCommand($.CMD_SET, $.T_NUM_L, scope.getStackOffset(), $.T_NUM_C, tokens[0].value);
            } else {
                varExpression.compileExpressionToRegister(scope.findIdentifier(tokens[0].lexeme), {tokens: tokens}, $.REG_PTR);
                program.addCommand($.CMD_SET, $.T_NUM_L, scope.getStackOffset(), $.T_NUM_P, 0);
            }
        } else {
            mathExpressionNode.compile(t.LEXEME_NUMBER);
        }
    }

    compileSingleConstant(program, iterator, vr) {
        let expression = iterator.nextUntilLexeme([t.LEXEME_NEWLINE, t.LEXEME_COMMA, t.LEXEME_ASSIGN]);
        let token      = expression.tokens[0];
        switch (vr.getType()) {
            case t.LEXEME_NUMBER:
                if ((expression.tokens.length === 1) && (token.cls === t.TOKEN_NUMBER)) {
                    this.compileNumberConstant(vr, token.value);
                } else {
                    if ((expression.tokens.length === 1) && (token.cls === t.TOKEN_STRING)) {
                        throw errors.createError(err.NUMBER_CONSTANT_EXPECTED, token, 'Number constant expected.');
                    }
                    if (this._scope.getGlobal()) {
                        throw errors.createError(err.INVALID_CONSTANT_IN_SCOPE, token, 'Invalid constant value in scope.');
                    }
                    this.compileExpressionTokensToStack(expression.tokens);
                    this._program.addCommand($.CMD_SET, $.T_NUM_L, vr.getOffset(), $.T_NUM_L, this._scope.getStackOffset());
                }
                break;
            case t.LEXEME_STRING:
                if (token.cls === t.TOKEN_STRING) {
                    if (this._scope.getGlobal()) {
                        vr.setStringConstantOffset(program.addConstantString(token.lexeme));
                    } else {
                        let stringsAdded = this._scope.getStringsAdded();
                        stringsAdded[stringsAdded.length - 1].constant = token.lexeme;
                    }
                } else {
                    throw errors.createError(err.STRING_CONSTANT_EXPECTED, token, 'String constant expected.');
                }
                break;
            default:
                throw errors.createError(err.INVALID_CONSTANT, iterator.current(), 'Invalid constant.');
        }
        return expression.lastToken.is(t.LEXEME_NEWLINE);
    }

    compileArraySize(tokens) {
        let arraySize = [];
        let i         = 1;
        while (i < tokens.length) {
            if (tokens[i].cls !== t.TOKEN_BRACKET_OPEN) {
                throw errors.createError(err.SYNTAX_ERROR, tokens[i], 'Syntax error.');
            }
            i++;
            if (i >= tokens.length) {
                throw errors.createError(err.SYNTAX_ERROR, tokens[i], 'Syntax error.');
            }
            if (tokens[i].cls !== t.TOKEN_NUMBER) {
                throw errors.createError(err.NUMBER_CONSTANT_EXPECTED, tokens[2], 'Number constant expected.');
            }
            arraySize.push(tokens[i].value);
            i++;
            if ((i >= tokens.length) || (tokens[i].cls !== t.TOKEN_BRACKET_CLOSE)) {
                throw errors.createError(err.SYNTAX_ERROR, tokens[i], 'Syntax error.');
            }
            i++;
        }
        return Var.getArraySize(arraySize);
    }

    compile(type, iterator) {
        let program = this._program;
        let linter  = this._compiler.getLinter();
        let done    = false;
        let token;
        let vars;
        while (!done) {
            vars = iterator.nextUntilLexeme([t.LEXEME_NEWLINE, t.LEXEME_COMMA, t.LEXEME_ASSIGN]);
            let tokens  = vars.tokens;
            let index   = 0;
            let pointer = false;
            if (tokens[0].cls === t.TOKEN_POINTER) {
                tokens.shift();
                pointer = true;
            }
            let addConst  = (vars.lastToken.lexeme === t.LEXEME_ASSIGN);
            let arraySize = false;
            if ((tokens.length > 1) && (tokens[1].cls === t.TOKEN_BRACKET_OPEN)) {
                arraySize = this.compileArraySize(tokens);
            }
            token = tokens[0];
            linter && linter.addVar(token);
            let scope = this._scope;
            if (!scope.getVarsLocked() && scope.findLocalVar(token.lexeme)) {
                throw errors.createError(err.DUPLICATE_IDENTIFIER, token, 'Duplicate identifier "' + token.lexeme + '".');
            }
            let vr = scope.addVar(token, token.lexeme, type, arraySize, pointer);
            if (addConst) {
                if (type instanceof Record) {
                    if (arraySize === false) {
                        done = this.compileRecordConstant(iterator, arraySize, vr);
                    } else {
                        done = this.compileRecordArrayConstant(iterator, arraySize, vr);
                    }
                } else if (arraySize === false) {
                    done = this.compileSingleConstant(program, iterator, vr);
                } else if (type === t.LEXEME_NUMBER) {
                    done = this.compileNumberArrayConstant(iterator, arraySize, vr);
                } else {
                    done = this.compileStringArrayConstant(iterator, arraySize, vr);
                }
            }
            switch (vars.lastToken.lexeme) {
                case t.LEXEME_NEWLINE: done = true;  break;
                case t.LEXEME_COMMA:   done = false; break;
            }
        }
        this.compileStringAllocation(vars.lastToken);
    }
};
