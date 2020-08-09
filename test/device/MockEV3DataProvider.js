/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const getMockLayers = function() {
        return [
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}]
        ];
    };

exports.MockEV3DataProvider = class {
    constructor(opts) {
        this._applyConnecting = opts.applyConnecting;
        this._connected       = false;
        this._deletedFile     = null;
        this._createdDir      = null;
        this._mode            = null;
        this._localFilename   = null;
        this._remoteFilename  = null;
        this._layerCount      = null;
        this._data            = null;
        this._polling         = true;
    }

    setConnected(connected) {
        this._connected = connected;
    }

    getDeletedFile() {
        return this._deletedFile;
    }

    getCreatedDir() {
        return this._createdDir;
    }

    getMode() {
        return this._mode;
    }

    getLocalFilename() {
        return this._localFilename;
    }

    getRemoteFilename() {
        return this._remoteFilename;
    }

    getLayerCount() {
        return this._layerCount;
    }

    getDataV() {
        return this._data;
    }

    getPolling() {
        return this._polling;
    }

    getData(method, route, params, callback) {
        switch (method + ':' + route) {
            case 'post:ev3/connect':
                callback(JSON.stringify({
                    deviceName: params.deviceName,
                    connecting: true
                }));
                break;
            case 'post:ev3/connecting':
                if (!this._applyConnecting) {
                    return;
                }
                callback(JSON.stringify({
                    connected: this._connected,
                    state: {
                        layers: getMockLayers()
                    }
                }));
                break;
            case 'post:ev3/update':
                callback(JSON.stringify({
                    connected: this._connected,
                    state: {
                        layers: getMockLayers()
                    }
                }));
                break;
            case 'post:ev3/disconnect':
                callback(JSON.stringify({}));
                break;
            case 'post:ev3/delete-file':
                this._deletedFile = params.path;
                callback(JSON.stringify({}));
                break;
            case 'post:ev3/create-dir':
                this._createdDir = params.path;
                callback(JSON.stringify({}));
                break;
            case 'post:ev3/set-mode':
                this._mode = params;
                callback(JSON.stringify({}));
                break;
            case 'post:ev3/upload':
                this._localFilename  = params.localFilename;
                this._remoteFilename = params.remoteFilename;
                callback(JSON.stringify({}));
                break;
            case 'post:ev3/stop-all-motors':
                this._layerCount = params.layerCount;
                break;
            case 'post:ev3/download-data':
                this._data           = params.data;
                this._remoteFilename = params.remoteFilename;
                break;
            case 'post:ev3/stop-polling':
                this._polling = false;
                break;
            case 'post:ev3/resume-polling':
                this._polling = true;
                break;
        }
    }
};
