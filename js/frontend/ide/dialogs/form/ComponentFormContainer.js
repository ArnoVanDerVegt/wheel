/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
let Win = class {
        constructor(opts) {
            this._uiId       = opts.uiId;
            this._components = [];
        }

        getUiId() {
            return this._uiId;
        }

        remove() {
            let components = this._components;
            while (components.length) {
                components.pop().remove();
            }
        }

        addComponent(component) {
            this._components.push(component);
        }
    };

exports.ComponentFormContainer = class {
    constructor() {
        this._nextUiId = 10240;
        this._forms    = {};
    }

    getNextUiId() {
        let uiId = this._nextUiId;
        this._nextUiId++;
        return uiId;
    }

    peekUiId() {
        return this._nextUiId;
    }

    addWindow() {
        let uiId = this.getNextUiId();
        let win  = new Win({uiId: uiId});
        this._forms[uiId] = win;
        return win;
    }

    removeWindow(uiId) {
        let win = this._forms[uiId];
        if (!win) {
            return;
        }
        win.remove();
        delete this._forms[uiId];
    }
};
