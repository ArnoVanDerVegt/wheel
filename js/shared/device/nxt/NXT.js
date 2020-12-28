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
        this._serialPortConstructor = opts.serialPortConstructor;
        this._layers                = [];
        for (let i = 0; i < nxtModuleConstants.NXT_LAYER_COUNT; i++) {
            this._layers.push(this.initLayer());
        }
    }

    initLayer() {
        let result = {
                connected:       false,
                connecting:      false,
                commandQueue:    null,
                deviceName:      '',
                ports:           [],
                button:          0
            };
        for (let i = 0; i < 4; i++) {
            result.ports.push({
                value:        0,
                reset:        0,
                assigned:     0,
                mode:         0,
                startDegrees: 0,
                endDegrees:   null,
                threshold:    45
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

    playtone(frequency, duration, volume, callback) {
        let layers = this._layers;
        for (let i = 0; i < Math.min(this._activeLayerCount, layers.length); i++) {
            if (layers[i].commandQueue !== null) {
                layers[i].commandQueue.playtone(frequency, duration);
            }
        }
    }

    motorReset(layer, id) {
        layer = this._layers[layer];
        if (!layer || !layer.ports[id]) {
            return;
        }
        let motor = layer.ports[id];
        motor.reset = motor.value;
    }

    motorDegrees(layer, motor, speed, degrees, brake, callback) {
        callback && callback();
    }

    motorOn(layer, id, speed, brake, callback) {
        callback && callback();
    }

    motorStop(layer, id, brake, callback) {
        this.motorOn(layer, id, 0, brake, callback);
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
            result.layers.push(this.cloneLayer(layers[i]));
        }
        return result;
    }

    setMode(layer, port, mode) {
        this.getLayerPort(layer, port).mode = parseInt(mode, 10);
    }

    cloneLayer(layer) {
        let result = {
                deviceName: layer.deviceName,
                connecting: layer.connecting,
                connected:  layer.connected,
                button:     layer.button,
                gyro:       layer.gyro,
                accel:      layer.accel,
                pos:        layer.pos,
                ports:      []
            };
        for (let i = 0; i < 4; i++) {
            let port = layer.ports[i];
            result.ports.push({
                value:    port.value - (port.isMotor ? port.reset : 0),
                degrees:  port.value,
                assigned: port.assigned,
                ready:    (port.endDegrees === null) ? true : (Math.abs(port.endDegrees - port.value) <= port.threshold)
            });
        }
        return result;
    }

    getPortsPerLayer() {
        return 4;
    }
};
