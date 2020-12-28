/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
let dispatcher      = require('../../../lib/dispatcher').dispatcher;
let BasicLayerState = require('../BasicLayerState').BasicLayerState;

exports.LayerState = class extends BasicLayerState {
    constructor(opts) {
        opts.signalPrefix = 'PoweredUp.Layer';
        super(opts);
        this._uuid      = null;
        this._uuidTime  = Date.now();
        this._type      = null;
        this._button    = 0;
        this._tilt      = {x: 0, y: 0, z: 0};
        this._accel     = {x: 0, y: 0, z: 0};
    }

    getUUID() {
        return this._uuid || '';
    }

    getButton() {
        return this._button;
    }

    getTilt() {
        return this._tilt;
    }

    getAccel() {
        return this._accel;
    }

    getType() {
        return this._type;
    }

    getPortValues(property) {
        let result = [];
        for (let i = 0; i < 4; i++) {
            result.push(this._ports[i][property]);
        }
        return result;
    }

    getSensors() {
        return this.getPortValues('value');
    }

    getMotors() {
        return this.getPortValues('value');
    }

    getPortAssignments() {
        return this.getPortValues('assigned');
    }

    checkTiltChange(tilt) {
        let changed = false;
        for (let t in tilt) {
            if (this._tilt[t] !== tilt[t]) {
                this._tilt[t] = tilt[t];
                changed = true;
            }
        }
        if (changed) {
            this._device.emit(this._signalPrefix + this._layerIndex + 'Tilt', tilt);
        }
        return this;
    }

    checkAccelChange(accel) {
        let changed = false;
        for (let a in accel) {
            if (this._accel[a] !== accel[a]) {
                this._accel[a] = accel[a];
                changed = true;
            }
        }
        if (changed) {
            this._device.emit(this._signalPrefix + this._layerIndex + 'Accel', accel);
        }
    }

    checkReady(ports) {
        for (let i = 0; i < 4; i++) {
            let port = ports[i];
            if ('ready' in port) {
                this._ports[i].ready = port.ready;
            }
        }
        return this;
    }

    setState(state) {
        let time = Date.now();
        if ((state.uuid && (state.uuid !== this._uuid)) || (time > this._uuidTime + 500)) {
            this._uuid     = state.uuid || '';
            this._uuidTime = time;
            if (state.connected) {
                this._device.emit(this._signalPrefix + this._layerIndex + 'Uuid', this._uuid);
            }
        }
        if (state.type && (state.type !== this._type)) {
            this._type = state.type;
            this._device.emit(this._signalPrefix + this._layerIndex + 'Type', this._type);
        }
        if (('button' in state) && (state.button !== this._button)) {
            this._button = state.button;
            this._device.emit(this._signalPrefix + this._layerIndex + 'Button', this._button);
        }
        this
            .checkReady(state.ports)
            .checkSensorChange(state.ports)
            .checkTiltChange(state.tilt)
            .checkAccelChange(state.accel);
        // Since Powered Up ports can be a motor or sensor we copy the value to degrees...
        let ports = this._ports;
        for (let i = 0; i < 4; i++) {
            let port = ports[i];
            port.degrees = port.value;
        }
    }
};
