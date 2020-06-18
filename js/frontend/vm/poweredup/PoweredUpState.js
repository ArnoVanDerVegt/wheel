/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher       = require('../../lib/dispatcher').dispatcher;
const getDataProvider  = require('../../lib/dataprovider/dataProvider').getDataProvider;
const BasicDeviceState = require('../BasicDeviceState').BasicDeviceState;
const LayerState       = require('./LayerState').LayerState;

exports.PoweredUpState = class extends BasicDeviceState {
    constructor(opts) {
        opts.LayerState = LayerState;
        super(opts);
        // Allow dependency injection for unit tests...
        this._dataProvider = opts.dataProvider ? opts.dataProvider : getDataProvider();
        this._updating     = false;
        this._deviceName   = 'PoweredUp';
        this._noTimeout    = ('noTimeout' in opts) ? opts.noTimeout : false;
        dispatcher.on('PoweredUp.ConnectToDevice', this, this.onConnectToDevice);
    }

    getLayerState(layer) {
        return (layer === undefined) ? this._layerState : this._layerState[layer];
    }

    getDeviceName() {
        return this._deviceName;
    }

    getConnectionCount() {
        let result     = 0;
        let layerState = this._layerState;
        for (let i = 0; i < 4; i++) {
            if (layerState[i].getConnected()) {
                result++;
            }
        }
        return result;
    }

    setState(state) {
        this._connected = false;
        for (let i = 0; i < 4; i++) {
            if (state.layers[i].connected) {
                this._connected = true;
                break;
            }
        }
        let layerState = this._layerState;
        for (let i = 0; i < 4; i++) {
            if (state.layers[i].connected && (layerState[i].getConnected() !== state.layers[i].connected)) {
                layerState[i].setConnected(true);
                this.emit('PoweredUp.Connected', i);
                break;
            }
        }
    }

    getQueueLength() {
        return this._queue.length;
    }

    onConnectToDevice(hub) {
        if (hub.connecting || hub.connected) {
            return;
        }
        this.emit('PoweredUp.Connecting', hub);
        this._dataProvider.getData(
            'post',
            'powered-up/connect',
            {uuid: hub.uuid},
            (data) => {
                if (!this._updating) {
                    this.update();
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
        if (this._updating) {
            return;
        }
        this._updating = true;
        let callback = () => {
                this._dataProvider.getData(
                    'post',
                    'powered-up/update',
                    {
                        queue: this._queue
                    },
                    (data) => {
                        this._queue.length = 0;
                        let json = JSON.parse(data);
                        this.updateLayerState(json);
                        if (!this._noTimeout) {
                            setTimeout(callback, 20);
                        }
                    }
                );
            };
        callback();
    }

    connecting() {}
    disconnect() {}

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

    downloadData() {}
    download() {}
    upload() {}
    createDir() {}
    deleteFile() {}
    stopPolling(callback) {}
    resumePolling(callback) {}

    setMode(layer, port, mode, callback) {
        if (this._connecting || !this._connected) {
            return;
        }
        this._dataProvider.getData(
            'post',
            'powered-up/set-mode',
            {
                layer: layer,
                port:  port,
                mode:  mode
            },
            this._createResponseHandler(callback)
        );
    }

    stopAllMotors(layerCount) {
        this._dataProvider.getData('post', 'powered-up/stop-all-motors', {layerCount: layerCount});
    }
};
