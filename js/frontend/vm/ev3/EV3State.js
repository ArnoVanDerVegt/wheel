/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher      = require('../../lib/dispatcher').dispatcher;
const getDataProvider = require('../../lib/dataprovider/dataProvider').getDataProvider;
const Emitter         = require('../../lib/Emitter').Emitter;
const LayerState      = require('./LayerState').LayerState;

exports.EV3State = class extends Emitter {
    constructor(opts) {
        super();
        this._battery    = null;
        this._connecting = false;
        this._connected  = false;
        this._queue      = [];
        this._deviceName = 'EV3';
        this._layerCount = opts.layerCount || 0;
        this._layerState = [
            new LayerState({layer: 0, ev3: this}),
            new LayerState({layer: 1, ev3: this}),
            new LayerState({layer: 2, ev3: this}),
            new LayerState({layer: 3, ev3: this})
        ];
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
                    this._connecting = false;
                }
            }).bind(this)
        );
    }

    updateLayerStatus(data) {
        this.setStatus(data.status);
        data.status.layer0 && this._layerState[0].setStatus(data.status.layer0);
        data.status.layer1 && this._layerState[1].setStatus(data.status.layer1);
        data.status.layer2 && this._layerState[2].setStatus(data.status.layer2);
        data.status.layer3 && this._layerState[3].setStatus(data.status.layer3);
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
                // Try {
                    let json = JSON.parse(data);
                    if (json.connected) {
                        this.updateLayerStatus(json);
                    } else {
                        this._connected = false;
                        this.emit('EV3.Disconnect');
                    }
                // } catch (error) {
                // }
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
                        // Try {
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
                        // } catch (error) {
                            // This._connecting = false;
                        // }
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
