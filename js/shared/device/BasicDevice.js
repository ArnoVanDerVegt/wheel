/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const MotorModule  = require('../devicemodules/MotorModule' ).MotorModule;
const SensorModule = require('../devicemodules/SensorModule').SensorModule;
const LightModule  = require('../devicemodules/LightModule' ).LightModule;
const SoundModule  = require('../devicemodules/SoundModule' ).SoundModule;
const SpikeModule  = require('../devicemodules/SpikeModule' ).SpikeModule;

exports.BasicDevice = class {
    constructor(opts) {
        this._layerCount       = opts.layerCount       || 4;
        this._activeLayerCount = opts.activeLayerCount || 4;
        this._modules          = [];
        this._connected        = false;
        this._connecting       = false;
        this.initModules();
    }

    initModules() {
        let modules = this._modules;
        modules[ 3] = new LightModule    ({device: this});
        modules[ 5] = new SoundModule    ({device: this});
        modules[ 6] = new MotorModule    ({device: this});
        modules[ 7] = new SensorModule   ({device: this});
        modules[14] = new SpikeModule    ({device: this});
    }

    disconnect() {}
    disconnectAll() {}
    getConnected() {}

    getLayerCount() {
        return this._layerCount;
    }

    getActiveLayerCount() {
        return this._activeLayerCount;
    }

    setActiveLayerCount(activeLayerCount) {
        this._activeLayerCount = activeLayerCount;
    }

    playtone(frequency, duration, volume, callback) {}
    motorReset(layer, motor) {}
    motorReverse(layer, motor) {}
    motorDegrees(layer, motor, speed, degrees, brake, callback) {}
    motorOn(layer, motor, speed, brake, callback) {}
    motorStop(layer, motor, brake, callback) {}
    motorThreshold(layer, motor, threshold) {}
    readTouchSensor(layer, port) {}
    readSensor(layer, port, type, mode) {}
    readMotor(layer, port) {}
    readBattery(callback) {}
    setLed(layer, color) {}
    listFiles(path, callback) {}
    downloadFile(filename, data, callback) {}
    createDir(path, callback) {}
    deleteFile(path, callback) {}
    module(module, command, data) {}
    getState() {}
    setMode(layer, port, mode) {}
    setType(layer, port, type) {}
    matrixClearLeds(layer) {}
    matrixSetLed(layer, x, y, brightness) {}
    matrixSetText(layer, text) {}
    stopPolling() {}
    resumePolling() {}

    getPortsPerLayer() {
        return 4;
    }

    getConnectedTypes(layer) {}

    onDisconnect(h) {}
};
