/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.BasicDeviceModule = class {
    constructor(opts) {
        this._device = opts.device;
    }

    run(commandId, data) {
    }
};
