/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const VMModule = require('./VMModule').VMModule;

exports.VMIDEModule = class extends VMModule {
    constructor(opts) {
        super(opts);
        this._ide = opts.ide;
    }

    getComponent(windowHandle, componentId) {
        const componentFormContainer = this._ide.getComponentFormContainer();
        if (!componentFormContainer) {
            return null;
        }
        const win = componentFormContainer.getWindowByUiId(windowHandle);
        if (!win) {
            return null;
        }
        return win.getComponentById(componentId) || null;
    }
};
