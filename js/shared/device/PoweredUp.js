/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../vm/modules/sensorModuleConstants');
const constants             = require('./constants');
const StandardModule        = require('./modules/StandardModule' ).StandardModule;
const ScreenModule          = require('./modules/ScreenModule'   ).ScreenModule;
const MotorModule           = require('./modules/MotorModule'    ).MotorModule;
const SensorModule          = require('./modules/SensorModule'   ).SensorModule;
const MathModule            = require('./modules/MathModule'     ).MathModule;
const LightModule           = require('./modules/LightModule'    ).LightModule;
const ButtonModule          = require('./modules/ButtonModule'   ).ButtonModule;
const SoundModule           = require('./modules/SoundModule'    ).SoundModule;
const SystemModule          = require('./modules/SystemModule'   ).SystemModule;
const FileModule            = require('./modules/FileModule'     ).FileModule;
const BitModule             = require('./modules/BitModule'      ).BitModule;
const StringModule          = require('./modules/StringModule'   ).StringModule;
const DeviceModule          = require('./modules/DeviceModule'   ).DeviceModule;
const PoweredUpModule       = require('./modules/PoweredUpModule').PoweredUpModule;
const PoweredUP             = require('node-poweredup');

const portToIndex = {A: 0, B: 1, C: 2, D: 3};

