/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../vm/modules/sensorModuleConstants');
const DeviceModule          = require('./DeviceModule').DeviceModule;

class Sensor {
    constructor(layer, id, device) {
        this._layer  = layer;
        this._id     = id;
        this._device = device;
        this._type   = 0;
        this._mode   = 0;
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
        switch (this._type) {
            case sensorModuleConstants.SENSOR_TYPE_TOUCH:
                this._device.readTouchSensor(this._layer, this._id);
                break;
            case sensorModuleConstants.SENSOR_TYPE_COLOR:
                if ((this._mode >= 0) && (this._mode < 3)) {
                    this._device.readColorSensor(this._layer, this._id, '0' + this._mode);
                }
                break;
            case sensorModuleConstants.SENSOR_TYPE_INFRARED:
                if ([0, 2].indexOf(this._mode) !== -1) {
                    this._device.readInfraredSensor(this._layer, this._id, '0' + this._mode);
                }
                break;
            case sensorModuleConstants.SENSOR_TYPE_ULTRASONIC:
                break;
            case sensorModuleConstants.SENSOR_TYPE_GYRO:
                break;
            case sensorModuleConstants.SENSOR_TYPE_SOUND:
                break;
        }
    }
}

exports.SensorModule = class extends DeviceModule {
    constructor(opts) {
        super(opts);
        let layerCount    = this._device.getActiveLayerCount();
        let portsPerLayer = this._device.getPortsPerLayer();
        this._layers = [];
        for (let i = 0; i < layerCount; i++) {
            let sensors = [];
            for (let j = 0; j < portsPerLayer; j++) {
                sensors.push(new Sensor(i, j, this._device));
            }
            this._layers.push(sensors);
        }
    }

    getSensor(layer, id) {
        return (this._layers[layer] && this._layers[layer][id]) ? this._layers[layer][id] : null;
    }

    run(commandId, data) {
        let sensor = this.getSensor(data.layer || 0, data.id);
        switch (commandId) {
            case sensorModuleConstants.SENSOR_SET_TYPE:
                sensor && sensor.setType(data.type);
                break;
            case sensorModuleConstants.SENSOR_SET_MODE:
                let device = this._device;
                device && device.setMode(data.layer, data.id, data.mode);
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
