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
                connecting:      false,
                commandQueue:    null,
                deviceName:      '',
                gyro:            {x: 0, y: 0, z: 0},
                accel:           {x: 0, y: 0, z: 0},
                pos:             {x: 0, y: 0, z: 0},
                ports:           []
            };
        for (let i = 0; i < 6; i++) {
            result.ports.push({
                value:        0,
                reset:        0,
                assigned:     0,
                mode:         0,
                degrees:      0,
                startDegrees: 0,
                endDegrees:   null
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

    getConnected(deviceName) {
        let layers = this._layers;
        for (let i = 0; i < layers.length; i++) {
            let layer = layers[i];
            if (layer.connected) {
                if (deviceName === undefined) {
                    return true;
                } else if (layer.deviceName === deviceName) {
                    return true;
                }
            }
        }
        return false;
    }

    getConnecting(deviceName) {
        let layers = this._layers;
        for (let i = 0; i < layers.length; i++) {
            let layer = layers[i];
            if (layer.deviceName === deviceName) {
                return layer.connecting;
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

    motorReset(layer, id) {
        layer = this._layers[layer];
        if (!layer || !layer.ports[id]) {
            return;
        }
        let motor = layer.ports[id];
        motor.resetDegrees = motor.value;
    }

    motorDegrees(layer, id, speed, degrees, brake, callback) {
        layer = this._layers[layer];
        if (!layer || !layer.ports[id]) {
            return;
        }
        if (degrees < 0) {
            degrees *= -1;
            speed   *= -1;
        }
        let motor = layer.ports[id];
        motor.startDegrees = motor.value - port.resetDegrees;
        motor.endDegrees   = degrees;
        layer.commandQueue.addToCommandQueue({
            m: 'scratch.motor_run_for_degrees',
            p: {
                port:    INDEX_TO_PORT[id],
                degrees: degrees,
                speed:   speed,
                stall:   false,
                stop:    true
            }
        });
        callback && callback();
    }

    motorOn(layer, id, speed, brake, callback) {
        layer = this._layers[layer];
        if (!layer || !layer.commandQueue || !(id in INDEX_TO_PORT)) {
            return;
        }
        layer.ports[id].endDegrees = null;
        layer.commandQueue.addToCommandQueue({
            m: 'scratch.motor_start',
            p: {
                port:  INDEX_TO_PORT[id],
                speed: speed,
                stall: true
            }
        });
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
                deviceName: layer.deviceName,
                connecting: layer.connecting,
                connected:  layer.connected,
                button:     layer.button,
                gyro:       layer.gyro,
                accel:      layer.accel,
                pos:        layer.pos,
                ports:      []
            };
        for (let i = 0; i < 6; i++) {
            let port = layer.ports[i];
            if (port.endDegrees !== null) {
                if (port.startDegrees < port.endDegrees) {
                    port.ready = (Math.abs(port.degrees - port.endDegrees) < 45) || (port.degrees >= port.endDegrees);
                } else {
                    port.ready = (Math.abs(port.degrees - port.endDegrees) < 45) || (port.degrees <= port.endDegrees);
                }
            }
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

    setText(layer, text) {
        layer = this._layers[layer];
        if (!layer) {
            return;
        }
        layer.commandQueue.addToCommandQueue({
            m: 'scratch.display_text',
            p: {
                text: text
            }
        });
    }

    stopPolling() {}
    resumePolling() {}

    getPortsPerLayer() {
        return 6;
    }
};
