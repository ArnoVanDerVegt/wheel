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
        // Allow dependency injection for unit tests...
        this._dataProvider = opts.dataProvider ? opts.dataProvider : getDataProvider();
        this._battery      = null;
        this._deviceName   = 'EV3';
        this._noTimeout    = ('noTimeout' in opts) ? opts.noTimeout : false;
        dispatcher
            .on('EV3.ConnectToDevice', this, this.onConnectToDevice)
            .on('EV3.LayerCount',      this, this.onLayerCount);
    }

    getConnected() {
        return this._connected;
    }

    getBattery() {
        return this._battery;
    }

    getLayerState(layer) {
        return this._layerState[layer];
    }

    getDeviceName() {
        return this._deviceName;
    }

    setState(state) {
        if (state.battery !== this._battery) {
            this._battery = state.battery;
            this.emit('EV3.Battery', state.battery);
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
        this._dataProvider.getData(
            'post',
            'ev3/connect',
            {deviceName: deviceName},
            (data) => {
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
            }
        );
    }

    updateLayerState(data) {
        this.setState(data.state);
        for (let i = 0; i < 4; i++) {
            data.state.layers[i] && this._layerState[i].setState(data.state.layers[i]);
        }
    }

    update() {
        if (this._connecting || !this._connected) {
            return;
        }
        this._dataProvider.getData(
            'post',
            'ev3/update',
            {
                layerCount: this._layerCount,
                queue:      this._queue
            },
            (data) => {
                try {
                    let json = JSON.parse(data);
                    if (json.connected) {
                        this._connected = true;
                        this.updateLayerState(json);
                    } else {
                        this._connected = false;
                        this.emit('EV3.Disconnect');
                    }
                } catch (error) {
                    // Todo: show error message in IDE...
                    console.error(error);
                }
                if (!this._noTimeout) {
                    this._updateTimeout = setTimeout(this.update.bind(this), 20);
                }
            }
        );
        this._queue = [];
    }

    connecting() {
        if (this._connecting) {
            return;
        }
        let callback = () => {
                this._dataProvider.getData(
                    'post',
                    'ev3/connecting',
                    {},
                    (data) => {
                        try {
                            let json = JSON.parse(data);
                            if (json.connected) {
                                this._connected  = true;
                                this._connecting = false;
                                this.updateLayerState(json);
                                this.emit('EV3.Connected');
                                this.update();
                            } else if (!this._noTimeout) {
                                setTimeout(callback, 100);
                            }
                        } catch (error) {
                            // Todo: show error message in IDE...
                            console.error(error);
                            this._connecting = false;
                        }
                    }
                );
            };
        callback();
    }

    disconnect() {
        if (this._connecting || !this._connected) {
            return;
        }
        this.emit('EV3.Disconnect');
        this._dataProvider.getData(
            'post',
            'ev3/disconnect',
            {},
            (data) => {
                this._connected = false;
                this.emit('EV3.Disconnected');
            }
        );
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
        this._dataProvider.getData(
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
        this._dataProvider.getData(
            'post',
            'ev3/download',
            {
                localFilename:  localFilename,
                remoteFilename: remoteFilename
            },
            this._createResponseHandler(callback)
        );
    }

    upload(remoteFilename, localFilename, callback) {
        if (this._connecting || !this._connected) {
            return;
        }
        this._dataProvider.getData(
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
        this._dataProvider.getData(
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
        this._dataProvider.getData(
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
        this._dataProvider.getData(
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
        this._dataProvider.getData(
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
        this._dataProvider.getData(
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
        this._dataProvider.getData('post', 'ev3/stop-all-motors', {layerCount: layerCount});
    }
};
