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
const Objct           = require('./types/Objct').Objct;
const Namespace       = require('./types/Namespace').Namespace;
const CompilerUseInfo = require('./CompilerUseInfo').CompilerUseInfo;

exports.Compiler = class extends CompileBlock {
    constructor(opts) {
        super(opts);
        this._formResources = [];
        this._linter        = opts.linter || null;
        this._rangeCheck    = true;
        this._namespace     = new Namespace({});
        this._eventInfo     = {};
        this._depth         = 0;
        this._objctSize     = {};
    }

    compile(tokens) {
        let iterator = new Iterator({tokens: tokens, compiler: this});
        this._depth     = 0;
        this._compiler  = this;
        this._program   = new Program(this);
        this._scope     = new Scope(null, 'global', true, this._namespace);
        this._loopStack = [];
        this._eventInfo = this._useInfo.setEventInfo(this.getEventInfo());
        this._scope.setSize($.REG_TO_STR.length);
        this._namespace.reset();
        this.compileBlock(iterator, null);
        this._program.setGlobalSize(this._scope.getSize());
    }

    buildTokens(tokens) {
        new SyntaxValidator().validate(tokens);
        let namespaceTokens = this._namespace.compileNamespaces(tokens);
        tokens.length = 0;
        tokens.push.apply(tokens, namespaceTokens);
        this._useInfo = new CompilerUseInfo(this);
        this._pass    = 0;
        this.compile(tokens);
        dispatcher.dispatch('Compiler.Database', this._scope);
        this._program.reset(this._pass);
        this._pass = 1;
        this
            .saveObjctSize()
            .compile(tokens);
        this._program.setEventInfo(this._eventInfo);
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

    saveObjctSize() {
        this._scope.getRecords().forEach((record) => {
            if (record instanceof Objct) {
                this._objctSize[record.getName()] = record.getSize();
            }
        });
        return this;
    }

    incDepth() {
        this._depth++;
    }

    decDepth() {
        this._depth--;
    }

    getDepth() {
        return this._depth;
    }

    setFormResources(formResources) {
        this._formResources = formResources;
        return this;
    }

    getRangeCheck() {
        return this._rangeCheck;
    }

    setRangeCheck(rangeCheck) {
        this._rangeCheck = rangeCheck;
    }

    getNamespace() {
        return this._namespace;
    }

    setNamespace(namespace) {
        this._namespace.setNamespace(namespace);
    }

    getScope() {
        return this._scope;
    }

    getObjctSize(name) {
        return this._objctSize[name] || 0;
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

    getEventInfo() {
        let eventInfo = {};
        this._formResources.forEach((formResource) => {
            let wfrm = formResource.getWFrm();
            if (wfrm) {
                wfrm.forEach((component) => {
                    for (let property in component) {
                        if (property.substr(0, 2) === 'on') {
                            eventInfo[component[property]] = null;
                        }
                    }
                });
            }
        });
        return eventInfo;
    }

    setEventProc(event, offset) {
        if (event in this._eventInfo) {
            this._eventInfo[event] = offset;
        }
    }

    pushLoop(loop) {
        this._loopStack.push(loop);
    }

    popLoop() {
        let program  = this._program;
        if (!program.getCodeUsed()) {
            return;
        }
        let loop     = this._loopStack.pop();
        let breaks   = loop.loop.getBreaks();
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
