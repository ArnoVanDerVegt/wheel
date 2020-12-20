/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../vm/modules/sensorModuleConstants');
const motorModuleConstants  = require('../../vm/modules/motorModuleConstants');
const spikeModuleConstants  = require('../../vm/modules/spikeModuleConstants');
const BasicDevice           = require('../BasicDevice').BasicDevice;
const CommandQueue          = require('./CommandQueue').CommandQueue;

const PORT_TO_INDEX         = {A: 0, B: 1, C: 2, D: 3, E: 4, F: 5};
const INDEX_TO_PORT         = ['A', 'B', 'C', 'D', 'E', 'F'];

exports.Spike = class extends BasicDevice {
    constructor(opts) {
        opts.layerCount = spikeModuleConstants.SPIKE_LAYER_COUNT;
        super(opts);
        this._serialPortConstructor = opts.serialPortConstructor;
        this._layers                = [];
        for (let i = 0; i < spikeModuleConstants.SPIKE_LAYER_COUNT; i++) {
            this._layers.push(this.initLayer());
        }
    }

    initLayer() {
        let result = {
                connected:       false,
                commandQueue:    null,
                deviceName:      '',
                tilt:            {x: 0, y: 0, z: 0},
                accel:           {x: 0, y: 0, z: 0},
                ports:           []
            };
        for (let i = 0; i < 6; i++) {
            result.ports.push({
                value:    0,
                reset:    0,
                assigned: 0,
                mode:     0
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
        let layers = this._layers;
        for (let i = 0; i < layers.length; i++) {
            if (layers[i].connected) {
                return true;
            }
        }
        return false;
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

    connect(deviceName, callback) {
        let layers = this._layers;
        let found  = false;
        for (let i = 0; i < layers.length; i++) {
            if (layers[i].commandQueue === null) {
                found = i;
                break;
            }
        }
        if (found === false) {
            return;
        }
        let layer = layers[found];
        layer.deviceName   = deviceName;
        layer.commandQueue = new CommandQueue({
            spike:                 this,
            serialPortConstructor: this._serialPortConstructor,
            deviceName:            deviceName,
            layer:                 layer
        });
    }

    disconnect() {
    }

    disconnectAll() {
    }

    playtone(frequency, duration, volume, callback) {
        let tone = frequency;
        const frequencies     = [262, 294, 330, 349, 392, 440, 494, 523, 587, 659, 277, 311, 370, 415, 466, 554, 622];
        const frequencyToTone = [ 60,  62,  64,  65,  67,  69,  71,  72,  74,  76,  61,  63,  66,  68,  70,  73,  75];
        if (frequencies.indexOf(frequency) !== -1) {
            tone = frequencyToTone[frequencies.indexOf(frequency)];
        }
        this._layers.forEach((layer) => {
            if (!layer.commandQueue) {
                return;
            }
            if (layer.toneTimeout) {
                clearTimeout(layer.toneTimeout);
            }
            layer.toneTimeout = setTimeout(
                () => {
                    layer.commandQueue.addToCommandQueue({
                        m: 'scratch.sound_off'
                    });
                    layer.toneTimeout = null;
                },
                duration
            );
            layer.commandQueue.addToCommandQueue({
                m: 'scratch.sound_beep',
                p: {
                    volume: volume,
                    note:   tone
                }
            });
        });
    }

    motorReset(layer, motor) {
    }

    motorDegrees(layer, motor, speed, degrees, brake, callback) {
    }

    motorOn(layer, motor, speed, brake, callback) {
        layer = this._layers[layer];
        if (!layer || !layer.commandQueue || !(motor in INDEX_TO_PORT)) {
            return;
        }
        layer.commandQueue.addToCommandQueue({
            m: 'scratch.motor_start',
            p: {
                port:  INDEX_TO_PORT[motor],
                speed: speed,
                stall: true
            }
        });
        callback && callback();
    }

    motorStop(layer, motor, brake, callback) {
        this.motorOn(layer, motor, 0, brake, callback);
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
        for (let i = 0; i < 6; i++) {
            let port = layer.ports[i];
            result.ports.push({
                value:    port.value,
                assigned: port.assigned
            });
        }
        return result;
    }

    clearLeds(layer) {
        layer = this._layers[layer];
        if (!layer) {
            return;
        }
        layer.commandQueue.addToCommandQueue({
            m: 'scratch.display_clear'
        });
    }

    setLed(layer, x, y, brightness) {
        layer = this._layers[layer];
        if (!layer) {
            return;
        }
        layer.commandQueue.addToCommandQueue({
            m: 'scratch.display_set_pixel',
            p: {
                x:          x,
                y:          y,
                brightness: brightness
            }
        });
    }

    stopPolling() {}
    resumePolling() {}
};
