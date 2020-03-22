/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const poweredUpModuleConstants = require('../../../../../../shared/vm/modules/poweredUpModuleConstants');

/**
 * This class is used when there is no device connected,
 * it provides a dummy state for the ports.
**/
exports.SimulatedLayerDevice = class {
    constructor(opts) {
        this._layer = opts.layer;
        this._type  = -1;
    }

    getType() {
        return this._type;
    }

    setType(type) {
        this._type = type;
    }
};
