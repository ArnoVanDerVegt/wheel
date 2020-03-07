/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher      = require('../../lib/dispatcher').dispatcher;
const getDataProvider = require('../../lib/dataprovider/dataProvider').getDataProvider;
const Emitter         = require('../../lib/Emitter').Emitter;
const LayerState      = require('./LayerState').LayerState;

exports.PoweredUpState = class extends Emitter {
    constructor(opts) {
        super();
        this._updating   = false;
        this._queue      = [];
        this._deviceName = 'PoweredUp';
        this._connected  = false;
        this._layerState = [
            new LayerState({layer: 0, poweredUp: this}),
            new LayerState({layer: 1, poweredUp: this}),
            new LayerState({layer: 2, poweredUp: this}),
            new LayerState({layer: 3, poweredUp: this})
        ];
        dispatcher.on('PoweredUp.ConnectToDevice', this, this.onConnectToDevice);
    }

    getAbsolutePosition() {
        return false;
    }

    getConnected() {
        return this._connected;
    }

    getLayerState(layer) {
        return (layer === undefined) ? this._layerState : this._layerState[layer];
    }

    getDeviceName() {
        return this._deviceName;
    }

    setStatus(status) {
        this._connected = false;
        for (let i = 0; i < 4; i++) {
            if (status.layers[i].connected) {
                this._connected = true;
                break;
            }
        }
        let layerState = this._layerState;
        for (let i = 0; i < 4; i++) {
            if (status.layers[i].connected && (layerState[i].getConnected() !== status.layers[i].connected)) {
                this.emit('PoweredUp.Connected');
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
        getDataProvider().getData(
            'post',
            'powered-up/connect',
            {uuid: hub.uuid},
            (function(data) {
                if (!this._updating) {
                    this.emit('PoweredUp.Connected', hub);
                    this.update();
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
        if (this._updating) {
            return;
        }
        this._updating = true;
        let callback = (function() {
                getDataProvider().getData(
                    'post',
                    'powered-up/update',
                    {
                        queue: this._queue
                    },
                    (function(data) {
                        this._queue.length = 0;
                        let json = JSON.parse(data);
                        this.updateLayerStatus(json);
                        setTimeout(callback, 20);
                    }).bind(this)
                );
            }).bind(this);
        callback();
    }

    connecting() {
    }

    disconnect() {
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

    downloadData() {}
    download() {}
    upload() {}
    createDir() {}
    deleteFile() {}

    stopPolling(callback) {
        if (this._connecting || !this._connected) {
            return;
        }
        getDataProvider().getData(
            'post',
            'powered-up/stop-polling',
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
            'powered-up/resume-polling',
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
        getDataProvider().getData('post', 'powered-up/stop-all-motors', {layerCount: layerCount});
    }
};
