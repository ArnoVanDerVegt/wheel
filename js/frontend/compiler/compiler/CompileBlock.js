/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher           = require('../../lib/dispatcher').dispatcher;
const errors               = require('../errors');
const err                  = require('../errors').errors;
const t                    = require('../tokenizer/tokenizer');
const VarExpression        = require('../expression/VarExpression').VarExpression;
const AssignmentExpression = require('../expression/AssignmentExpression');
const Record               = require('../types/Record').Record;
const Proc                 = require('../types/Proc').Proc;
const Var                  = require('../types/Var').Var;
const CompileScope         = require('./CompileScope').CompileScope;
const CompileCall          = require('./CompileCall').CompileCall;
const CompileVars          = require('./CompileVars').CompileVars;

let keywordCompiler = null;

class CompileBlock extends CompileScope {
    constructor(opts) {
        super(opts);
        if (!keywordCompiler) {
            keywordCompiler = {};
            keywordCompiler[t.LEXEME_NAMESPACE] = require('../keyword/CompileNamespace').CompileNamespace;
            keywordCompiler[t.LEXEME_PROC     ] = require('../keyword/CompileProc'     ).CompileProc;
            keywordCompiler[t.LEXEME_RECORD   ] = require('../keyword/CompileRecord'   ).CompileRecord;
            keywordCompiler[t.LEXEME_OBJECT   ] = require('../keyword/CompileObjct'    ).CompileObjct;
            keywordCompiler[t.LEXEME_ADDR     ] = require('../keyword/CompileAddr'     ).CompileAddr;
            keywordCompiler[t.LEXEME_MOD      ] = require('../keyword/CompileModule'   ).CompileModule;
            keywordCompiler[t.LEXEME_FOR      ] = require('../keyword/CompileFor'      ).CompileFor;
            keywordCompiler[t.LEXEME_WHILE    ] = require('../keyword/CompileWhile'    ).CompileWhile;
            keywordCompiler[t.LEXEME_REPEAT   ] = require('../keyword/CompileRepeat'   ).CompileRepeat;
            keywordCompiler[t.LEXEME_BREAK    ] = require('../keyword/CompileBreak'    ).CompileBreak;
            keywordCompiler[t.LEXEME_RET      ] = require('../keyword/CompileRet'      ).CompileRet;
            keywordCompiler[t.LEXEME_IF       ] = require('../keyword/CompileIf'       ).CompileIf;
            keywordCompiler[t.LEXEME_SELECT   ] = require('../keyword/CompileSelect'   ).CompileSelect;
            keywordCompiler[t.LEXEME_WITH     ] = require('../keyword/CompileWith'     ).CompileWith;
            keywordCompiler[t.LEXEME_SUPER    ] = require('../keyword/CompileSuper'    ).CompileSuper;
        }
    }

    checkRestTokens(iterator, after) {
        let restTokens = iterator.nextUntilLexeme([t.LEXEME_NEWLINE]);
        if (restTokens.tokens.length) {
            throw errors.createError(err.UNEXPECTED_CODE_AFTER_META, restTokens.tokens[0], 'Unexpected code after "#' + after + '".');
        }
    }

    compileMeta(iterator, token) {
        switch (token.lexeme) {
            case '#break':
                // Ignore...
                break;
            case '#project':
                token = iterator.skipWhiteSpace().next();
                if (token.cls === t.TOKEN_STRING) {
                    this._program.setTitle(token.lexeme.substr(1, token.lexeme.length - 2));
                } else {
                    throw errors.createError(err.STRING_CONSTANT_EXPECTED, token, 'String constant expected.');
                }
                this.checkRestTokens(iterator, 'project');
                break;
            case '#display':
                token = iterator.skipWhiteSpace().next();
                if (token.cls === t.TOKEN_STRING) {
                    token.lexeme.substr(1, token.lexeme.length - 2).split(',').forEach((name) => {
                        dispatcher.dispatch('Simulator.ShowPluginByName', name.trim());
                    });
                } else {
                    throw errors.createError(err.STRING_CONSTANT_EXPECTED, token, 'String constant expected.');
                }
                this.checkRestTokens(iterator, 'display');
                break;
            case '#optimizer':
                token = iterator.skipWhiteSpace().next();
                if (token.cls === t.TOKEN_STRING) {
                    if (['"on"', '"off"'].indexOf(token.lexeme) === -1) {
                        throw errors.createError(err.ON_OR_OFF_EXPECTED, token, '"on" or "off" expected.');
                    } else {
                        this._program.setOptimize(token.lexeme === '"on"');
                    }
                } else {
                    throw errors.createError(err.STRING_CONSTANT_EXPECTED, token, 'String constant expected.');
                }
                this.checkRestTokens(iterator, 'optimizer');
                break;
            case '#rangecheck':
                token = iterator.skipWhiteSpace().next();
                if (token.cls === t.TOKEN_STRING) {
                    if (['"on"', '"off"'].indexOf(token.lexeme) === -1) {
                        throw errors.createError(err.ON_OR_OFF_EXPECTED, token, '"on" or "off" expected.');
                    } else {
                        this._compiler.setRangeCheck(token.lexeme === '"on"');
                    }
                } else {
                    throw errors.createError(err.STRING_CONSTANT_EXPECTED, token, 'String constant expected.');
                }
                this.checkRestTokens(iterator, 'optimizer');
                break;
            case '#heap':
                token = iterator.skipWhiteSpace().next();
                if (token.cls === t.TOKEN_NUMBER) {
                    this._program.setHeap(Math.round(token.value));
                } else {
                    throw errors.createError(err.NUMBER_CONSTANT_EXPECTED, token, 'Number constant expected.');
                }
                this.checkRestTokens(iterator, 'heap');
                break;
            case '#stringlength':
                token = iterator.skipWhiteSpace().next();
                if (token.cls !== t.TOKEN_NUMBER) {
                    throw errors.createError(err.NUMBER_CONSTANT_EXPECTED, token, 'Number constant expected.');
                }
                if ((token.value <= 0) || (token.value > 127)) {
                    throw errors.createError(err.INVALID_STRING_LENGTH, token, 'Invalid string length.');
                }
                this._program.setStringLength(token.value);
                break;
            case '#stringcount':
                token = iterator.skipWhiteSpace().next();
                if (token.cls !== t.TOKEN_NUMBER) {
                    throw errors.createError(err.NUMBER_CONSTANT_EXPECTED, token, 'Number constant expected.');
                }
                if (token.value < 0) {
                    throw errors.createError(err.INVALID_STRING_COUNT, token, 'Invalid string count.');
                }
                this._program.setStringCount(token.value);
                this.checkRestTokens(iterator, 'stringcount');
                break;
            default:
                throw errors.createError(err.UNDEFINED_META_COMMAND, token, 'Undefined meta command.');
        }
    }

