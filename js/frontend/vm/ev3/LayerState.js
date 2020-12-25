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
            ready:         false,
            degrees:       0,
            assigned:      0,
            startDegrees:  0,
            targetDegrees: 0,
            brake:         1,
            speed:         0,
            time:          null,
            reverse:       1
        };
    }

    getUUID() {
        return '';
    }

    getMotorPort(port) {
        return this._motors[port];
    }

    getMotorValues(property) {
        let result = [];
        for (let i = 0; i < 4; i++) {
            result.push(this._motors[i][property]);
        }
        return result;
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
            let newMotor = newMotors[i + 4];
            let assigned = newMotor.assigned || 0;
            let motor    = motors[i];
            if (motor.assigned !== assigned) {
                motor.assigned = assigned;
                device.emit(this._signalPrefix + layer + 'Motor' + i + 'Assigned', assigned);
            }
            let degrees = parseInt(newMotor.degrees || '0');
            if (motor.degrees !== degrees) {
                motor.degrees = degrees;
                device.emit(this._signalPrefix + layer + 'Motor' + i + 'Changed', degrees);
            }
            motor.ready = newMotor.ready;
        }
    }

    setState(state) {
        this.checkSensorChange(state);
        this.checkMotorChange(state);
    }
};
