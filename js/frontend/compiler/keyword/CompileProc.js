/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $            = require('../../program/commands');
const errors       = require('../errors');
const err          = require('../errors').errors;
const t            = require('../tokenizer/tokenizer');
const CompileBlock = require('../compiler/CompileBlock').CompileBlock;
const CompileVars  = require('../compiler/CompileVars').CompileVars;
const CompileObjct = require('../compiler/CompileObjct').CompileObjct;
const Proc         = require('../types/Proc').Proc;
const Record       = require('../types/Record').Record;
const Objct        = require('../types/Objct').Objct;
const Var          = require('../types/Var');

exports.CompileProc = class extends CompileBlock {
    constructor(opts) {
        super(opts);
        this._main            = false;
        this._objct           = null;
        this._startEntryPoint = null;
        this._compileObjct    = null;
    }

    getCompileObjct() {
        if (!this._compileObjct) {
            this._compileObjct = new CompileObjct({
                program: this._program,
                scope:   this._scope
            });
        }
        return this._compileObjct;
    }

    /**
     * Check if the super object has a proc with the same name and if so then check if the parameters are the same.
    **/
    validateSuperProc(token) {
        let scope      = this._scope;
        let vars       = scope.getVars();
        let name       = scope.getName();
        let superObjct = this._objct.getParentScope();
        let superProc  = null;
        while (superObjct) {
            superProc = superObjct.getVarsByName()[name];
            if (superProc) {
                break;
            }
            superObjct = superObjct.getParentScope();
        }
        if (!superProc) {
            return;
        }
        superProc = superProc.getProc();
        if (superProc.getParamCount() !== this._scope.getParamCount()) {
            throw errors.createError(err.PROC_DOES_NOT_MATCH_SUPER_PROC, token, 'Proc does not match super proc declaration.');
        }
        for (let i = 0; i < superProc.getParamCount(); i++) {
            let v1 = superProc.getVars()[3 + i];
            let v2 = vars[3 + i];
            if ((v1.getName() !== v2.getName()) || (v1.getType().type !== v2.getType().type) || (v1.getArraySize() !== v2.getArraySize())) {
                throw errors.createError(err.PROC_DOES_NOT_MATCH_SUPER_PROC, token, 'Proc does not match super proc declaration.');
            }
        }
    }

    compileParameters(iterator) {
        let linter     = this._compiler.getLinter();
        let token      = iterator.skipWhiteSpace().next();
        let parameters = iterator.nextUntilLexeme([t.LEXEME_NEWLINE]);
        let scope      = this._scope;
        let program    = this._program;
        let tokens     = parameters.tokens;
        tokens.pop();
        this._main = false;
        if (scope.getName() === t.LEXEME_MAIN) {
            if (tokens.length) {
                throw errors.createError(err.SYNTAX_ERROR_MAIN_PROC_PARAMS, token, 'Proc "main" should not have parameters');
            }
            if (scope.getParentScope().getEntryPoint() !== null) {
                throw errors.createError(err.MAIN_PROC_ALREADY_DEFINED, token, 'Main proc already defined.');
            }
            scope.getParentScope().setEntryPoint(this._startEntryPoint);
            this._main = true;
            program.setEntryPoint(this._startEntryPoint);
        } else {
            this._compiler.setEventProc(scope.getName(), this._startEntryPoint);
            scope.addVar({
                compiler:    this._compiler,
                unionId:     0,
                token:       null,
                name:        '!____CODE_RETURN____',
                type:        t.LEXEME_NUMBER,
                typePointer: false,
                arraySize:   false
            });
            scope.addVar({
                compiler:    this._compiler,
                unionId:     0,
                token:       null,
                name:        '!____STACK_RETURN____',
                type:        t.LEXEME_NUMBER,
                typePointer: false,
                arraySize:   false
            });
        }
        scope.setEntryPoint(this._startEntryPoint);
        if (this._objct) {
            scope.addVar({
                compiler:    this._compiler,
                unionId:     0,
                token:       null,
                name:        '!____SELF_POINTER____',
                type:        t.LEXEME_NUMBER,
                typePointer: false,
                arraySize:   false
            });
        }
        let index       = 0;
        let expectType  = true;
        let expectComma = false;
        let type        = null;
        let typePointer = false;
        let paramCount  = 0;
        let pointer     = false;
        while (index < tokens.length) {
            token = tokens[index];
            switch (token.cls) {
                case t.TOKEN_TYPE:
                    if (expectType) {
                        type       = token.lexeme;
                        expectType = false;
                    }
                    break;
                case t.TOKEN_POINTER:
                    if (expectType) {
                        typePointer = true;
                    } else {
                        pointer = true;
                    }
                    break;
                case t.TOKEN_IDENTIFIER:
                    if (expectType) {
                        type = scope.findType(token.lexeme);
                        if (type === null) {
                            throw errors.createError(err.UNDEFINED_IDENTIFIER, token, 'Undefined identifier "' + token.lexeme + '".');
                        }
                        expectType = false;
                    } else if (!scope.getVarsLocked() && scope.findLocalVar(token.lexeme)) {
                        throw errors.createError(err.DUPLICATE_IDENTIFIER, token, 'Duplicate identifier "' + token.lexeme + '".');
                    } else {
                        paramCount++;
                        let arraySize = [];
                        let done      = false;
                        while (!done) {
                            if (tokens[index + 1] && (tokens[index + 1].cls === t.TOKEN_BRACKET_OPEN)) {
                                index++;
                                if (!tokens[index + 1] || (tokens[index + 1].cls !== t.TOKEN_NUMBER)) {
                                    throw errors.createError(err.NUMBER_CONSTANT_EXPECTED, token, 'Number constant expected.');
                                }
                                arraySize.push(tokens[index + 1].value);
                                index++;
                                if (!tokens[index + 1] || (tokens[index + 1].cls !== t.TOKEN_BRACKET_CLOSE)) {
                                    throw errors.createError(err.SYNTAX_ERROR_BRACKET_CLOSE_EXPECTED, token, '"]" Expected.');
                                }
                                index++;
                                if (!tokens[index + 1] || (tokens[index + 1].cls !== t.TOKEN_BRACKET_OPEN)) {
                                    done = true;
                                }
                            } else {
                                done = true;
                            }
                        }
                        linter && linter.addParam(token);
                        if (typePointer && !(type instanceof Record)) {
                            throw errors.createError(err.RECORD_OR_OBJECT_TYPE_EXPECTED, token, 'Record or object type expected.');
                        }
                        scope.addVar({
                            compiler:     this._compiler,
                            unionId:      0,
                            token:        token,
                            name:         token.lexeme,
                            type:         type,
                            typePointer:  typePointer,
                            arraySize:    Var.getArraySize(arraySize),
                            pointer:      pointer,
                            ignoreString: true,
                            isParam:      true
                        });
                        typePointer = false;
                        expectComma = true;
                    }
                    pointer = false;
                    break;
                case t.TOKEN_COMMA:
                    expectComma = false;
                    expectType  = true;
                    break;
                default:
                    if (expectType && (token.lexeme === t.LEXEME_PROC)) {
                        type       = t.LEXEME_PROC;
                        expectType = false;
                    }
                    break;
            }
            index++;
        }
        scope.setParamCount(paramCount);
        if (this._objct) {
            this.validateSuperProc(tokens[0]);
        }
    }

    compileInitGlobalVars() {
        let program = this._program;
        this._scope.getParentScope().getVars().forEach((vr) => {
            let stringConstantOffset = vr.getStringConstantOffset();
            if (stringConstantOffset !== null) {
                program.addCommand(
                    $.CMD_SET,  $.T_NUM_G, $.REG_SRC,      $.T_NUM_C, 1,
                    $.CMD_SET,  $.T_NUM_G, $.REG_PTR,      $.T_NUM_C, vr.getOffset(),
                    $.CMD_MOD,  $.T_NUM_C, 10,             $.T_NUM_C, 0, // STRING_ALLOCATE_GLOBAL_STRING
                    $.CMD_SETS, $.T_NUM_G, vr.getOffset(), $.T_NUM_C, vr.getStringConstantOffset()
                );
            }
            if (!vr.getPointer() && !vr.getType().typePointer) {
                this.getCompileObjct().compileConstructorCalls(vr);
            }
        });
        return this;
    }

    compileInitGlobalObjects() {
        this._scope.getParentScope().getRecords().forEach((record) => {
            if (record instanceof Objct) {
                this.getCompileObjct().compileMethodTable(record);
            }
        });
        return this;
    }

    compileProcName(iterator, token) {
        let procNameToken  = token;
        let procName       = token.lexeme;
        let procUsed       = false;
        let objctNameToken = null;
        let objectName     = '';
        this._objct = null;
        if ((iterator.skipWhiteSpace().peek() ? iterator.peek().lexeme : '') === t.LEXEME_DOT) {
            iterator.next();
            objctNameToken = token;
            objectName     = procName;
            let objct = this._scope.findIdentifier(objectName);
            if (objct instanceof Object) {
                this._objct = objct;
            } else {
                throw errors.createError(err.OBJECT_TYPE_EXPECTED, token, 'Object type expected.');
            }
            procNameToken = iterator.skipWhiteSpace().next();
            procName      = (procNameToken === null) ? '' : procNameToken.lexeme;
            procUsed      = true;
        } else {
            procName = this.getNamespacedProcName(procName);
            procUsed = this._compiler.getUseInfo().getUsedProc(procName);
        }
        return {
            objctNameToken: objctNameToken,
            objctName:      objectName,
            nameToken:      procNameToken,
            name:           procName,
            used:           procUsed
        };
    }

    compileMethodSetup(token, procName) {
        let scope = this._scope;
        let objct = this._objct;
        objct
            .addVar({
                compiler:     this._compiler,
                unionId:      0,
                token:        token,
                name:         procName.name,
                type:         t.LEXEME_PROC,
                typePointer:  false,
                arraySize:    false,
                pointer:      false,
                ignoreString: false
            })
            .setProc(scope);
        scope.setMethod(true);
        this._compiler.getUseInfo().addUseMethod(objct.getName());
        // Add self to the with stack...
        scope.setSelf(new Var.Var({
            compiler:    this._compiler,
            unionId:     0,
            offset:      0,
            token:       null,
            name:        '!____SELF_POINTER_RECORD____',
            global:      false,
            type:        scope.pushSelf(objct),
            typePointer: false,
            pointer:     false,
            arraySize:   false
        }).setWithOffset(0));
        // Find the super object proc....
        if (this._objct.getParentScope()) {
            let superProc  = null;
            let superObjct = objct.getParentScope();
            while (superObjct) {
                let varsByName = superObjct.getVarsByName();
                if (procName.name in varsByName) {
                    superProc = varsByName[procName.name].getProc();
                    break;
                }
                superObjct = superObjct.getParentScope();
            }
            scope.setSuper(superProc);
        }
    }

    compileProc(iterator, token) {
        let program  = this._program;
        let linter   = this._compiler.getLinter();
        let procName = this.compileProcName(iterator, token);
        this._startEntryPoint = program.getLength();
        program.setCodeUsed(procName.used); // Only add code when the proc was used...
        linter && linter.addProc(procName);
        this._scope = new Proc(this._scope, procName.name, false, this._compiler.getNamespace())
            .setToken(token)
            .setCodeOffset(this._startEntryPoint);
        if (procName.used instanceof Proc) {
            this._scope.setVarsLocked(procName.used);
        }
        if (this._objct === null) {
            // Check duplicate identifier...
            let identifier = this._scope.getParentScope().findIdentifier(procName.name);
            if ((identifier !== null) && (procName.name !== t.LEXEME_MAIN)) {
                throw errors.createError(err.DUPLICATE_IDENTIFIER, token, 'Duplicate identifier.');
            }
            this._scope.getParentScope().addProc(this._scope);
        }
        this.compileParameters(iterator);
        // Check if it's the main proc...
        if ((token.lexeme === t.LEXEME_MAIN) && (this._compiler.getPass() === 1)) {
            this
                .compileInitGlobalObjects()
                .compileInitGlobalVars();
        }
        // If it's an object then add the proc as method...
        if (this._objct) {
            this.compileMethodSetup(token, procName);
        }
        this.compileBlock(iterator, null);
        if (this._objct) {
            // Remove self from the with stack...
            this._scope.popSelf();
        }
        // Release the allocated strings...
        if (!this._main) {
            new CompileVars({
                compiler: this._compiler,
                program:  this._program,
                scope:    this._scope
            }).compileStringRelease(iterator.current());
            program.addCommand($.CMD_RET, 0, 0, 0, 0);
        }
    }

    compileProcVar(expression, token) {
        if (expression.tokens.length !== 0) {
            return false;
        }
        let linter = this._compiler.getLinter();
        linter && linter.addParam(token);
        this._scope.addVar({
            compiler:    this._compiler,
            unionId:     0,
            token:       token,
            name:        token.lexeme,
            type:        t.LEXEME_PROC,
            typePointer: false,
            arraySize:   false
        });
        return true;
    }

    compile(iterator) {
        let token = iterator.skipWhiteSpace().next();
        if (this._scope instanceof Proc) {
            let procVarExpression = iterator.nextUntilLexeme([t.LEXEME_COMMA, t.LEXEME_NEWLINE]);
            if (this.compileProcVar(procVarExpression, token)) {
                return;
            }
            throw errors.createError(err.NO_LOCAL_PROC_SUPPORTED, token, 'No local proc allowed.');
        }
        this.compileProc(iterator, token);
    }

    getNamespacedProcName(name) {
        return (name === t.LEXEME_MAIN) ? name : (this._compiler.getNamespace().getCurrentNamespace() + name);
    }
};
