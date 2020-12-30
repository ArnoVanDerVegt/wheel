/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../vm/modules/sensorModuleConstants');
const motorModuleConstants  = require('../../vm/modules/motorModuleConstants');
const nxtModuleConstants    = require('../../vm/modules/nxtModuleConstants');
const BasicDevice           = require('../BasicDevice').BasicDevice;
const constants             = require('./constants');
const Message               = require('./Message').Message;
const ResponseMessage       = require('./Message').ResponseMessage;
const CommandQueue          = require('./CommandQueue').CommandQueue;

exports.NXT = class extends BasicDevice {
    constructor(opts) {
        opts.layerCount = nxtModuleConstants.NXT_LAYER_COUNT;
        super(opts);
        this._poll                  = {layer: 0, port: 0};
        this._polling               = false;
        this._serialPortConstructor = opts.serialPortConstructor;
        this._layers                = [];
        for (let i = 0; i < nxtModuleConstants.NXT_LAYER_COUNT; i++) {
            this._layers.push(this.initLayer());
        }
    }

    initLayer() {
        let result = {
                connected:    false,
                connecting:   false,
                commandQueue: null,
                deviceName:   '',
                sensors:      [],
                motors:       []
            };
        for (let i = 0; i < 3; i++) {
            result.motors.push({
                port:                 0,
                power:                0,
                mode:                 0,
                regulationMode:       0,
                turnRatio:            0,
                runState:             0,
                tachoLimit:           0,
                tachoCount:           0,
                value:                0,
                degrees:              0,
                resetDegrees:         0,
                startDegrees:         0,
                endDegrees:           null,
                threshold:            45
            });
        }
        for (let i = 0; i < 4; i++) {
            result.sensors.push({
                port:            0,
                valid:           0,
                calibrated:      0,
                sensorType:      0,
                sensorMode:      0,
                rawValue:        0,
                normalizedValue: 0,
                scaledValue:     0,
                calibratedValue: 0
            });
        }
        return result;
    }

    getLayerPort(layer, port) {
        if (this._layers[layer] && this._layers[layer].ports[port]) {
            return this._layers[layer].ports[port];
        }
        return {};
    }

    getPort() {
        return this._port;
    }

    getConnected(deviceName) {
        let layers = this._layers;
        for (let i = 0; i < Math.min(this._activeLayerCount, layers.length); i++) {
            let layer = layers[i];
            if (layer.connected && ((deviceName === undefined) || (layer.deviceName === deviceName))) {
                return true;
            }
        }
        return false;
    }

    getConnecting(deviceName) {
        let layers = this._layers;
        for (let i = 0; i < Math.min(this._activeLayerCount, layers.length); i++) {
            let layer = layers[i];
            if (layer.deviceName === deviceName) {
                return layer.connecting;
            }
        }
        return false;
    }

    getMotorPosition(layer, port) {
        return this._port[port] || 0;
    }

    connect(deviceName, callback) {
        let layers = this._layers;
        let found  = false;
        for (let i = 0; i < Math.min(this._activeLayerCount, layers.length); i++) {
            if (layers[i].commandQueue === null) {
                found = i;
                break;
            }
        }
        if (found === false) {
            return -1;
        }
        let layer = layers[found];
        layer.connecting   = true;
        layer.deviceName   = deviceName;
        layer.commandQueue = new CommandQueue({
            nxt:                   this,
            serialPortConstructor: this._serialPortConstructor,
            deviceName:            deviceName,
            layer:                 layer
        });
        return found;
    }

    disconnect() {
        this._layers.forEach((layer) => {
            if (layer.connected && layer.commandQueue) {
                layer.commandQueue.disconnect();
            }
        });
        this._polling = false;
    }

    playtone(frequency, duration, volume, callback) {
        let layers = this._layers;
        for (let i = 0; i < Math.min(this._activeLayerCount, layers.length); i++) {
            let commandQueue = layers[i].commandQueue;
            if (commandQueue !== null) {
                commandQueue.addToCommandQueue(new Message()
                    .addByte(constants.COMMAND_TYPE_DIRECT)
                    .addByte(constants.DIRECT_COMMAND_PLAYTONE)
                    .addWord(Math.max(Math.min(frequency, 14000), 200))
                    .addWord(duration)
                );
            }
        }
    }

    motorReset(layer, id) {
        layer = this._layers[layer];
        if (layer && layer.commandQueue) {
            let motor = layer.motors[id];
            motor.resetDegrees = motor.value;
        }
    }

    motorDegrees(layer, id, speed, degrees, brake, callback) {
        if (!this._layers[layer]) {
            callback && callback();
            return;
        }
        let motor = this._layers[layer].motors[id] || {};
        motor.endDegrees = motor.degrees + degrees;
        motor.moving     = true;
        if (degrees < 0) {
            degrees = Math.abs(degrees);
            speed   = -speed;
        }
        let power = Math.round((Math.min(Math.max(speed, -100), 100) + 100) / 25);
        this.setOutputMode(
            layer,
            id,
            constants.POWER[power],                 // Power
            constants.MODE_REGULATED_BRAKE,         // Mode
            constants.REGULATION_MODE_MOTOR_SPEED,  // Regulation mode
            0,                                      // Turn ratio
            constants.RUN_STATE_RAMP_UP,            // Run state
            degrees                                 // Tacho limit
        );
        callback && callback();
    }

    motorOn(layer, id, speed, brake, callback) {
        let power = Math.round((Math.min(Math.max(speed, -100), 100) + 100) / 25);
        let ratio = Math.round((Math.min(Math.max(speed, -100), 100) + 100) / 25);
        this.setOutputMode(
            layer,
            id,
            constants.POWER[power],                 // Power
            constants.MODE_MOTOR_ON,                // Mode
            constants.REGULATION_MODE_MOTOR_SPEED,  // Regulation mode
            constants.TURN_RATIO[ratio],            // Turn ratio
            constants.RUN_STATE_RUNNING,            // Run state
            0                                       // Tacho limit
        );
        callback && callback();
    }

    motorStop(layer, id, brake, callback) {
        let MotorOn     = 0x01;
        let MotorSpeed  = 0x01;
        let TurnRatio   = 0x9C;
        let RunState    = 0x20;
        this.setOutputMode(
            layer,
            id,
            constants.POWER[4],                     // Power
            constants.MODE_BRAKE,                   // Mode
            constants.REGULATION_MODE_MOTOR_SPEED,  // Regulation mode
            constants.TURN_RATIO[4],                // Turn ratio
            constants.RUN_STATE_IDLE,               // Run state
            0                                       // Tacho limit
        );
    }

    motorThreshold(layer, motor, threshold) {
        if (!this.getHubConnected(layer)) {
            return;
        }
        this.getLayerPort(layer, motor).threshold = threshold;
    }

    module(module, command, data) {
        if (this._modules[module]) {
            this._modules[module].run(command, data);
        }
    }

    getState() {
        let layers = this._layers;
        let result = {layers: []};

        for (let i = 0; i < Math.min(this._activeLayerCount, layers.length); i++) {
            for (let j = 0; j < 3; j++) {
                let motor = layers[i].motors[j];
                motor.ready = (motor.endDegrees === null) ? true : (Math.abs(motor.endDegrees - motor.value) <= motor.threshold);
            }
        }
        for (let i = 0; i < Math.min(this._activeLayerCount, layers.length); i++) {
            result.layers.push(this.cloneLayer(layers[i]));
        }
        let motor = layers[0].motors[0];
        return result;
    }

    setMode(layer, port, mode) {
        this.getLayerPort(layer, port).mode = parseInt(mode, 10);
    }

    setType(layer, port, type) {
        let sensorType = constants.SENSOR_TYPE_NONE;
        let sensorMode = 0;
        switch (type) {
            case sensorModuleConstants.SENSOR_TYPE_NXT_TOUCH:
                sensorType = constants.SENSOR_TYPE_SWITCH;
                sensorMode = constants.SENSOR_MODE_BOOLEAN;
                break;
            case sensorModuleConstants.SENSOR_TYPE_NXT_LIGHT:
                sensorType = constants.SENSOR_TYPE_LIGHT_ACTIVE;
                sensorMode = constants.SENSOR_MODE_RAW;
                break;
            case sensorModuleConstants.SENSOR_TYPE_NXT_SOUND:
                sensorType = constants.SENSOR_TYPE_SOUND_DB;
                sensorMode = constants.SENSOR_MODE_RAW;
                break;
            case sensorModuleConstants.SENSOR_TYPE_NXT_COLOR:
                sensorType = constants.SENSOR_TYPE_CUSTOM;
                sensorMode = constants.SENSOR_MODE_RAW;
                break;
            case sensorModuleConstants.SENSOR_TYPE_NXT_ULTRASONIC:
                sensorType = constants.SENSOR_TYPE_LOW_SPEED_9V;
                sensorMode = constants.SENSOR_MODE_RAW;
                break;
        }
        this.setInputMode(layer, port, sensorType, sensorMode);
    }

    setOutputMode(layer, port, power, mode, regulationMode, turnRatio, runState, tachoLimit) {
        layer = this._layers[layer];
        if (layer && layer.commandQueue) {
            layer.commandQueue.addToCommandQueue(new Message()
                .addByte(constants.COMMAND_TYPE_DIRECT)
                .addByte(constants.DIRECT_COMMAND_SET_OUTPUT_STATE)
                .addByte(port)
                .addByte(power)
                .addByte(mode)
                .addByte(regulationMode)
                .addByte(turnRatio)
                .addByte(runState)
                .addByte5(tachoLimit)
            );
        }
    }

    setInputMode(layer, port, type, mode) {
        layer = this._layers[layer];
        if (layer && layer.commandQueue) {
            layer.commandQueue.addToCommandQueue(new Message()
                .addByte(constants.COMMAND_TYPE_DIRECT)
                .addByte(constants.DIRECT_COMMAND_SET_INPUT_MODE)
                .addByte(port)
                .addByte(type)
                .addByte(mode)
            );
        }
    }

    cloneLayer(layer) {
        let result = {
                deviceName: layer.deviceName,
                connecting: layer.connecting,
                connected:  layer.connected,
                sensors:    [],
                motors:     []
            };
        for (let i = 0; i < 4; i++) {
            let sensor = layer.sensors[i];
            result.sensors.push({
                assigned: sensor.valid ? sensor.assigned : 0,
                value:    sensor.value
            });
        }
        for (let i = 0; i < 3; i++) {
            let motor = layer.motors[i];
            result.motors.push({
                degrees: motor.degrees,
                ready:   motor.ready
            });
        }
        return result;
    }

    getPortsPerLayer() {
        return 4;
    }

    getSensorValues(port) {
    }

    updateSensorPort() {
        this._poll = (this._poll + 1) & 3;
        this.getSensorValues(this._poll);
        setTimeout(this.updateSensorPort.bind(this), 500);
    }
};