    compileBlock(iterator, endStatements) {
        let compiler = this._compiler;
        let program  = this._program;
        let scope    = this._scope;
        let end      = false;
        let token    = null;
        let opts     = {compiler: compiler, program: program, scope: scope};
        let identifier;
        compiler.incDepth();
        while (!end && !iterator.finished()) {
            token = iterator.skipWhiteSpace().next();
            // Check if the token belongs to the next file, if so then reset the namespace to the root.
            compiler.getNamespace().checkCurrentFileIndex(token);
            program.nextBlockId(token, scope);
            if (token.lexeme === t.LEXEME_SELF) {
                if (!scope.getSelf) {
                    throw errors.createError(err.SYNTAX_ERROR, token, 'Syntax error.');
                } else {
                    identifier = scope.getSelf();
                }
            } else {
                identifier = null;
            }
            switch (token.cls) {
                case t.TOKEN_TYPE:
                    new CompileVars(opts).compile(token.lexeme, false, iterator);
                    break;
                case t.TOKEN_KEYWORD:
                    if (token.is(t.LEXEME_END) || (endStatements && (endStatements.indexOf(token.lexeme) !== -1))) {
                        end = true;
                    } else if (keywordCompiler[token.lexeme]) {
                        new keywordCompiler[token.lexeme](opts).compile(iterator);
                    } else {
                        throw errors.createError(err.SYNTAX_ERROR, token, 'Syntax error.');
                    }
                    break;
                case t.TOKEN_POINTER:
                    identifier = scope.findIdentifier(iterator.skipWhiteSpace().next().lexeme);
                    if (identifier instanceof Record) {
                        new CompileVars(opts).compile(identifier, true, iterator);
                    } else {
                        throw errors.createError(err.SYNTAX_ERROR, token, 'Syntax error.');
                    }
                    break;
                case t.TOKEN_META:
                    this.compileMeta(iterator, token);
                    break;
                case t.TOKEN_IDENTIFIER:
                    if (identifier === null) {
                        identifier = scope.findIdentifier(token.lexeme);
                    }
                    if (identifier && !(identifier instanceof Proc)) {
                        if (identifier instanceof Record) {
                            new CompileVars(opts).compile(identifier, false, iterator);
                        } else {
                            iterator.setIndexToToken(token);
                            let isProcCall     = false;
                            let destExpression = iterator.nextUntilLexeme([t.LEXEME_NEWLINE, t.LEXEME_ASSIGN]);
                            if (identifier.getType().type === t.LEXEME_PROC) {
                                isProcCall = (destExpression.lastToken.cls !== t.TOKEN_ASSIGNMENT_OPERATOR);
                            } else if (identifier.getType().type instanceof Record) {
                                isProcCall = AssignmentExpression.checkType(identifier.getType().type, destExpression).procCall;
                            }
                            iterator.setIndexToToken(token);
                            if (isProcCall) {
                                let procExpression = iterator.nextUntilTokenCls([t.TOKEN_PARENTHESIS_OPEN]);
                                iterator.setIndexToToken(procExpression.lastToken);
                                new CompileCall(opts).compile({
                                    iterator:       iterator,
                                    proc:           t.LEXEME_PROC,
                                    procExpression: procExpression,
                                    procIdentifier: identifier
                                });
                            } else {
                                destExpression = iterator.nextUntilLexeme([
                                    t.LEXEME_NEWLINE,
                                    t.LEXEME_ASSIGN,
                                    t.LEXEME_ASSIGN_ADD,
                                    t.LEXEME_ASSIGN_SUB,
                                    t.LEXEME_ASSIGN_MUL,
                                    t.LEXEME_ASSIGN_DIV
                                ]);
                                let sourceExpression = iterator.nextUntilLexeme([t.LEXEME_NEWLINE]);
                                new AssignmentExpression.AssignmentExpression({
                                    compiler: this._compiler,
                                    program:  this._program,
                                    scope:    scope
                                }).compile(destExpression, sourceExpression);
                            }
                        }
                    } else {
                        let proc = scope.findProc(token.lexeme);
                        if (proc) {
                            new CompileCall(opts).compile({
                                iterator:       iterator,
                                proc:           proc,
                                procExpression: null
                            });
                        } else {
                            throw errors.createError(err.UNDEFINED_IDENTIFIER, token, 'Undefined identifier "' + token.lexeme + '".');
                        }
                    }
                    break;
            }
        }
        compiler.decDepth();
        return token;
    }
}

exports.CompileBlock = CompileBlock;
