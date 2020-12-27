/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const constants = require('../../../shared/device/spike/constants');

exports.SpikeRoutes = class {
    constructor(opts) {
        this._spike                 = opts.spike;
        this._serialPortConstructor = opts.serialPortConstructor;
    }

    deviceList(req, res) {
        let spike = this._spike;
        new this._serialPortConstructor().getPorts((ports) => {
            let list = [];
            ports.forEach((port) => {
                list.push({
                    title:      port.path,
                    connected:  spike.getConnected(port.path),
                    connecting: spike.getConnecting(port.path)
                });
            });
            res.send(JSON.stringify({result: true, list: list}));
        });
    }

    connect(req, res) {
        let deviceName = req.body.deviceName;
        this._spike.connect(deviceName);
        res.send(JSON.stringify({connecting: true, deviceName: deviceName}));
    }

    disconnect(req, res) {
        this._spike.disconnect(() => {});
        res.send(JSON.stringify({}));
    }

    connecting(req, res) {
        let connected = this._spike.getConnected();
        let state     = {};
        if (connected) {
            state = this._spike.getState();
        }
        res.send(JSON.stringify({
            connected: connected,
            state:     state
        }));
    }

    connected(req, res) {
        res.send(JSON.stringify({connected: this._spike.getConnected()}));
    }

    update(req, res) {
        let result           = {error: false, connected: true};
        let queue            = (typeof req.body.queue === 'string') ? JSON.parse(req.body.queue) : req.body.queue;
        let messagesReceived = {};
        let spike            = this._spike;
        spike.setActiveLayerCount(req.body.activeLayerCount);
        queue.forEach((params) => {
            spike.module(params.module, params.command, params.data);
            messagesReceived[params.messageId] = true;
        });
        result.state            = spike.getState();
        result.messagesReceived = messagesReceived;
        res.send(JSON.stringify(result));
    }

    _createTimeoutCallback(res) {
        let done     = false;
        let timeout  = null;
        let callback = function(success) {
                if (done) {
                    return;
                }
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                done = true;
                res.send(JSON.stringify({error: !success}));
            };
        timeout = setTimeout(callback, 500);
        return callback;
    }

    stopAllMotors(req, res) {
        let result     = {success: true};
        let layerCount = req.body.layerCount;
        let brake      = req.body.brake ? 1 : 0;
        let spike      = this._spike;
        for (let i = 0; i < layerCount; i++) {
            for (let j = 0; j < 4; j++) {
                spike.motorStop(i, j, brake);
            }
        }
        res.send(JSON.stringify(result));
    }

    stopPolling(req, res) {
        this._spike.stopPolling();
        res.send(JSON.stringify({success: true}));
    }

    resumePolling(req, res) {
        this._spike.resumePolling();
        res.send(JSON.stringify({success: true}));
    }

    setMode(req, res) {
        let body = req.body;
        this._spike.setMode(body.layer, body.port, body.mode);
        res.send(JSON.stringify({success: true}));
    }
};
