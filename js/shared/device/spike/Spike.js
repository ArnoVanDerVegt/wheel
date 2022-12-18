/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../vm/modules/sensorModuleConstants');
const motorModuleConstants  = require('../../vm/modules/motorModuleConstants');
const spikeModuleConstants  = require('../../vm/modules/spikeModuleConstants');
const BasicDevice           = require('../BasicDevice').BasicDevice;
const constants             = require('./constants');
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
                ports:           [],
                battery:         -1,
                button:          0
            };
        for (let i = 0; i < 6; i++) {
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
            spike:                 this,
            serialPortConstructor: this._serialPortConstructor,
            deviceName:            deviceName,
            layer:                 layer
        });
        return found;
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
                        m: constants.COMMAND_SOUND_OFF
                    });
                    layer.toneTimeout = null;
                },
                duration
            );
            layer.commandQueue.addToCommandQueue({
                m: constants.COMMAND_SOUND_BEEP,
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
        motor.reset = motor.value;
    }

    motorDegrees(layer, motor, speed, brake, degrees, callback) {
        layer = this._layers[layer];
        if (!layer || !layer.ports[motor]) {
            return;
        }
        let port = layer.ports[motor];
        port.startDegrees = port.value;
        port.endDegrees   = port.value + degrees;
        port.speed        = speed;
        speed             = Math.abs(speed);
        layer.commandQueue.addToCommandQueue({
            m: constants.COMMAND_RUN_FOR_DEGREES,
            p: {
                port:    INDEX_TO_PORT[motor],
                degrees: Math.abs(degrees),
                speed:   (degrees < 0) ? -speed : speed,
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
            m: constants.COMMAND_MOTOR_START,
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
                battery:    layer.battery,
                button:     layer.button,
                gyro:       layer.gyro,
                accel:      layer.accel,
                pos:        layer.pos,
                ports:      []
            };
        for (let i = 0; i < 6; i++) {
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

    setUltrasonicLight(layer, port, topLeft, topRight, bottomLeft, bottomRight) {
        layer = this._layers[layer];
        if (!layer) {
            return;
        }
        layer.commandQueue.addToCommandQueue({
            m: constants.COMMAND_ULTRASONIC_LIGHT_UP,
            p: {
                port:   INDEX_TO_PORT[port],
                lights: [topLeft, topRight, bottomLeft, bottomRight]
            }
        });
    }

    setLed(layer, color) {
        layer = this._layers[layer];
        if (!layer) {
            return;
        }
        // layer.commandQueue.addToCommandQueue({
        //     m: constants.COMMAND_BUTTON_LIGHTS,
        //     p: {
        //         color: color
        //     }
        // });
    }

    matrixClearLeds(layer) {
        layer = this._layers[layer];
        if (!layer) {
            return;
        }
        layer.commandQueue.addToCommandQueue({
            m: constants.COMMAND_DISPLAY_CLEAR
        });
    }

    matrixSetLed(layer, x, y, brightness) {
        layer = this._layers[layer];
        if (!layer) {
            return;
        }
        layer.commandQueue.addToCommandQueue({
            m: constants.COMMAND_DISPLAY_SET_PIXEL,
            p: {
                x:          x,
                y:          y,
                brightness: brightness
            }
        });
    }

    matrixSetText(layer, text) {
        layer = this._layers[layer];
        if (!layer) {
            return;
        }
        // layer.commandQueue.addToCommandQueue({
        //     m: constants.COMMAND_DISPLAY_TEXT,
        //     p: {
        //         text: text
        //     }
        // });
    }

// {"i":"rZZN","m":"scratch.display_image_for","p":"duration":2000,"image":"99099:99099:00000:90009:09990"}}
// {"i":"qiIx","m":"scratch.display_image","p":{"image":"99099:99099:00000:90009:09990"}}

    getPortsPerLayer() {
        return 6;
    }
};
