/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
let dispatcher = require('../../lib/dispatcher').dispatcher;

exports.LayerState = class {
    constructor(opts) {
        this._layer             = opts.layer;
        this._brick             = opts.brick;
        this._motors            = [0, 0, 0, 0];
        this._motorAssignments  = [0, 0, 0, 0];
        this._sensors           = [0, 0, 0, 0];
        this._sensorAssignments = [0, 0, 0, 0];
        this._sensorModes       = [null, null, null, null];
    }

    getSensors() {
        return this._sensors;
    }

    getSensorAssingments() {
        return this._sensorAssignments;
    }

    getMotors() {
        return this._motors;
    }

    getMotorAssingments() {
        return this._motorAssignments;
    }

    checkSensorChange(newSensors) {
        let brick             = this._brick;
        let sensorAssignments = this._sensorAssignments;
        let sensorModes       = this._sensorModes;
        let sensors           = this._sensors;
        let layer             = this._layer;
        for (let i = 0; i < 4; i++) {
            let assigned = newSensors[i].assigned || 0;
            let mode     = newSensors[i].mode     || null;
            if ((sensorAssignments[i] !== assigned) || (sensorModes[i] !== mode)) {
                sensorAssignments[i] = assigned;
                sensorModes[i]       = mode;
                brick.emit('Brick.Layer' + layer + 'Sensor' + i + 'Assigned', assigned, newSensors[i].mode);
            }
            let value = newSensors[i].value || 0;
            if (sensors[i] !== value) {
                sensors[i] = value;
                brick.emit('Brick.Layer' + layer + 'Sensor' + i + 'Changed', value);
            }
        }
    }

    checkMotorChange(newMotors) {
        let brick            = this._brick;
        let motorAssignments = this._motorAssignments;
        let motors           = this._motors;
        let layer            = this._layer;
        for (let i = 0; i < 4; i++) {
            let assigned = newMotors[i + 4].assigned || 0;
            if (motorAssignments[i] !== assigned) {
                motorAssignments[i] = assigned;
                brick.emit('Brick.Layer' + layer + 'Motor' + i + 'Assigned', assigned);
            }
            let value = parseInt(newMotors[i + 4].value || '0');
            if (motors[i] !== value) {
                motors[i] = value;
                brick.emit('Brick.Layer' + layer + 'Motor' + i + 'Changed', value);
            }
        }
    }

    setStatus(status) {
        this.checkSensorChange(status);
        this.checkMotorChange(status);
    }
};
