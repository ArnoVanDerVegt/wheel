/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
let dispatcher      = require('../../lib/dispatcher').dispatcher;
let BasicLayerState = require('../BasicLayerState').BasicLayerState;

exports.LayerState = class extends BasicLayerState {
    constructor(opts) {
        opts.signalPrefix = 'Spike.Layer';
        super(opts);
        this._ports = [];
        for (let i = 0; i < 6; i++) {
            this._ports.push(this.createPort());
        }
    }

    createPort() {
        return {
            ready:         false,
            value:         0,
            degrees:       0,
            assigned:      0,
            startDegrees:  0,
            targetDegrees: 0,
            brake:         0,
            speed:         0,
            time:          null
        };
    }

    getUUID() {
        return '';
    }

    resetMotor(id) {
        // Not implemented for Spike...
    }

    setState(state) {
        let device = this._device;
        let ports  = this._ports;
        let layer  = this._layer;
        for (let i = 0; i < 6; i++) {
            let newPort  = state.ports[i];
            let assigned = newPort.assigned || 0;
            let port     = ports[i];
            if (port.assigned !== assigned) {
                port.assigned = assigned;
                device.emit(this._signalPrefix + layer + 'Port' + i + 'Assigned', assigned);
            }
            let value = parseInt(newPort.value || '0');
            if (port.value !== value) {
                port.value = value;
                device.emit(this._signalPrefix + layer + 'Port' + i + 'Changed', value);
            }
            port.ready = newPort.ready;
        }
    }
};
