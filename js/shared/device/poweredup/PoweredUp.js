/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../vm/modules/sensorModuleConstants');
const BasicDevice           = require('../BasicDevice').BasicDevice;
const poweredUpConstants    = require('node-poweredup').Consts;
const PoweredUP             = require('node-poweredup');

const PORT_TO_INDEX         = {A: 0, B: 1, C: 2, D: 3};

const REMOTE_BUTTON_MINUS   = 255;
const REMOTE_BUTTON_RED     = 127;
const REMOTE_BUTTON_PLUS    =   1;

const DIRECTION_REVERSE     =  -1;
const DIRECTION_NONE        =   0;
const DIRECTION_FORWARD     =   1;

exports.PoweredUp = class extends BasicDevice {
    constructor(opts) {
        super(opts);
        this._layerCount    = 0;
        this._scanning      = false;
        this._connectedHubs = [];
        this._hubs          = [];
        this._hubsByUuid    = {};
        this._changed       = 0;
        this._layers        = [this.initLayer(), this.initLayer(), this.initLayer(), this.initLayer()];
        this._poweredUP     = new PoweredUP.PoweredUP();
        this._poweredUP.on('discover', this._addHub.bind(this));
        setInterval(this.motorMonitor.bind(this), 5);
    }

    initLayer() {
        let result = {
                connected:       false,
                buttonLeft:      0,
                buttonRight:     0,
                button:          0,
                hubLed:          null,
                hubButtons:      [],
                tilt:            {x: 0, y: 0, z: 0},
                accel:           {x: 0, y: 0, z: 0},
                ports:           []
            };
        for (let i = 0; i < 4; i++) {
            result.ports.push({
                value:            0,
                reset:            0,
                assigned:         0,
                device:           null,
                moving:           false,
                currentDirection: DIRECTION_NONE,
                degrees:          0,
                startDegrees:     null,
                endDegrees:       null
            });
        }
        return result;
    }

    _addHub(hub) {
        if ([
                poweredUpConstants.HubType.MOVE_HUB,
                poweredUpConstants.HubType.REMOTE_CONTROL,
                poweredUpConstants.HubType.TECHNIC_MEDIUM_HUB
            ].indexOf(hub.type) === -1) {
            return;
        }
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
        if (device.portName in PORT_TO_INDEX) {
            let port = layer.ports[PORT_TO_INDEX[device.portName]];
            port.assigned = device.type;
            port.device   = device;
            switch (device.type) {
                case poweredUpConstants.DeviceType.COLOR_DISTANCE_SENSOR:
                    device.on('colorAndDistance', this.onColorAndDistance.bind(this, layer, port));
                    break;
            }
        } else {
            switch (device.type) {
                case poweredUpConstants.DeviceType.HUB_LED:
                    layer.hubLed = device;
                    break;
                case poweredUpConstants.DeviceType.REMOTE_CONTROL_BUTTON:
                    let index = layer.hubButtons.length;
                    layer.hubButtons.push(device);
                    device.on('remoteButton', this.onRemoteButton.bind(this, index, layer));
                    break;
                case poweredUpConstants.DeviceType.MOVE_HUB_TILT_SENSOR:
                    device.on('tilt', this.onMoveHubTilt.bind(this, layer));
                    break;
            }
        }
    }

    onDetachDevice(layer, device) {
        if (device.portName in PORT_TO_INDEX) {
            let port = layer.ports[PORT_TO_INDEX[device.portName]];
            port.assigned = 0;
            port.device   = null;
        }
    }

    onDisconnect(hub) {
        hub.connected = false;
    }

    onColorAndDistance(layer, port, event) {
        port.value = event.distance; // Todo: Distance or color depending on mode!
    }

    onRotate(layer, device) {
        if (device.portName in PORT_TO_INDEX) {
            let port = layer.ports[PORT_TO_INDEX[device.portName]];
            port.degrees = device.values.rotate.degrees;
            port.value   = device.values.rotate.degrees - port.reset;
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

    onMoveHubTilt(layer, tilt) {
        layer.tilt.x = tilt.x;
        layer.tilt.y = tilt.y;
        layer.tilt.z = 0;
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
            case REMOTE_BUTTON_MINUS: value = 1; break;
            case REMOTE_BUTTON_RED:   value = 2; break;
            case REMOTE_BUTTON_PLUS:  value = 4; break;
        }
        switch (index) {
            case 0: layer.buttonLeft  = value; break;
            case 1: layer.buttonRight = value; break;
        }
        layer.button = (layer.buttonLeft << 3) + layer.buttonRight;
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
        const device = this._layers[layer].ports[port].device;
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
                this._hubs[hub.index].connect();
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
        return 0;
    }

    getPUBrake(brake) {
        return brake ? poweredUpConstants.BrakingStyle.HOLD : poweredUpConstants.BrakingStyle.FLOAT;
    }

    setDirection(port, direction) {
        if (port.currentDirection !== direction) {
            switch (direction) {
                case DIRECTION_REVERSE:
                    port.motorDevice.setPower(-port.speed);
                    break;
                case DIRECTION_NONE:
                    port.moving = false;
                    port.motorDevice.setPower(0);
                    break;
                case DIRECTION_FORWARD:
                    port.motorDevice.setPower(port.speed);
                    break;
            }
            port.currentDirection = direction;
        }
    }

    motorReset(layer, motor) {
        let hHub = this.getHHubByLayer(layer);
        if (!hHub) {
            return;
        }
        let layers = this._layers;
        if (!layers[layer] || !(motor in layers[layer].ports)) {
            return;
        }
        let port = layers[layer].ports[motor];
        port.reset = port.degrees;
        port.value = 0;
    }

    motorMonitor() {
        const time = Date.now();
        let layers = this._layers;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let port        = layers[i].ports[j];
                let motorDevice = port.motorDevice;
                if (motorDevice) {
                    if (port.moving) {
                        if (Math.abs(port.endDegrees - port.degrees) < 45) {
                            this.setDirection(port, DIRECTION_NONE);
                        } else if (port.degrees < port.endDegrees) {
                            this.setDirection(port, DIRECTION_FORWARD);
                        } else {
                            this.setDirection(port, DIRECTION_REVERSE);
                        }
                    } else {
                        this.setDirection(port, DIRECTION_NONE);
                    }
                }
            }
        }
    }

    motorDegrees(layer, motor, speed, degrees, brake, callback) {
        if (!this.getHubConnected(layer)) {
            return;
        }
        const motorDevice = this.getDevice(layer, motor);
        if (!motorDevice) {
            return;
        }
        if (motorDevice.setBrakingStyle) {
            motorDevice.setBrakingStyle(this.getPUBrake(brake));
        }
        if (motorDevice.rotateByDegrees) {
            let port = this._layers[layer].ports[motor];
            this.setDirection(port, DIRECTION_NONE);
            port.motorDevice      = motorDevice;
            port.moving           = true;
            port.startDegrees     = port.degrees;
            port.endDegrees       = port.degrees + degrees;
            port.speed            = speed;
            port.currentDirection = DIRECTION_NONE;
        }
        callback && callback();
    }

    motorOn(layer, motor, speed, brake, callback) {
        if (!this.getHubConnected(layer)) {
            return;
        }
        const motorDevice = this.getDevice(layer, motor);
        if (motorDevice) {
            motorDevice.setBrakingStyle && motorDevice.setBrakingStyle(this.getPUBrake(brake));
            motorDevice.setPower        && motorDevice.setPower(speed);
            motorDevice.setBrightness   && motorDevice.setBrightness(speed);
        }
        callback && callback();
    }

    motorStop(layer, motor, brake, callback) {
        if (!this.getHubConnected(layer)) {
            return;
        }
        const motorDevice = this.getDevice(layer, motor);
        if (motorDevice) {
            motorDevice.setBrakingStyle && motorDevice.setBrakingStyle(this.getPUBrake(brake));
            motorDevice.stop            && motorDevice.stop();
            motorDevice.setBrightness   && motorDevice.setBrightness(0);
        }
        callback && callback();
    }

    readTouchSensor(layer, port) {}
    readSensor(layer, port, type, mode) {}
    readMotor(layer, port) {}
    readBattery(callback) {}

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

    listFiles(path, callback) {}
    downloadFile(filename, data, callback) {}
    createDir(path, callback) {}
    deleteFile(path, callback) {}

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
                    let result = {
                            uuid:      layer.uuid,
                            type:      layer.type,
                            connected: layer.connected,
                            button:    layer.button,
                            tilt:      layer.tilt,
                            accel:     layer.accel,
                            ports:     [],
                        };
                    let d = false;
                    for (let i = 0; i < 4; i++) {
                        let port = layer.ports[i];
                        result.ports.push({
                            value:    port.value,
                            assigned: port.assigned,
                            ready:    !port.moving
                        });
                    }
                    return result;
                };
        let result = {layers: []};
        for (let i = 0; i < 4; i++) {
            result.layers.push(copyLayer(layers[i]));
        }
        return result;
    }

    setMode(layer, port, mode) {}
    stopPolling() {}
    resumePolling() {}
};
