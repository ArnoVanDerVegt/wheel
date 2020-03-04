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
        this._connectedHubs = [];
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
            buttonLeft:      0,
            buttonRight:     0,
            button:          0,
            hubLed:          null,
            hubButtons:      [],
            tilt:            {x: 0, y: 0, z: 0},
            accel:           {x: 0, y: 0, z: 0},
            ports:           [0, 0, 0, 0],
            resetValues:     [0, 0, 0, 0],
            portAssignments: [0, 0, 0, 0],
            portDevices:     [null, null, null, null]
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
            type:       hub.type,
            title:      hub.name,
            subTitle:   uuid,
            connecting: false,
            connected:  false
        };
        this._hubs.push(hub);
        this._changed++;
    }

    _attachEvents(index, h, hub) {
        let layer   = this._layers[index];
        let devices = h.getDevices();
        layer.connected = true;
        devices.forEach(this.onAttachDevice.bind(this, layer));
        h.on('disconnect', this.onDisconnect.bind(this, hub));
        h.on('tilt',       this.onTilt.bind(this, layer));
        h.on('accel',      this.onAccel.bind(this, layer));
        h.on('button',     this.onButton.bind(this, layer));
        h.on('rotate',     this.onRotate.bind(this, layer));
        h.on('attach',     this.onAttachDevice.bind(this, layer));
        h.on('detach',     this.onDetachDevice.bind(this, layer));
    }

    onAttachDevice(layer, device) {
        if (device.portName in portToIndex) {
            let port = portToIndex[device.portName];
            layer.portAssignments[port] = device.type;
            layer.portDevices[port]     = device;
            switch (device.type) {
                case 37: // Color and distance
                    device.on('colorAndDistance', this.onColorAndDistance.bind(this, layer, port));
                    break;
            }
        } else {
            switch (device.type) {
                case 23: // Led...
                    layer.hubLed = device;
                    break;
                case 55: // Remote control buttons...
                    let index = layer.hubButtons.length;
                    layer.hubButtons.push(device);
                    device.on('remoteButton', this.onRemoteButton.bind(this, index, layer));
                    break;
            }
        }
    }

    onDetachDevice(layer, device) {
        if (device.portName in portToIndex) {
            let port = portToIndex[device.portName];
            layer.portAssignments[port] = 0;
            layer.portDevices[port]     = null;
        }
    }

    onDisconnect(hub) {
        hub.connected = false;
    }

    onColorAndDistance(layer, port, event) {
        layer.ports[port] = event.distance; // Distance or color depending on mode!
    }

    onRotate(layer, device) {
        if (device.portName in portToIndex) {
            let port = portToIndex[device.portName];
            layer.ports[port] = device.values.rotate.degrees - layer.resetValues[port];
        }
    }

    onButton(layer, event) {
        layer.button = event.event ? 0 : 1;
    }

    onTilt(layer, event) {
        let tilt = event.values.tilt;
        layer.tilt.x = tilt.x;
        layer.tilt.y = tilt.y;
        layer.tilt.z = tilt.z;
    }

    onAccel(layer, event) {
        let accel = event.values.accel;
        layer.accel.x = accel.x;
        layer.accel.y = accel.y;
        layer.accel.z = accel.z;
    }

    onRemoteButton(index, layer, event) {
        let value = 0;
        switch (event.event) {
            case 255: // "-"
                value = 1;
                break;
            case 127: // Red
                value = 2;
                break;
            case 1:  // "+"
                value = 4;
                break;
        }
        switch (index) {
            case 0:
                layer.buttonLeft = value;
                break;
            case 1:
                layer.buttonRight = value;
                break;
        }
        layer.button = (layer.buttonLeft << 3) + layer.buttonRight;
    }

    _connectHub(h, hub) {
        h.connect(); // Connect to the Hub
    }

    _updateConnectedHubs() {
        let connectedHubs     = this._connectedHubs;
        let connectedHubUuids = {};
        let hubsByUuid        = this._hubsByUuid;
        connectedHubs.forEach(function(connectedHub) {
            connectedHubUuids[connectedHub.uuid] = true;
        });
        this._hubs.forEach(
            function(hub) {
                if (hub.uuid in connectedHubUuids) {
                    return;
                }
                if (hubsByUuid[hub.uuid].connected) {
                    this._attachEvents(connectedHubs.length, hub, hubsByUuid[hub.uuid]);
                    connectedHubs.push(hub);
                }
            },
            this
        );
    }

    getChanged() {
        return this._changed;
    }

    getDeviceList() {
        if (!this._scanning) {
            this._scanning      = true;
            this._connectedHubs = [];
            this._hubs          = [];
            this._hubsByUuid    = {};
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

    getDevice(layer, port) {
        const device = this._layers[layer].portDevices[port];
        if (!device || !device.connected) {
            return null;
        }
        return device;
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
        let h = this._connectedHubs[layer];
        if (!h) {
            return null;
        }
        let hub = this._hubsByUuid[h.uuid];
        if (!hub || !hub.connected) {
            return null;
        }
        return {h: h, hub: hub};
    }

    getHubConnected(layer) {
        let hHub = this.getHHubByLayer(layer);
        if (!hHub) {
            return false;
        }
        return hHub.hub.connected;
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
        let layers = this._layers;
        if (!layers[layer] || !(motor in layers[layer].resetValues)) {
            return;
        }
        layer = layers[layer];
        layer.resetValues[motor] = layer.ports[motor];
        layer.ports[motor]       = 0;
    }

    motorDegrees(layer, motor, speed, degrees, callback) {
        if (!this.getHubConnected(layer)) {
            return;
        }
        const motorDevice = this.getDevice(layer, motor);
        if (!motorDevice) {
            return;
        }
        if (motorDevice.rotateByDegrees) {
            if (degrees < 0) {
                degrees *= -1;
                speed   *= -1;
            }
            motorDevice.rotateByDegrees(degrees, speed);
        }
        callback && callback();
    }

    motorOn(layer, motor, speed, callback) {
        if (!this.getHubConnected(layer)) {
            return;
        }
        const motorDevice = this.getDevice(layer, motor);
        if (!motorDevice) {
            return;
        }
        if (motorDevice.setPower) {
            motorDevice.setPower(speed);
        }
        if (motorDevice.setBrightness) {
            motorDevice.setBrightness(speed);
        }
        callback && callback();
    }

    motorStop(layer, motor, brake, callback) {
        if (!this.getHubConnected(layer)) {
            return;
        }
        const motorDevice = this.getDevice(layer, motor);
        if (!motorDevice) {
            return;
        }
        if (motorDevice.stop) {
            motorDevice.stop();
        }
        if (motorDevice.setBrightness) {
            motorDevice.setBrightness(0);
        }
        callback && callback();
    }

    readTouchSensor(layer, port) {
    }

    readSensor(layer, port, type, mode) {
    }

    readMotor(layer, port) {
    }

    readBattery(callback) {
    }

    setLed(layer, color) {
        if (!this._hubs[layer]) {
            return;
        }
        let hub = this._hubs[layer];
        let h   = this._hubsByUuid[hub.uuid];
        if (h.connected && ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 255].indexOf(color) !== -1)) {
            if (hub.setLEDColor) {
                hub.setLEDColor(color);
            } else {
                let hubLed = this._layers[layer].hubLed;
                if (hubLed && hubLed.setColor) {
                    hubLed.setColor(color);
                }
            }
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
        let layers = this._layers;
        this._hubs.forEach(
            function(h) {
                let hub = this._hubsByUuid[h.uuid];
                if (hub.connecting && (time > hub.connectTime + 3000)) {
                    hub.connecting = false;
                    hub.connected  = true;
                    this._updateConnectedHubs();
                }
            },
            this
        );
        this._connectedHubs.forEach(
            function(h, index) {
                let hub = this._hubsByUuid[h.uuid];
                layers[index].uuid         = h.uuid;
                layers[index].type         = h.type;
                layers[index].batteryLevel = h.batteryLevel;
                layers[index].connected    = true;
            },
            this
        );
        const copyLayer = function(layer) {
                    let result = Object.assign({}, layer);
                    delete result.portDevices;
                    delete result.hubLed;
                    delete result.hubButtons;
                    return result;
                };
        return {
            layer0: copyLayer(layers[0]),
            layer1: copyLayer(layers[1]),
            layer2: copyLayer(layers[2]),
            layer3: copyLayer(layers[3])
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
