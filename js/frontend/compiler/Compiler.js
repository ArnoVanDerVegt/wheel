/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const $               = require('../program/commands');
const Program         = require('../program/Program').Program;
const dispatcher      = require('../lib/dispatcher').dispatcher;
const errors          = require('./errors');
const err             = require('./errors').errors;
const tokenizer       = require('./tokenizer/tokenizer');
const Iterator        = require('./tokenizer/TokenIterator').Iterator;
const CompileBlock    = require('./compiler/CompileBlock').CompileBlock;
const compileModule   = require('./keyword/CompileModule');
const SyntaxValidator = require('./syntax/SyntaxValidator').SyntaxValidator;
const Scope           = require('./types/Scope').Scope;

class UseInfo {
    constructor(compiler) {
        this._compiler   = compiler;
        this._useProc    = {main: true};
        this._useModules = [];
    }

    getUsedProc(name) {
        return this._useProc[name];
    }

    setUseProc(name, proc) {
        if (this._compiler.getPass() === 0) {
            this._useProc[name] = proc;
        }
    }

    getUsedModule(module, moduleProc) {
        if (!this._useModules[module]) {
            return false;
        }
        return (this._useModules[module].indexOf(moduleProc) !== -1);
    }

    setUseModule(module, moduleProc) {
        if (!this._useModules[module]) {
            this._useModules[module] = [];
        }
        if (this._useModules[module].indexOf(moduleProc) === -1) {
            this._useModules[module].push(moduleProc);
        }
    }
}

exports.Compiler = class extends CompileBlock {
    constructor(opts) {
        super(opts);
        this._linter     = opts.linter || null;
        this._rangeCheck = true;
    }

    compile(tokens) {
        let iterator    = new Iterator(tokens);
        this._compiler  = this;
        this._program   = new Program(this);
        this._scope     = new Scope(null, 'global', true);
        this._loopStack = [];
        this._scope.setSize($.REG_TO_STR.length);
        this.compileBlock(iterator, null);
        this._program.setGlobalSize(this._scope.getSize());
    }

    buildTokens(tokens) {
        new SyntaxValidator().validate(tokens);
        this._useInfo = new UseInfo(this);
        this._pass    = 0;
        this.compile(tokens);
        dispatcher.dispatch('Compiler.Database', this._scope);
        this._program.reset(this._pass);
        this._pass = 1;
        this.compile(tokens);
        if (this._scope.getEntryPoint() === null) {
            throw errors.createError(err.MISSING_MAIN_PROC, tokens[tokens.length - 1], 'Missing main proc.');
        }
        return this;
    }

    build(source) {
        let t      = new tokenizer.Tokenizer();
        let tokens = t.tokenize(source).getTokens();
        return this.buildTokens(tokens);
    }

    getRangeCheck() {
        return this._rangeCheck;
    }

    setRangeCheck(rangeCheck) {
        this._rangeCheck = rangeCheck;
    }

    getScope() {
        return this._scope;
    }

    getLinter() {
        return (this._pass === 1) ? this._linter : null;
    }

    getPass() {
        return this._pass;
    }

    getUseInfo() {
        return this._useInfo;
    }

    getProgram() {
        return this._program;
    }

    pushLoop(loop) {
        this._loopStack.push(loop);
    }

    popLoop() {
        let loop     = this._loopStack.pop();
        let breaks   = loop.loop.getBreaks();
        let program  = this._program;
        let commands = program.getCommands();
        let index    = commands.length - 1;
        for (let i = 0; i < breaks.length; i++) {
            program.setCommandParamValue2(breaks[i], index);
        }
    }

    getLoop(id) {
        let loopStack = this._loopStack;
        if (!loopStack.length) {
            return null;
        }
        if (id) {
            for (let i = 0; i < loopStack.length; i++) {
                if (loopStack[i].id === id) {
                    return loopStack[i];
                }
            }
            return null;
        }
        return loopStack.length ? loopStack[loopStack.length - 1] : null;
    }
};
