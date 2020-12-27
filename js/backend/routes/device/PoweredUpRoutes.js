/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.PoweredUpRoutes = class {
    constructor(opts) {
        this._poweredUp = opts.poweredUp;
    }

    discover(req, res) {
        this._poweredUp.discover(req.body.autoConnect || []);
        res.send(JSON.stringify({}));
    }

    deviceList(req, res) {
        let poweredUp   = this._poweredUp;
        let autoConnect = req.body.autoConnect || [];
        let list        = poweredUp.getDeviceList(autoConnect);
        res.send(JSON.stringify({result: true, changed: poweredUp.getChanged(), list: list}));
    }

    connectedDeviceList(req, res) {
        let poweredUp   = this._poweredUp;
        let autoConnect = req.body.autoConnect || [];
        res.send(JSON.stringify({result: true, changed: poweredUp.getChanged(), list: poweredUp.getConnectedDeviceList(autoConnect)}));
    }

    connect(req, res) {
        let uuid = req.body.uuid;
        this._poweredUp.connect(
            uuid,
            function(hub) {
                res.send(JSON.stringify(hub));
            }
        );
    }

    disconnect(req, res) {
        this._poweredUp.disconnect(() => {});
        res.send(JSON.stringify({}));
    }

    disconnectAll(req, res) {
        this._poweredUp.disconnectAll(() => {});
        res.send(JSON.stringify({}));
    }

    connecting(req, res) {
        let connected = this._poweredUp.getConnected();
        let state     = {};
        if (connected) {
            state = this._poweredUp.getState();
        }
        res.send(JSON.stringify({
            connected: connected,
            state:     state
        }));
    }

    connected(req, res) {
        res.send(JSON.stringify({connected: this._poweredUp.getConnected()}));
    }

    update(req, res) {
        let result           = {error: false, connected: true};
        let queue            = (typeof req.body.queue === 'string') ? JSON.parse(req.body.queue) : req.body.queue;
        let messagesReceived = {};
        let poweredUp        = this._poweredUp;
        poweredUp.setActiveLayerCount(req.body.activeLayerCount);
        queue.forEach((params) => {
            poweredUp.module(params.module, params.command, params.data);
            messagesReceived[params.messageId] = true;
        });
        result.state            = poweredUp.getState();
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
        let result           = {success: true};
        let activeLayerCount = req.body.activeLayerCount;
        let brake            = req.body.brake ? 1 : 0;
        let poweredUp        = this._poweredUp;
        for (let i = 0; i < activeLayerCount; i++) {
            for (let j = 0; j < 4; j++) {
                poweredUp.motorStop(i, j, brake);
            }
        }
        res.send(JSON.stringify(result));
    }

    stopPolling(req, res) {
        this._poweredUp.stopPolling();
        res.send(JSON.stringify({success: true}));
    }

    resumePolling(req, res) {
        this._poweredUp.resumePolling();
        res.send(JSON.stringify({success: true}));
    }

    setMode(req, res) {
        let body = req.body;
        this._poweredUp.setMode(body.layer, body.port, body.mode);
        res.send(JSON.stringify({success: true}));
    }
};
