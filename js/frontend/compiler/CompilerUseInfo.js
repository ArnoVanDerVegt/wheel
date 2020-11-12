/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.CompilerUseInfo = class {
    constructor(compiler) {
        this._compiler   = compiler;
        this._useProc    = {main: true};
        this._useModules = [];
        this._eventInfo  = {};
        this._objct      = {};
    }

    setEventInfo(eventInfo) {
        this._eventInfo = eventInfo;
        return eventInfo;
    }

    getUsedProc(name) {
        return this._useProc[name] || (name in this._eventInfo);
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

    getUseObjct(objct) {
        return this._objct[objct];
    }

    setUseObjct(objct) {
        if ((this._compiler.getPass() === 0) && !(objct in this._objct)) {
            this._objct[objct] = 0;
        }
    }

    addUseMethod(objct) {
        if ((this._compiler.getPass() === 0) && (objct in this._objct)) {
            this._objct[objct]++;
        }
    }
};
