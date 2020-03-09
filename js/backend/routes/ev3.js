/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const messageEncoder = require('../../shared/device/ev3/messageEncoder');
const CommandQueue   = require('../../shared/device/ev3/CommandQueue').CommandQueue;
const EV3            = require('../../shared/device/ev3/EV3').EV3;
const constants      = require('../../shared/device/ev3/constants');
const path           = require('path');
const fs             = require('fs');

let ev3         = null;
let currentPath = {};

const getSerialPortConstructor = function() {
        return require('serialport');
    };

const getEV3 = function() {
        if (ev3) {
            return ev3;
        }
        ev3 = new EV3({serialPortConstructor: getSerialPortConstructor()});
        return ev3;
    };

exports.ev3Routes = {
    deviceList: function(req, res) {
        getSerialPortConstructor().list().then(function(ports) {
            let list = [];
            ports.forEach(function(port) {
                list.push(port.path);
            });
            res.send(JSON.stringify({result: true, list: list}));
        });
    },
    connect: function(req, res) {
        let deviceName = req.body.deviceName;
        getEV3().connect(deviceName);
        res.send(JSON.stringify({connecting: true, deviceName: deviceName}));
    },
    disconnect: function(req, res) {
        getEV3().disconnect(function() {});
        res.send(JSON.stringify({}));
    },
    connecting: function(req, res) {
        let connected = getEV3().getConnected();
        let state     = {};
        if (connected) {
            state = getEV3().getState();
        }
        res.send(JSON.stringify({
            connected: connected,
            state:     state
        }));
    },
    connected: function(req, res) {
        res.send(JSON.stringify({connected: getEV3().getConnected()}));
    },
    update: function(req, res) {
        let result = {error: false, connected: true};
        let ev3  = getEV3();
        if (ev3.getConnected()) {
            ev3.setLayerCount(req.body.layerCount);
            let queue = (typeof req.body.queue === 'string') ? JSON.parse(req.body.queue) : req.body.queue;
            queue.forEach(function(params) {
                ev3.module(params.module, params.command, params.data);
            });
            result.state = ev3.getState();
        } else {
            result.connected = false;
        }
        res.send(JSON.stringify(result));
    },
    files: function(req, res) {
        function isVirtualRoot(path) {
            if (path.substr(-1) === '/') {
                path = path.substr(0, path.length - 1);
            }
            return (path === '../prjs');
        }
        let index = req.query.index;
        if (!(index in currentPath)) {
            currentPath[index] = '../prjs/';
        }
        if (req.query.changePath && !(isVirtualRoot(currentPath[index]) && (req.query.changePath === '..'))) {
            currentPath[index] = path.join(currentPath[index], req.query.changePath);
        }
        if (req.query.path) {
            currentPath[index] = path;
        }
        let done     = false;
        let callback = function(files) {
                if (done || !files.length) {
                    return;
                }
                done = true;
                let virtualRoot = isVirtualRoot(currentPath[index]);
                let result      = {
                        files: [],
                        path:  currentPath[index]
                    };
                files.forEach(function(file) {
                    if ((file !== './') && !(virtualRoot && (file === '../'))) {
                        let directory = !((file.length > 31) && (file.substr(32, 1) === ' '));
                        let size      = '';
                        let hash      = '';
                        if (!directory) {
                            hash = file.substr(0, 32);
                            size = parseInt(file.substr(33, 8), 16);
                            file = file.substr(42, file.length - 42);
                        }
                        result.files.push({
                            name:      file,
                            size:      size,
                            hash:      hash,
                            directory: directory
                        });
                    }
                });
                res.send(JSON.stringify(result));
            };
        let getFiles = function() {
                getEV3().listFiles(currentPath[index], callback);
            };
        let update = function() {
                if (!done) {
                    getFiles();
                    setTimeout(update, 750);
                }
            };
        update();
    },
    _donwloadData: function(data, remoteFilename, callback) {
        let s = '';
        if (typeof data === 'string') {
            for (let i = 0; i < data.length; i++) {
                s += messageEncoder.byteString(data.charCodeAt(i));
            }
        } else {
            for (let i = 0; i < data.length; i++) {
                s += messageEncoder.byteString(data[i]);
            }
        }
        getEV3().downloadFile(remoteFilename, s, callback);
    },
    downloadData: function(req, res) {
        this._donwloadData(
            req.body.data,
            req.body.remoteFilename,
            function() {
                res.send(JSON.stringify({error: false}));
            }
        );
    },
    download: function(req, res) {
        let result         = {};
        let localFilename  = req.body.localFilename;
        let remoteFilename = req.body.remoteFilename;
        if (fs.existsSync(path.sep + localFilename)) {
            localFilename = path.sep + localFilename;
        }
        if (fs.existsSync(localFilename)) {
            let data = fs.readFileSync(localFilename);
            this._donwloadData(
                data,
                remoteFilename,
                function() {
                    result.error = false;
                    res.send(JSON.stringify(result));
                }
            );
        } else {
            result.error   = true;
            result.message = 'File not found';
            res.send(JSON.stringify(result));
        }
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
    createDir: function(req, res) {
        getEV3().createDir(req.body.path, this._createTimeoutCallback(res));
    },
    deleteFile: function(req, res) {
        getEV3().deleteFile(req.body.path, this._createTimeoutCallback(res));
    },
    stopAllMotors(req, res) {
        let result     = {success: true};
        let layerCount = req.body.layerCount;
        let brake      = req.body.brake ? 1 : 0;
        let ev3        = getEV3();
        for (let i = 0; i < layerCount; i++) {
            for (let j = 0; j < 4; j++) {
                ev3.motorStop(i, j, brake);
            }
        }
        res.send(JSON.stringify(result));
    },
    stopPolling(req, res) {
        getEV3().stopPolling();
        res.send(JSON.stringify({success: true}));
    },
    resumePolling(req, res) {
        getEV3().resumePolling();
        res.send(JSON.stringify({success: true}));
    },
    setMode(req, res) {
        let body = req.body;
        getEV3().setMode(body.layer, body.port, body.mode);
        res.send(JSON.stringify({success: true}));
    }
};
