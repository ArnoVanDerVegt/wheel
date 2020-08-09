/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const SimulatedLayerDevice = require('./SimulatedLayerDevice').SimulatedLayerDevice;

exports.SimulatedDevices = class {
    constructor(opts) {
        this._layers = [
            new SimulatedLayerDevice({layer: 0}),
            new SimulatedLayerDevice({layer: 1}),
            new SimulatedLayerDevice({layer: 2}),
            new SimulatedLayerDevice({layer: 3})
        ];
    }

    getLayer(layer) {
        return this._layers[layer] || new SimulatedLayerDevice({layer: null});
    }
};
