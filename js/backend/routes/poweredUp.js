/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const PoweredUp = require('../../shared/device/PoweredUp').PoweredUp;
const constants = require('../../shared/device/constants');

let poweredUp = null;

const getPoweredUp = function() {
        if (poweredUp) {
            return poweredUp;
        }
        poweredUp = new PoweredUp({});
        return poweredUp;
    };

exports.poweredUpRoutes = {
    deviceList: function(req, res) {
        let poweredUp = getPoweredUp();
        res.send(JSON.stringify({result: true, changed: poweredUp.getChanged(), list: poweredUp.getDeviceList()}));
    },
    connect: function(req, res) {
        let uuid = req.body.uuid;
        getPoweredUp().connect(
            uuid,
            function(hub) {
                res.send(JSON.stringify(hub));
            }
        );
    },
    disconnect: function(req, res) {
        getPoweredUp().disconnect(function() {});
        res.send(JSON.stringify({}));
    },
    connecting: function(req, res) {
        let connected = getPoweredUp().getConnected();
        let status    = {};
        if (connected) {
            status = getPoweredUp().getStatus();
        }
        res.send(JSON.stringify({
            connected: connected,
            status:    status
        }));
    },
    connected: function(req, res) {
        res.send(JSON.stringify({connected: getPoweredUp().getConnected()}));
    },
    update: function(req, res) {
        let result = {error: false, connected: true};
        let queue  = (typeof req.body.queue === 'string') ? JSON.parse(req.body.queue) : req.body.queue;
        queue.forEach(function(params) {
            poweredUp.module(params.module, params.command, params.data);
        });
        result.status = poweredUp.getStatus();
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
        let poweredUp  = getPoweredUp();
        for (let i = 0; i < layerCount; i++) {
            for (let j = 0; j < 4; j++) {
                poweredUp.motorStop(i, j, brake);
            }
        }
        res.send(JSON.stringify(result));
    },
    stopPolling(req, res) {
        getPoweredUp().stopPolling();
        res.send(JSON.stringify({success: true}));
    },
    resumePolling(req, res) {
        getPoweredUp().resumePolling();
        res.send(JSON.stringify({success: true}));
    },
    setMode(req, res) {
        let body = req.body;
        getPoweredUp().setMode(body.layer, body.port, body.mode);
        res.send(JSON.stringify({success: true}));
    }
};
