/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const messageEncoder = require('../../shared/brick/messageEncoder');
const CommandQueue   = require('../../shared/brick/CommandQueue').CommandQueue;
const Brick          = require('../../shared/brick/Brick').Brick;
const constants      = require('../../shared/brick/constants');
const path           = require('path');
const fs             = require('fs');

let brick       = null;
let currentPath = {};

const getSerialPortConstructor = function() {
        return require('serialport');
    };

const getBrick = function() {
        if (brick) {
            return brick;
        }
        brick = new Brick({serialPortConstructor: getSerialPortConstructor()});
        return brick;
    };

exports.ev3Routes = {
    deviceList: function(req, res) {
        getSerialPortConstructor().list().then(function(ports) {
            let list = [];
            ports.forEach(function(port) {
                list.push(port.comName);
            });
            res.send(JSON.stringify({result: true, list: list}));
        });
    },
    connect: function(req, res) {
        let deviceName = req.body.deviceName;
        getBrick().connect(deviceName);
        res.send(JSON.stringify({connecting: true, deviceName: deviceName}));
    },
    disconnect: function(req, res) {
        getBrick().disconnect(function() {});
        res.send(JSON.stringify({}));
    },
    connecting: function(req, res) {
        let connected = getBrick().getConnected();
        let status    = {};
        if (connected) {
            status = getBrick().getStatus();
        }
        res.send(JSON.stringify({
            connected: connected,
            status:    status
        }));
    },
    connected: function(req, res) {
        res.send(JSON.stringify({connected: getBrick().getConnected()}));
    },
    update: function(req, res) {
        let result = {error: false, connected: true};
        let brick  = getBrick();
        if (brick.getConnected()) {
                brick.setLayerCount(req.body.layerCount);
            // Try {
                let queue = (typeof req.body.queue === 'string') ? JSON.parse(req.body.queue) : req.body.queue;
                queue.forEach(function(params) {
                    brick.module(params.module, params.command, params.data);
                });
            // } catch (error) {
                // Result.error = true;
            // }
            result.status = brick.getStatus();
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
                getBrick().listFiles(currentPath[index], callback);
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
        getBrick().downloadFile(remoteFilename, s, callback);
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
        getBrick().createDir(req.body.path, this._createTimeoutCallback(res));
    },
    deleteFile: function(req, res) {
        getBrick().deleteFile(req.body.path, this._createTimeoutCallback(res));
    },
    stopAllMotors(req, res) {
        let result     = {success: true};
        let layerCount = req.body.layerCount;
        let brake      = req.body.brake ? 1 : 0;
        let brick      = getBrick();
        for (let i = 0; i < layerCount; i++) {
            for (let j = 0; j < 4; j++) {
                brick.motorStop(i, j, brake);
            }
        }
        res.send(JSON.stringify(result));
    },
    stopPolling(req, res) {
        getBrick().stopPolling();
        res.send(JSON.stringify({success: true}));
    },
    resumePolling(req, res) {
        getBrick().resumePolling();
        res.send(JSON.stringify({success: true}));
    },
    setMode(req, res) {
        let body = req.body;
        console.log(body.layer, body.port, body.mode);
        getBrick().setMode(body.layer, body.port, body.mode);
        res.send(JSON.stringify({success: true}));
    }
};
