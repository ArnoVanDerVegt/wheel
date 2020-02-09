/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Emitter = require('../../lib/Emitter').Emitter;

exports.VMModule = class extends Emitter {
    constructor(opts) {
        super();
        this._vm     = opts.vm;
        this._device = opts.device;
        this._vmData = opts.vm.getVMData();
    }
};
