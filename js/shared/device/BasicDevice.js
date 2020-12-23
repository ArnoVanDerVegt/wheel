/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const StandardModule  = require('./modules/StandardModule' ).StandardModule;
const ScreenModule    = require('./modules/ScreenModule'   ).ScreenModule;
const MotorModule     = require('./modules/MotorModule'    ).MotorModule;
const SensorModule    = require('./modules/SensorModule'   ).SensorModule;
const MathModule      = require('./modules/MathModule'     ).MathModule;
const LightModule     = require('./modules/LightModule'    ).LightModule;
const ButtonModule    = require('./modules/ButtonModule'   ).ButtonModule;
const SoundModule     = require('./modules/SoundModule'    ).SoundModule;
const SystemModule    = require('./modules/SystemModule'   ).SystemModule;
const FileModule      = require('./modules/FileModule'     ).FileModule;
const BitModule       = require('./modules/BitModule'      ).BitModule;
const StringModule    = require('./modules/StringModule'   ).StringModule;
const DeviceModule    = require('./modules/DeviceModule'   ).DeviceModule;
const PoweredUpModule = require('./modules/PoweredUpModule').PoweredUpModule;
const SpikeModule     = require('./modules/SpikeModule'    ).SpikeModule;

exports.BasicDevice = class {
    constructor(opts) {
        this._layerCount = opts.layerCount || 4;
        this._modules    = [];
        this._connected  = false;
        this._connecting = false;
        this.initModules();
    }

    initModules() {
        let modules = this._modules;
        modules[ 0] = new StandardModule ({device: this});
        modules[ 1] = new MathModule     ({device: this});
        modules[ 2] = new ScreenModule   ({device: this});
        modules[ 3] = new LightModule    ({device: this});
        modules[ 4] = new ButtonModule   ({device: this});
        modules[ 5] = new SoundModule    ({device: this});
        modules[ 6] = new MotorModule    ({device: this});
        modules[ 7] = new SensorModule   ({device: this});
        modules[ 8] = new FileModule     ({device: this});
        modules[ 9] = new SystemModule   ({device: this});
        modules[10] = new StringModule   ({device: this});
        modules[11] = new BitModule      ({device: this});
        modules[12] = new DeviceModule   ({device: this});
        modules[13] = new PoweredUpModule({device: this});
        modules[14] = new SpikeModule    ({device: this});
    }

    getConnected() {}
    getLayerCount() {}
    setLayerCount(layerCount) {}
    disconnect() {}
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
    clearLeds(layer) {}
    setLed(layer, x, y, brightness) {}
    setText(layer, text) {}
    stopPolling() {}
    resumePolling() {}

    getPortsPerLayer() {
        return 4;
    }
};
