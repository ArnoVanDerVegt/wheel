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
        this._sensors    = [];
        this._motors     = [];
        for (let i = 0; i < 4; i++) {
            this._sensors.push(this.createSensorPort());
        }
        for (let i = 0; i < 3; i++) {
            this._motors.push(this.createMotorPort());
        }
    }

    createMotorPort() {
        return {
            ready:         false,
            degrees:       0,
            startDegrees:  0,
            targetDegrees: 0,
            brake:         0,
            speed:         0,
            reverse:       1
        };
    }

    createSensorPort() {
        return {
            ready:         false,
            value:         0,
            assigned:      0
        };
    }

    getMotorPort(port) {
        return this._motors[port] || {};
    }

    getSensors() {
        return this._sensors;
    }

    getDeviceName() {
        return this._deviceName;
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
        state.motors.forEach((newMotor, index) => {
            let motor = this._motors[index];
            motor.ready = newMotor.ready;
            if (motor && (motor.degrees !== newMotor.degrees)) {
                motor.degrees = newMotor.degrees;
                device.emit('NXT.Layer' + layerIndex + '.Motor.Changed' + index, motor.degrees);
            }
        });
        state.sensors.forEach((newSensor, index) => {
            let sensor = this._sensors[index];
            if (sensor) {
                if (sensor.assigned !== newSensor.assigned) {
                    sensor.assigned = newSensor.assigned;
                    device.emit('NXT.Layer' + layerIndex + '.Sensor.Assigned' + index, sensor.assigned);
                }
                if (sensor.value !== newSensor.value) {
                    sensor.value = newSensor.value;
                    device.emit('NXT.Layer' + layerIndex + '.Sensor.Changed' + index, sensor.value);
                }
            }
        });
    }
};
