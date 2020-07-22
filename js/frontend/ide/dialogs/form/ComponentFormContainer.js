/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
let Win = class {
        constructor(opts) {
            this._uiId           = opts.uiId;
            this._components     = [];
            this._componentsById = {};
        }

        getUiId() {
            return this._uiId;
        }

        getComponentById(id) {
            return this._componentsById[id];
        }

        remove() {
            let components = this._components;
            while (components.length) {
                components.pop().remove();
            }
        }

        addComponent(id, component) {
            this._componentsById[parseInt(id, 16)] = component;
            this._components.push(component);
        }
    };

exports.ComponentFormContainer = class {
    constructor() {
        this._nextUiId = 10240;
        this._windows  = {};
    }

    getNextUiId() {
        let uiId = this._nextUiId;
        this._nextUiId++;
        return uiId;
    }

    getWindowByUiId(uiId) {
        return this._windows[uiId];
    }

    peekUiId() {
        return this._nextUiId;
    }

    addWindow() {
        let uiId = this.getNextUiId();
        let win  = new Win({uiId: uiId});
        this._windows[uiId] = win;
        return win;
    }

    removeWindow(uiId) {
        let win = this._windows[uiId];
        if (!win) {
            return;
        }
        win.remove();
        delete this._windows[uiId];
    }
};