exports.PoweredUp = class {
    constructor(opts) {
        this._layerCount    = 0;
        this._modules       = [];
        this._scanning      = false;
        this._hubs          = [];
        this._hubsByUuid    = {};
        this._changed       = 0;
        this._layers        = [this.initLayer(), this.initLayer(), this.initLayer(), this.initLayer()];
        this._poweredUP     = new PoweredUP.PoweredUP();
        this._poweredUP.on('discover', this._addHub.bind(this));
        this.initModules();
    }

    initLayer() {
        return {
            connected:       false,
            button:          false,
            tilt:            {x: 0, y: 0, z: 0},
            accel:           {x: 0, y: 0, z: 0},
            ports:           [0, 0, 0, 0],
            portAssignments: [0, 0, 0, 0]
        };
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
    }

    _addHub(hub) {
        let uuid = hub.uuid;
        if (uuid in this._hubsByUuid) {
            return;
        }
        this._hubsByUuid[uuid] = {
            index:      this._hubs.length,
            layer:      null,
            uuid:       uuid,
            title:      hub.name,
            subTitle:   uuid,
            connecting: false,
            connected:  false
        };
        this._hubs.push(hub);
        this._changed++;
    }

    _connectHub(h, hub) {
        let layer = this._layers[hub.index];

        h.connect(); // Connect to the Hub
        h.on(
            'disconnect',
            function() {
                hub.connected = false;
            }
        );
        h.on(
            'tilt',
            function(port, x, y, z) {
                if (port === 'TILT') {
                    layer.tilt.x = x;
                    layer.tilt.y = y;
                    layer.tilt.z = z;
                }
            }
        );
        h.on(
            'accel',
            function(port, x, y, z) {
                if (port === 'ACCEL') {
                    layer.accel.x = x;
                    layer.accel.y = y;
                    layer.accel.z = z;
                }
            }
        );
        h.on(
            'button',
            function(button, state) {
                if (button === 'GREEN') {
                    layer.button = state ? 0 : 1;
                }
            }
        );
        h.on(
            'color',
            function(port, color) {
                if (port in portToIndex) {
                    layer.ports[portToIndex[port]] = color;
                }
            }
        );
        h.on(
            'rotate',
            function(port, rotation) {
                if (port in portToIndex) {
                    layer.ports[portToIndex[port]] = rotation;
                }
            }
        );
        h.on(
            'attach',
            function(port, device) {
                if (port in portToIndex) {
                    port                        = portToIndex[port];
                    layer.ports[port]           = 0;
                    layer.portAssignments[port] = device;
                }
            }
        );
        h.on(
            'detach',
            function(port) {
                if (port in portToIndex) {
                    layer.portAssignments[portToIndex[port]] = 0;
                }
            }
        );
        h.on(
            'distance',
            function(port, distance) {
            }
        );
    }

    getChanged() {
        return this._changed;
    }

    getDeviceList() {
        if (!this._scanning) {
            this._scanning   = true;
            this._hubs       = [];
            this._hubsByUuid = {};
            this._poweredUP.scan();
        }
        let list = [];
        this._hubs.forEach(
            function(hub) {
                list.push(this._hubsByUuid[hub.uuid]);
            },
            this
        );
        return list;
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
        this._layerCount = layerCount;
    }

    getMotorPosition(layer, port) {
        return this._port[port] || 0;
    }

    connect(uuid, callback) {
        if (uuid in this._hubsByUuid) {
            let hub = this._hubsByUuid[uuid];
            if (!hub.connected && !hub.connecting) {
                hub.connecting  = true;
                hub.connectTime = Date.now();
                this._connectHub(this._hubs[hub.index], hub);
            }
            callback(hub);
        } else {
            callback(null);
        }
    }

    disconnect() {
    }

    playtone(frequency, duration, volume, callback) {
    }

    getHHubByLayer(layer) {
        let h = this._hubs[layer];
        if (!h) {
            return null;
        }
        let hub = this._hubsByUuid[h.uuid];
        if (!hub || !hub.connected) {
            return;
        }
        return {h: h, hub: hub};
    }

    getConnectedTypes(layer) {
    }

    getDefaultModeForType(type) {
        return constants.MODE0;
    }

    motorReset(layer, motor) {
        let hHub = this.getHHubByLayer(layer);
        if (!hHub) {
            return;
        }
        //hHub.h.setAbsolutePosition(['A', 'B', 'C', 'D'][motor], 0);
    }

    motorDegrees(layer, motor, speed, degrees, callback) {
        let hHub = this.getHHubByLayer(layer);
        if (!hHub) {
            return;
        }
        hHub.h.setMotorAngle(['A', 'B', 'C', 'D'][motor], degrees, speed);
    }

    motorOn(layer, motor, speed, callback) {
        // let hHub = this.getHHubByLayer(layer);
        // if (!hHub) {
        //     return;
        // }
        // hHub.h.setMotorAngle(['A', 'B', 'C', 'D'][motor], degrees, speed);
    }

    motorStop(layer, motor, brake, callback) {
        if (!this._connected) {
            return;
        }
    }

    readTouchSensor(layer, port) {
        if (!this._connected) {
            return;
        }
    }

    readSensor(layer, port, type, mode) {
        if (!this._connected) {
            return;
        }
    }

    readMotor(layer, port) {
        if (!this._connected) {
            return;
        }
    }

    readBattery(callback) {
        if (!this._connected) {
            return;
        }
    }

    setLed(layer, color) {
        if (!this._hubs[layer]) {
            return;
        }
        let hub = this._hubs[layer];
        let h   = this._hubsByUuid[hub.uuid];
        if (h.connected && ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 255].indexOf(color) !== -1)) {
            hub.setLEDColor(color);
        }
    }

    listFiles(path, callback) {
    }

    downloadFile(filename, data, callback) {
    }

    createDir(path, callback) {
    }

    deleteFile(path, callback) {
    }

    module(module, command, data) {
        if (this._modules[module]) {
            this._modules[module].run(command, data);
        }
    }

    getStatus() {
        let time   = Date.now();
        let index  = 0;
        let layers = this._layers;
        this._hubs.forEach(
            function(h) {
                let hub = this._hubsByUuid[h.uuid];
                if (hub.connecting && (time > hub.connectTime + 3000)) {
                    hub.connected = true;
                }
                if (hub.connected) {
                    layers[index].uuid         = h.uuid;
                    layers[index].batteryLevel = h.batteryLevel;
                    layers[index].connected    = true;
                    index++;
                }
            },
            this
        );
        return {
            layer0: layers[0],
            layer1: layers[1],
            layer2: layers[2],
            layer3: layers[3]
        };
    }

    setMode(layer, port, mode) {
    }

    stopPolling() {
        this._stopPolling = true;
    }

    resumePolling() {
        this._stopPolling = false;
    }
};
