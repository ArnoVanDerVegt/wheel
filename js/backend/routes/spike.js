/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Spike     = require('../../shared/device/spike/Spike').Spike;
const constants = require('../../shared/device/spike/constants');
const path      = require('path');
const fs        = require('fs');

let spike       = null;

const getSerialPortConstructor = function() {
        return require('serialport');
    };

const getSpike = function() {
        if (spike) {
            return spike;
        }
        spike = new Spike({serialPortConstructor: getSerialPortConstructor()});
        return spike;
    };

exports.spikeRoutes = {
    deviceList: function(req, res) {
        let spike = getSpike();
        getSerialPortConstructor().list().then((ports) => {
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
    },

    connect: function(req, res) {
        let deviceName = req.body.deviceName;
        getSpike().connect(deviceName);
        res.send(JSON.stringify({connecting: true, deviceName: deviceName}));
    },

    disconnect: function(req, res) {
        getSpike().disconnect(() => {});
        res.send(JSON.stringify({}));
    },

    connecting: function(req, res) {
        let connected = getSpike().getConnected();
        let state     = {};
        if (connected) {
            state = getSpike().getState();
        }
        res.send(JSON.stringify({
            connected: connected,
            state:     state
        }));
    },

    connected: function(req, res) {
        res.send(JSON.stringify({connected: getSpike().getConnected()}));
    },

    update: function(req, res) {
        let result = {error: false, connected: true};
        let spike  = getSpike();
        if (spike.getConnected()) {
            spike.setLayerCount(req.body.layerCount);
            let queue = (typeof req.body.queue === 'string') ? JSON.parse(req.body.queue) : req.body.queue;
            queue.forEach((params) => {
                spike.module(params.module, params.command, params.data);
            });
            result.state = spike.getState();
        } else {
            result.connected = false;
        }
        res.send(JSON.stringify(result));
    },

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
    },

    stopAllMotors(req, res) {
        let result     = {success: true};
        let layerCount = req.body.layerCount;
        let brake      = req.body.brake ? 1 : 0;
        let spike        = getSpike();
        for (let i = 0; i < layerCount; i++) {
            for (let j = 0; j < 4; j++) {
                spike.motorStop(i, j, brake);
            }
        }
        res.send(JSON.stringify(result));
    },

    stopPolling(req, res) {
        getSpike().stopPolling();
        res.send(JSON.stringify({success: true}));
    },

    resumePolling(req, res) {
        getSpike().resumePolling();
        res.send(JSON.stringify({success: true}));
    },

    setMode(req, res) {
        let body = req.body;
        getSpike().setMode(body.layer, body.port, body.mode);
        res.send(JSON.stringify({success: true}));
    }
};
