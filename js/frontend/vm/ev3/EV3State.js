/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher       = require('../../lib/dispatcher').dispatcher;
const BasicDeviceState = require('../BasicDeviceState').BasicDeviceState;
const LayerState       = require('./LayerState').LayerState;

exports.EV3State = class extends BasicDeviceState {
    constructor(opts) {
        opts.layerCount       = 4;
        opts.LayerState       = LayerState;
        opts.signalPrefix     = 'EV3';
        opts.setModeURL       = 'ev3/set-mode';
        opts.stopAllMotorsURL = 'ev3/stop-all-motors';
        super(opts);
        this._battery    = null;
        this._deviceName = 'EV3';
    }

    getConnected() {
        return this._connected;
    }

    getBattery() {
        return this._battery;
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

    update() {
        this._updateTimeout = null;
        if (this._connecting || !this._connected) {
            return;
        }
        this._dataProvider.getData(
            'post',
            'ev3/update',
            {
                activeLayerCount: this._activeLayerCount,
                queue:            this._queue
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
                    this._queue.length = 0;
                } catch (error) {
                    // Todo: show error message in IDE...
                    console.error(error);
                }
                if (!this._noTimeout) {
                    this._updateTimeout = setTimeout(this.update.bind(this), 20);
                }
            }
        );
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
                            } else if (!json.connecting) {
                                this._connecting = false;
                                this._connected  = false;
                                this.emit('EV3.StopConnecting');
                                return;
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
};
