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
        this._deviceName = '';
        this._connected  = false;
        this._connecting = false;
        this._properties = {
            gyro:  {x: 0, y: 0, z: 0},
            accel: {x: 0, y: 0, z: 0},
            pos:   {x: 0, y: 0, z: 0}
        };
        this._ports      = [];
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
            speed:         0
        };
    }

    getDeviceName() {
        return this._deviceName;
    }

    getConnected() {
        return this._connected;
    }

    getConnecting() {
        return this._connecting;
    }

    setConnecting(connecting) {
        if (this._connecting !== connecting) {
            this._connecting = connecting;
            device.emit('Spike.Connecting' + this._layer);
        }
    }

    getUUID() {
        return '';
    }

    resetMotor(id) {
        // Not implemented for Spike...
    }

    disconnect() {
        this._connecting = false;
        this._connected  = false;
        this._deviceName = '';
        this._device
            .emit('Spike.Disconnected')
            .emit('Spike.Disconnected' + this._layer);
    }

    setProperty(state, propery, signal) {
        if (!(propery in state)) {
            return this;
        }
        let p      = this._properties[propery];
        let newP   = state[propery];
        let device = this._device;
        if ((p.x !== newP.x) || (p.y !== newP.y) || (p.z !== newP.z)) {
            p.x = newP.x;
            p.y = newP.y;
            p.z = newP.z;
            device.emit('Spike.' + signal + this._layer, newP);
        }
        return this;
    }

    setState(state) {
        this._deviceName = state.deviceName;
        let device = this._device;
        if (this._connected !== state.connected) {
            this._connected = state.connected;
            device
                .emit('Spike.Connected')
                .emit('Spike.Connected' + this._layer, this._deviceName);
        }
        let ports = this._ports;
        let layer = this._layer;
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
        this
            .setProperty(state, 'gyro',  'Gyro')
            .setProperty(state, 'accel', 'Accel')
            .setProperty(state, 'pos',   'Pos');
    }
};
