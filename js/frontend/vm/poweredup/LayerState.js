/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
let dispatcher = require('../../lib/dispatcher').dispatcher;

exports.LayerState = class {
    constructor(opts) {
        this._connected       = false;
        this._layer           = opts.layer;
        this._poweredUp       = opts.poweredUp;
        this._uuid            = null;
        this._uuidTime        = Date.now();
        this._type            = null;
        this._button          = 0;
        this._tilt            = {x: 0, y: 0, z: 0};
        this._accel           = {x: 0, y: 0, z: 0};
        this._ports           = [0, 0, 0, 0];
        this._portAssignments = [0, 0, 0, 0];
    }

    getConnected() {
        return this._connected;
    }

    getType() {
        return this._type;
    }

    getPorts() {
        return this._ports;
    }

    getSensors() {
        return this._ports;
    }

    getMotors() {
        return this._ports;
    }

    getPortAssingments() {
        return this._portAssignments;
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
            this._poweredUp.emit('PoweredUp.Layer' + this._layer + 'Tilt', tilt);
        }
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
            this._poweredUp.emit('PoweredUp.Layer' + this._layer + 'Accel', accel);
        }
    }

    checkSensorChange(status) {
        let ports = this._ports;
        for (let i = 0; i < 4; i++) {
            let value = status.ports[i];
            if (ports[i] !== value) {
                ports[i] = value;
                this._poweredUp.emit('PoweredUp.Layer' + this._layer + 'Sensor' + i + 'Changed', value);
            }
        }
    }

    checkSensorAssignment(status) {
        let portAssignments = this._portAssignments;
        for (let i = 0; i < 4; i++) {
            let assignment = status.portAssignments[i];
            if (portAssignments[i] !== assignment) {
                portAssignments[i] = assignment;
                this._poweredUp.emit('PoweredUp.Layer' + this._layer + 'Sensor' + i + 'Assigned', assignment);
            }
        }
    }

    setStatus(status) {
        let time = Date.now();
        if ((status.uuid && (status.uuid !== this._uuid)) || (time > this._uuidTime + 500)) {
            this._uuid     = status.uuid || '';
            this._uuidTime = time;
            this._poweredUp.emit('PoweredUp.Layer' + this._layer + 'Uuid', this._uuid);
        }
        if (status.type && (status.type !== this._type)) {
            this._type = status.type;
            this._poweredUp.emit('PoweredUp.Layer' + this._layer + 'Type', this._type);
        }
        if (('button' in status) && (status.button !== this._button)) {
            this._button = status.button;
            this._poweredUp.emit('PoweredUp.Layer' + this._layer + 'Button', this._button);
        }
        this.checkTiltChange(status.tilt);
        this.checkAccelChange(status.accel);
        this.checkSensorAssignment(status);
        this.checkSensorChange(status);
        this._connected = status.connected;
    }

    getUuid() {
        return this._uuid;
    }

    getTilt() {
        return this._tilt;
    }

    getAccel() {
        return this._accel;
    }
};
