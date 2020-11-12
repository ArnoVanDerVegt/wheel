/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Scope = require('./Scope').Scope;

exports.Proc = class extends Scope {
    constructor(parentScope, name, global, namespace) {
        super(parentScope, name, global, namespace);
        this._method = false;
        this._super  = null;
    }

    getMethod() {
        return this._method;
    }

    setMethod(method) {
        this._method = method;
        return this;
    }

    getSuper() {
        return this._super;
    }

    setSuper(supr) {
        this._super = supr;
        return this;
    }

    /**
     * Return the total parameter count including:
     *     !____CODE_RETURN____'
     *     !____STACK_RETURN____'
     * And when it's a method:
     *     !____SELF_POINTER____'
    **/
    getTotalParamCount() {
        return this._paramCount + (this._method ? 3 : 2);
    }

    pushSelf(record) {
        this._withStack.push(record.getWithRecord(0));
    }

    popSelf() {
        this._withStack.pop();
    }
};
