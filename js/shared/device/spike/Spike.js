/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../vm/modules/sensorModuleConstants');
const motorModuleConstants  = require('../../vm/modules/motorModuleConstants');
const spikeModuleConstants  = require('../../vm/modules/spikeModuleConstants');

const BasicDevice           = require('../BasicDevice').BasicDevice;

const PORT_TO_INDEX         = {A: 0, B: 1, C: 2, D: 3, E: 4, F: 5};

const DIRECTION_REVERSE     =  -1;
const DIRECTION_NONE        =   0;
const DIRECTION_FORWARD     =   1;

let Spike = null; // Set with dependency injection...

/**
 * Dependency injection for nodejs or browser library...
**/
exports.setLibrary = function(spike) {
    Spike = spike;
};

exports.Spike = class extends BasicDevice {
    constructor(opts) {
        opts.layerCount = spikeModuleConstants.SPIKE_LAYER_COUNT;
        super(opts);
        this._spike  = new PoweredUP.PoweredUP();
        this._layers = [];
        for (let i = 0; i < spikeModuleConstants.SPIKE_LAYER_COUNT; i++) {
            this._layers.push(this.initLayer());
        }
    }

    initLayer() {
        let result = {
                connected:       false,
                tilt:            {x: 0, y: 0, z: 0},
                accel:           {x: 0, y: 0, z: 0},
                ports:           []
            };
        for (let i = 0; i < 6; i++) {
            result.ports.push({
                value:            0,
                reset:            0,
                assigned:         0,
                mode:             0,
                device:           null,
                moving:           false,
                currentDirection: DIRECTION_NONE,
                degrees:          0,
                startDegrees:     null,
                endDegrees:       null,
                threshold:        45,
                on:               false
            });
        }
        return result;
    }

    onDisconnect(h) {
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

    getConnected() {
        return this._connected;
    }

    getLayerCount() {
        return this._layerCount;
    }

    setLayerCount(layerCount) {
        // Ingore this setter, this is set with SPIKE_LAYER_COUNT constant.
        // This setter is used only for EV3.
    }

    getMotorPosition(layer, port) {
        return this._port[port] || 0;
    }

    connect(callback) {
    }

    disconnect() {
    }

    disconnectAll() {
    }

    playtone(frequency, duration, volume, callback) {
    }

    motorReset(layer, motor) {
        let layers = this._layers;
        if (!layers[layer] || !(motor in layers[layer].ports)) {
            return;
        }
        let port = layers[layer].ports[motor];
        port.reset = port.degrees;
        port.value = 0;
    }

    motorDegrees(layer, motor, speed, degrees, brake, callback) {
        let port = this.getLayerPort(layer, motor);
        port.motorDevice  = motorDevice;
        port.moving       = true;
        port.startDegrees = port.degrees;
        port.endDegrees   = port.degrees + degrees;
        port.speed        = speed;
        if (port.degrees < port.endDegrees) {
            port.currentDirection = DIRECTION_FORWARD;
        } else {
            port.currentDirection = DIRECTION_REVERSE;
        }
        speed = Math.abs(speed);
        if (degrees < 0) {
            motorDevice.rotateByDegrees(Math.abs(degrees), -speed);
        } else {
            motorDevice.rotateByDegrees(degrees, speed);
        }
        callback && callback();
    }

    motorOn(layer, motor, speed, brake, callback) {
        callback && callback();
    }

    motorStop(layer, motor, brake, callback) {
        callback && callback();
    }

    motorThreshold(layer, motor, threshold) {
        if (!this.getHubConnected(layer)) {
            return;
        }
        this.getLayerPort(layer, motor).threshold = threshold;
    }

    readTouchSensor(layer, port) {}
    readSensor(layer, port, type, mode) {}
    readMotor(layer, port) {}
    readBattery(callback) {}
    setLed(layer, color) {}
    listFiles(path, callback) {}
    downloadFile(filename, data, callback) {}
    createDir(path, callback) {}
    deleteFile(path, callback) {}

    module(module, command, data) {
        if (this._modules[module]) {
            this._modules[module].run(command, data);
        }
    }

    getState() {
        let layers = this._layers;
        let result = {layers: []};
        for (let i = 0; i < spikeModuleConstants.SPIKE_LAYER_COUNT; i++) {
            result.layers.push(this.cloneLayer(layers[i]));
        }
        return result;
    }

    setMode(layer, port, mode) {
        this.getLayerPort(layer, port).mode = parseInt(mode, 10);
    }

    cloneLayer(layer) {
        let result = {
                uuid:       layer.uuid,
                type:       layer.type,
                connecting: layer.connecting,
                connected:  layer.connected,
                button:     layer.button,
                tilt:       layer.tilt,
                accel:      layer.accel,
                ports:      []
            };
        for (let i = 0; i < 4; i++) {
            let port = layer.ports[i];
            result.ports.push({
                value:    port.value,
                assigned: port.assigned,
                ready:    !port.moving
            });
        }
        return result;
    }

    stopPolling() {}
    resumePolling() {}
};
