/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
let dispatcher      = require('../../../lib/dispatcher').dispatcher;
let BasicLayerState = require('../BasicLayerState').BasicLayerState;

exports.LayerState = class extends BasicLayerState {
    constructor(opts) {
        opts.signalPrefix = 'NXT.Layer';
        super(opts);
        this._connecting = false;
        this._deviceName = '';
        this._ports      = [];
        for (let i = 0; i < 4; i++) {
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
            reverse:       1
        };
    }

    getDeviceName() {
        return this._deviceName;
    }

    getUUID() {
        return '';
    }

    resetMotor(id) {
        // Not implemented for NXT...
    }

    setState(state) {
        this._deviceName = state.deviceName;
        let device     = this._device;
        let layerIndex = this._layerIndex;
        if (this._connecting !== state.connecting) {
            this._connecting = state.connecting;
            if (state.connecting === false) {
                device.emit('NXT.StopConnecting', this._layerIndex);
            }
        }
        if (this._button !== state.button) {
            this._button = state.button;
            device.emit('NXT.Button' + layerIndex, this._button);
        }
    }
};
