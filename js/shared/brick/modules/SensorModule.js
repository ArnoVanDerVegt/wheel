/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../vm/modules/sensorModuleConstants');
const BrickModule           = require('./BrickModule').BrickModule;
const constants             = require('../constants');

class Sensor {
    constructor(layer, id, brick) {
        this._layer = layer;
        this._id    = id;
        this._brick = brick;
        this._type  = 0;
        this._mode  = 0;
    }

    getMode() {
        return this._mode;
    }

    setMode(mode) {
        this._mode = mode;
    }

    getType() {
        return this._type;
    }

    setType(type) {
        this._type = type;
    }

    reset() {
    }

    read() {
        // A switch (this._type) {
        // A     case sensorModuleConstants.SENSOR_TYPE_TOUCH:
        // A         this._brick.readTouchSensor(this._layer, this._id);
        // A         break;
        // A     case sensorModuleConstants.SENSOR_TYPE_COLOR:
        // A         if ((this._mode >= 0) && (this._mode < 3)) {
        // A             this._brick.readColorSensor(this._layer, this._id, '0' + this._mode);
        // A         }
        // A         break;
        // A     case sensorModuleConstants.SENSOR_TYPE_INFRARED:
        // A         if ([0, 2].indexOf(this._mode) !== -1) {
        // A             this._brick.readInfraredSensor(this._layer, this._id, '0' + this._mode);
        // A         }
        // A         break;
        // A     case sensorModuleConstants.SENSOR_TYPE_ULTRASONIC:
        // A         break;
        // A     case sensorModuleConstants.SENSOR_TYPE_GYRO:
        // A         break;
        // A     case sensorModuleConstants.SENSOR_TYPE_SOUND:
        // A         break;
        // A }
    }
}

exports.SensorModule = class extends BrickModule {
    constructor(opts) {
        super(opts);
        this._layers = [];
        for (let i = 0; i < 2; i++) {
            let sensors = [];
            for (let j = 0; j < 4; j++) {
                sensors.push(new Sensor(i, j, this._brick));
            }
            this._layers.push(sensors);
        }
    }

    getSensor(layer, id) {
        return this._layers[layer][id] || null;
    }

    run(commandId, data) {
        let sensor = this.getSensor(data.layer || 0, data.id);
        switch (commandId) {
            case sensorModuleConstants.SENSOR_SET_TYPE:
                sensor && sensor.setType(data.type);
                break;
            case sensorModuleConstants.SENSOR_SET_MODE:
                sensor && sensor.setMode(data.mode);
                break;
            case sensorModuleConstants.SENSOR_RESET:
                sensor && sensor.reset();
                break;
            case sensorModuleConstants.SENSOR_READ:
                sensor && sensor.read();
                break;
        }
    }
};
