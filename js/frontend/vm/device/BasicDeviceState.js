/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher      = require('../../lib/dispatcher').dispatcher;
const Emitter         = require('../../lib/Emitter').Emitter;
const getDataProvider = require('../../lib/dataprovider/dataProvider').getDataProvider;

exports.BasicDeviceState = class extends Emitter {
    constructor(opts) {
        super(opts);
        this._queue            = [];
        this._updating         = false;
        this._connecting       = false;
        this._connected        = false;
        this._updateTimeout    = null;
        this._messageId        = 0;
        this._layerState       = [];
        this._layerCount       = ('layerCount'       in opts) ? opts.layerCount       : 4;
        this._activeLayerCount = ('activeLayerCount' in opts) ? opts.activeLayerCount : 4;
        this._noTimeout        = ('noTimeout'        in opts) ? opts.noTimeout        : false;
        this._signalPrefix     = opts.signalPrefix;
        this._updateURL        = opts.updateURL;
        this._disconnectURL    = opts.disconnectURL;
        this._setModeURL       = opts.setModeURL;
        this._stopAllMotorsURL = opts.stopAllMotorsURL;
        this._dataProvider     = opts.dataProvider ? opts.dataProvider : getDataProvider(); // Allow dependency injection for unit tests...
        for (let i = 0; i < this._layerCount; i++) {
            this._layerState.push(new opts.LayerState({
                signalPrefix: this._signalPrefix,
                device:       this,
                layerIndex:   i
            }));
        }
        dispatcher
            .on(this._signalPrefix + '.ConnectToDevice',  this, this.onConnectToDevice)
            .on(this._signalPrefix + '.ActiveLayerCount', this, this.onActiveLayerCount);
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

    getQueueLength() {
        return this._queue.length;
    }

    getConnecting() {
        return this._connecting;
    }

    getConnectionCount() {
        let connected = 0;
        this._layerState.forEach((layerState) => {
            if (layerState.getConnected()) {
                connected++;
            }
        });
        return connected;
    }

    getConnected() {
        return !!this.getConnectionCount();
    }

    getBattery() {
        return 0;
    }

    getActiveLayerCount() {
        return this._activeLayerCount;
    }

    getPortsPerLayer() {
        return 4;
    }

    getLayerState(layer) {
        return (layer === undefined) ? this._layerState : this._layerState[layer];
    }

    getDeviceName() {
        return this._deviceName;
    }

    setState(state) {
        let layerState = this._layerState;
        state.layers.forEach((layer, index) => {
            if (layer.connected) {
                if (layerState[index] && !layerState[index].getConnected()) {
                    layerState[index].setConnected(true);
                    this
                        .emit(this._signalPrefix + '.Connected',               index)
                        .emit(this._signalPrefix + '.Connected.Layer' + index, index);
                }
            } else {
                if (layerState[index] && layerState[index].getConnected()) {
                    layerState[index].setConnected(false);
                    this
                        .emit(this._signalPrefix + '.Disconnected',               index)
                        .emit(this._signalPrefix + '.Disconnected.Layer' + index, index);
                }
            }
        });
    }

    setMode(layer, port, mode, callback) {
        if (this.getConnecting() || !this.getConnected()) {
            return;
        }
        this._dataProvider.getData(
            'post',
            this._setModeURL,
            {
                layer: layer,
                port:  port,
                mode:  mode
            },
            this._createResponseHandler(callback)
        );
    }

    module(module, command, data) {
        if (this.getConnecting() || !this.getConnected()) {
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

    updateSendQueue() {
        let queue = this._queue;
        queue.forEach((message) => {
            message.messageId = this._messageId++;
        });
        return queue;
    }

    updateReceivedQueue(messagesReceived) {
        let queue = this._queue;
        let i     = 0;
        while (i < queue.length) {
            let message = queue[i];
            if (message.messageId in messagesReceived) {
                queue.splice(i, 1);
            } else {
                i++;
            }
        }
        return this;
    }

    updateLayerState(data) {
        if (!data.state) {
            return; // Not connected...
        }
        this.setState(data.state);
        let layerState = this._layerState;
        data.state.layers.forEach((layer, index) => {
            layerState[index] && layerState[index].setState(layer);
        });
    }

    update() {
        if (this._updating) {
            return;
        }
        this._updating = true;
        let callback = () => {
                this._updateTimeout = null;
                this._dataProvider.getData(
                    'post',
                    this._updateURL,
                    {
                        queue:            this.updateSendQueue(),
                        activeLayerCount: this._activeLayerCount
                    },
                    (data) => {
                        let json = JSON.parse(data);
                        this
                            .updateReceivedQueue(json.messagesReceived)
                            .updateLayerState(json);
                        if (!this._noTimeout) {
                            this._updateTimeout = setTimeout(callback, 20);
                        }
                    }
                );
            };
        callback();
    }

    disconnect() {
        if (this._updateTimeout) {
            clearTimeout(this._updateTimeout);
            this._updateTimeout = null;
        }
        this.emit(this._signalPrefix + '.Disconnect');
        this._dataProvider.getData(
            'post',
            this._disconnectURL,
            {},
            (data) => {
                this._layerState.forEach((layerState) => {
                    layerState.setConnected(false);
                });
                this.emit(this._signalPrefix + '.Disconnected');
            }
        );
    }

    stopAllMotors() {
        this._dataProvider.getData('post', this._stopAllMotorsURL, {activeLayerCount: this._activeLayerCount});
    }

    onActiveLayerCount(activeLayerCount) {
        this._activeLayerCount = activeLayerCount;
    }

    connecting() {}
    downloadData() {}
    download() {}
    upload() {}
    createDir() {}
    deleteFile() {}
    stopPolling(callback) {}
    resumePolling(callback) {}
};
