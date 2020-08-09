/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Emitter = require('../lib/Emitter').Emitter;

exports.BasicDeviceState = class extends Emitter {
    constructor(opts) {
        super(opts);
        this._queue      = [];
        this._connecting = false;
        this._connected  = false;
        this._queue      = [];
        this._layerCount = opts.layerCount || 0;
        this._layerState = [
            new opts.LayerState({layer: 0, device: this}),
            new opts.LayerState({layer: 1, device: this}),
            new opts.LayerState({layer: 2, device: this}),
            new opts.LayerState({layer: 3, device: this})
        ];
    }

    getQueueLength() {
        return this._queue.length;
    }

    getConnecting() {
        return this._connecting;
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

    downloadData() {}
    download() {}
    upload() {}
    createDir() {}
    deleteFile() {}
    stopPolling(callback) {}
    resumePolling(callback) {}
    setMode(layer, port, mode, callback) {}
};
