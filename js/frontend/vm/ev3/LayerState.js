/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
let dispatcher      = require('../../lib/dispatcher').dispatcher;
let BasicLayerState = require('../BasicLayerState').BasicLayerState;

exports.LayerState = class extends BasicLayerState {
    constructor(opts) {
        opts.signalPrefix = 'EV3.Layer';
        super(opts);
        this._motors = [this.createMotor(), this.createMotor(), this.createMotor(), this.createMotor()];
    }

    createMotor() {
        return {
            degrees:  0,
            assigned: 0
        };
    }

    getUUID() {
        return '';
    }

    getMotorValues(property) {
        let result = [];
        for (let i = 0; i < 4; i++) {
            result.push(this._motors[i][property]);
        }
    }

    getMotors() {
        return this.getMotorValues('degrees');
    }

    getMotorAssingments() {
        return this.getMotorValues('assigned');
    }

    resetMotor(id) {
        // Not implemented for EV3...
    }

    checkMotorChange(newMotors) {
        let device = this._device;
        let motors = this._motors;
        let layer  = this._layer;
        for (let i = 0; i < 4; i++) {
            let assigned = newMotors[i + 4].assigned || 0;
            let motor    = motors[i];
            if (motor.assigned !== assigned) {
                motor.assigned = assigned;
                device.emit(this._signalPrefix + layer + 'Motor' + i + 'Assigned', assigned);
            }
            let value = parseInt(newMotors[i + 4].value || '0');
            if (motor.degrees !== value) {
                motor.degrees = value;
                device.emit(this._signalPrefix + layer + 'Motor' + i + 'Changed', value);
            }
        }
    }

    setStatus(status) {
        this.checkSensorChange(status);
        this.checkMotorChange(status);
    }
};
