/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher       = require('../../lib/dispatcher').dispatcher;
const getDataProvider  = require('../../lib/dataprovider/dataProvider').getDataProvider;
const BasicDeviceState = require('../BasicDeviceState').BasicDeviceState;
const LayerState       = require('./LayerState').LayerState;

exports.SpikeState = class extends BasicDeviceState {
    constructor(opts) {
        opts.layerCount = 4; // Todo: Check with settings
        opts.LayerState = LayerState;
        super(opts);
        // Allow dependency injection for unit tests...
        this._dataProvider  = opts.dataProvider ? opts.dataProvider : getDataProvider();
        this._battery       = null;
        this._noTimeout     = ('noTimeout' in opts) ? opts.noTimeout : false;
        this._updateTimeout = null;
        dispatcher
            .on('Spike.ConnectToDevice', this, this.onConnectToDevice)
            .on('Spike.LayerCount',      this, this.onLayerCount);
    }

    getConnected() {
        let connected = 0;
        this._layerState.forEach((layerState) => {
            if (layerState.getConnected()) {
                connected++;
            }
        });
        return connected;
    }

    getConnectionCount() {
        return this.getConnected();
    }

    getConnecting() {
        let connecting = 0;
        this._layerState.forEach((layerState) => {
            if (layerState.getConnecting()) {
                connecting++;
            }
        });
        return connecting;
    }

    getPortsPerLayer() {
        return 6;
    }

    getLayerState(layer) {
        return this._layerState[layer];
    }

    setState(state) {}

    onLayerCount(layerCount) {
        this._layerCount = layerCount;
    }

    onConnectToDevice(deviceName) {
        for (let i = 0; i < this._layerState.length; i++) {
            let layerState = this._layerState[i];
            if (layerState.getDeviceName() === deviceName) {
                return;
            }
        }
        this.emit('Spike.Connecting', deviceName);
        this._dataProvider.getData(
            'post',
            'spike/connect',
            {deviceName: deviceName},
            (data) => {
                if (!this._updateTimeout) {
                    this._updateTimeout = setTimeout(this.update.bind(this), 20);
                }
            }
        );
    }

    updateLayerState(data) {
        if (!data.state) {
            return; // Not connected...
        }
        this.setState(data.state);
        for (let i = 0; i < 4; i++) {
            data.state.layers[i] && this._layerState[i].setState(data.state.layers[i]);
        }
    }

    update() {
        this._dataProvider.getData(
            'post',
            'spike/update',
            {
                layerCount: this._layerCount,
                queue:      this._queue
            },
            (data) => {
                try {
                    this.updateLayerState(JSON.parse(data));
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

    disconnect() {
        this.emit('Spike.Disconnect');
        this._dataProvider.getData(
            'post',
            'spike/disconnect',
            {},
            (data) => {
                for (let i = 0; i < this._layerState.length; i++) {
                    this._layerState[i].disconnect();
                }
                this.emit('Spike.Disconnected');
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

    downloadData(data, remoteFilename, callback) {}
    download(localFilename, remoteFilename, callback) {}
    upload(remoteFilename, localFilename, callback) {}
    createDir(path, callback) {}
    deleteFile(path, callback) {}

    stopPolling(callback) {
        if (this._connecting || !this._connected) {
            return;
        }
        this._dataProvider.getData(
            'post',
            'spike/stop-polling',
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
            'spike/resume-polling',
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
            'spike/set-mode',
            {
                layer: layer,
                port:  port,
                mode:  mode
            },
            this._createResponseHandler(callback)
        );
    }

    stopAllMotors(layerCount) {
        this._dataProvider.getData('post', 'spike/stop-all-motors', {layerCount: layerCount});
    }
};
