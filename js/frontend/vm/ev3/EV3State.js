/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher       = require('../../lib/dispatcher').dispatcher;
const getDataProvider  = require('../../lib/dataprovider/dataProvider').getDataProvider;
const BasicDeviceState = require('../BasicDeviceState').BasicDeviceState;
const LayerState       = require('./LayerState').LayerState;

exports.EV3State = class extends BasicDeviceState {
    constructor(opts) {
        opts.LayerState = LayerState;
        super(opts);
        this._battery    = null;
        this._deviceName = 'EV3';
        dispatcher
            .on('EV3.ConnectToDevice', this, this.onConnectToDevice)
            .on('EV3.LayerCount',      this, this.onLayerCount);
    }

    getAbsolutePosition() {
        return false;
    }

    getConnected() {
        return this._connected;
    }

    getLayerState(layer) {
        return this._layerState[layer];
    }

    getDeviceName() {
        return this._deviceName;
    }

    setStatus(status) {
        if (status.battery !== this._battery) {
            this._battery = status.battery;
            this.emit('EV3.Battery', status.battery);
        }
    }

    getQueueLength() {
        return this._queue.length;
    }

    onLayerCount(layerCount) {
        this._layerCount = layerCount;
    }

    onConnectToDevice(deviceName) {
        if (this._connecting || this._connected) {
            return;
        }
        this._deviceName = deviceName;
        this.emit('EV3.Connecting', deviceName);
        getDataProvider().getData(
            'post',
            'ev3/connect',
            {deviceName: deviceName},
            (function(data) {
                try {
                    let json = JSON.parse(data);
                    if (json.connecting) {
                        this.connecting();
                        this._deviceName = json.deviceName;
                        this._connecting = true;
                    }
                } catch (error) {
                    // Todo: show error message in IDE...
                    console.error(error);
                    this._connecting = false;
                }
            }).bind(this)
        );
    }

    updateLayerStatus(data) {
        this.setStatus(data.status);
        for (let i = 0; i < 4; i++) {
            data.status.layers[i] && this._layerState[i].setStatus(data.status.layers[i]);
        }
    }

    update() {
        if (this._connecting || !this._connected) {
            return;
        }
        getDataProvider().getData(
            'post',
            'ev3/update',
            {
                layerCount: this._layerCount,
                queue:      this._queue
            },
            (function(data) {
                try {
                    let json = JSON.parse(data);
                    if (json.connected) {
                        this.updateLayerStatus(json);
                    } else {
                        this._connected = false;
                        this.emit('EV3.Disconnect');
                    }
                } catch (error) {
                    // Todo: show error message in IDE...
                    console.error(error);
                }
                setTimeout(this.update.bind(this), 20);
            }).bind(this)
        );
        this._queue = [];
    }

    connecting() {
        if (this._connecting) {
            return;
        }
        let callback = (function() {
                getDataProvider().getData(
                    'post',
                    'ev3/connecting',
                    {},
                    (function(data) {
                        try {
                            let json = JSON.parse(data);
                            if (json.connected) {
                                this._connected  = true;
                                this._connecting = false;
                                this.updateLayerStatus(json);
                                this.emit('EV3.Connected');
                                this.update();
                            } else {
                                setTimeout(callback, 100);
                            }
                        } catch (error) {
                            // Todo: show error message in IDE...
                            console.error(error);
                            this._connecting = false;
                        }
                    }).bind(this)
                );
            }).bind(this);
        callback();
    }

    disconnect() {
        if (this._connecting || !this._connected) {
            return;
        }
        this.emit('EV3.Disconnect');
        getDataProvider().getData(
            'post',
            'ev3/disconnect',
            {},
            (function(data) {
                this._connected = false;
                this.emit('EV3.Disconnected');
            }).bind(this)
        );
    }

    module(module, command, data) {
        if (this._connecting || !this._connected) {
            return;
        }
        let queue = this._queue;
        for (let i = 0; i < queue.length; i++) {
            let item     = queue[i];
            let itemData = item.data;
            if ((item.module     === module)     &&
                (item.command    === command)    &&
                (item.data.layer === data.layer) &&
                (item.data.id    === data.id)) {
                queue[i] = {module: module, command: command, data: data};
                return;
            }
        }
        this._queue.push({module: module, command: command, data: data});
    }

    _createResponseHandler(callback) {
        return function(data) {
            try {
                data = JSON.parse(data);
            } catch (error) {
                data = {error: true, message: 'Invalid data.'};
            }
            callback && callback(data);
        };
    }

    downloadData(data, remoteFilename, callback) {
        if (this._connecting || !this._connected) {
            return;
        }
        getDataProvider().getData(
            'post',
            'ev3/download-data',
            {
                data:           data,
                remoteFilename: remoteFilename
            },
            this._createResponseHandler(callback)
        );
    }

    download(localFilename, remoteFilename, callback) {
        if (this._connecting || !this._connected) {
            return;
        }
        getDataProvider().getData(
            'post',
            'ev3/download',
            {
                localFilename:  localFilename,
                remoteFilename: remoteFilename
            },
            this._createResponseHandler(callback)
        );
    }

    upload(remoteFilename, localFilename) {
        if (this._connecting || !this._connected) {
            return;
        }
        getDataProvider().getData(
            'post',
            'ev3/upload',
            {
                localFilename:  localFilename,
                remoteFilename: remoteFilename
            },
            this._createResponseHandler(callback)
        );
    }

    createDir(path, callback) {
        if (this._connecting || !this._connected) {
            return;
        }
        getDataProvider().getData(
            'post',
            'ev3/create-dir',
            {
                path: path
            },
            this._createResponseHandler(callback)
        );
    }

    deleteFile(path, callback) {
        if (this._connecting || !this._connected) {
            return;
        }
        getDataProvider().getData(
            'post',
            'ev3/delete-file',
            {
                path: path
            },
            this._createResponseHandler(callback)
        );
    }

    stopPolling(callback) {
        if (this._connecting || !this._connected) {
            return;
        }
        getDataProvider().getData(
            'post',
            'ev3/stop-polling',
            {},
            this._createResponseHandler(callback)
        );
    }

    resumePolling(callback) {
        if (this._connecting || !this._connected) {
            return;
        }
        getDataProvider().getData(
            'post',
            'ev3/resume-polling',
            {},
            this._createResponseHandler(callback)
        );
    }

    setMode(layer, port, mode, callback) {
        if (this._connecting || !this._connected) {
            return;
        }
        getDataProvider().getData(
            'post',
            'ev3/set-mode',
            {
                layer: layer,
                port:  port,
                mode:  mode
            },
            this._createResponseHandler(callback)
        );
    }

    stopAllMotors(layerCount) {
        getDataProvider().getData('post', 'ev3/stop-all-motors', {layerCount: layerCount});
    }
};
