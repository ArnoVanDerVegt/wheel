/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
let dispatcher      = require('../../../lib/dispatcher').dispatcher;
let BasicLayerState = require('../BasicLayerState').BasicLayerState;

exports.LayerState = class extends BasicLayerState {
    constructor(opts) {
        super(opts);
        this._connecting = false;
        this._deviceName = '';
        this._button     = 0;
        this._ports      = [];
        this._properties = {
            gyro:  {x: 0, y: 0, z: 0},
            accel: {x: 0, y: 0, z: 0},
            pos:   {x: 0, y: 0, z: 0}
        };
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
        // Not implemented for Spike...
    }

    setProperty(state, propery, signal) {
        if (!(propery in state)) {
            return this;
        }
        let p      = this._properties[propery];
        let device = this._device;
        let newP   = state[propery];
        if ((p.x !== newP.x) || (p.y !== newP.y) || (p.z !== newP.z)) {
            p.x = newP.x;
            p.y = newP.y;
            p.z = newP.z;
            device.emit('Spike.Layer' + this._layerIndex + '.' + signal, newP);
        }
        return this;
    }

    setState(state) {
        this._deviceName = state.deviceName;
        let device     = this._device;
        let layerIndex = this._layerIndex;
        if (this._connecting !== state.connecting) {
            this._connecting = state.connecting;
            if (state.connecting === false) {
                device.emit('Spike.StopConnecting', this._layerIndex);
            }
        }
        if (this._button !== state.button) {
            this._button = state.button;
            device.emit('Spike.Layer' + layerIndex + '.Button', this._button);
        }
        let ports = this._ports;
        for (let i = 0; i < 6; i++) {
            let newPort  = state.ports[i];
            let assigned = newPort.assigned || 0;
            let port     = ports[i];
            if (port.assigned !== assigned) {
                port.assigned = assigned;
                device.emit('Spike.Layer' + layerIndex + '.Assigned' + i, assigned);
            }
            let value = parseInt(newPort.value || '0');
            if (port.value !== value) {
                port.value   = value;
                port.degrees = value;
                device.emit('Spike.Layer' + layerIndex + '.Changed' + i, value);
            }
            port.ready = newPort.ready;
        }
        this
            .setProperty(state, 'gyro',  'Gyro')
            .setProperty(state, 'accel', 'Accel')
            .setProperty(state, 'pos',   'Pos');
    }
};
