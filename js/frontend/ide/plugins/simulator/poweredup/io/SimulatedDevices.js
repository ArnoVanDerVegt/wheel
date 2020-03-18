/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const SimulatedLayerDevice = require('./SimulatedLayerDevice').SimulatedLayerDevice;

exports.SimulatedDevices = class {
    constructor(opts) {
        this._layers = [
            this.createDevice(),
            this.createDevice(),
            this.createDevice(),
            this.createDevice()
        ];
    }

    createDevice() {
        return new SimulatedLayerDevice({});
    }

    getValidLayer(layer) {
        return (layer >= 0) && (layer <= 3);
    }

    getType(layer) {
        return this.getValidLayer(layer) ? this._layers[layer].getType() : -1;
    }

    setType(layer, type) {
        if (this.getValidLayer(layer)) {
            this._layers[layer].setType(type);
        }
    }

    setMode(layer, mode) {
        if (this.getValidLayer(layer)) {
            this._layers[layer].setMode(type);
        }
    }

    getLayer(layer) {
        return this._layers[layer];
    }
};
