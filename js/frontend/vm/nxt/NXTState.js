/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const nxtModuleConstants = require('../../../shared/vm/modules/nxtModuleConstants');
const dispatcher           = require('../../lib/dispatcher').dispatcher;
const getDataProvider      = require('../../lib/dataprovider/dataProvider').getDataProvider;
const BasicDeviceState     = require('../BasicDeviceState').BasicDeviceState;
const LayerState           = require('./LayerState').LayerState;

exports.NXTState = class extends BasicDeviceState {
    constructor(opts) {
        opts.layerCount       = nxtModuleConstants.LAYER_COUNT;
        opts.LayerState       = LayerState;
        opts.signalPrefix     = 'NXT';
        opts.updateURL        = 'nxt/update';
        opts.setModeURL       = 'nxt/set-mode';
        opts.stopAllMotorsURL = 'nxt/stop-all-motors';
        super(opts);
        this._battery = null;
    }

    getPortsPerLayer() {
        return 6;
    }

    onConnectToDevice(deviceName) {
        if (this.getConnectionCount() >= nxtModuleConstants.NXT_LAYER_COUNT) {
            return;
        }
        let layerState = this._layerState;
        for (let i = 0; i < layerState.length; i++) {
            if (layerState[i].getDeviceName() === deviceName) {
                return;
            }
        }
        this._dataProvider.getData(
            'post',
            'nxt/connect',
            {deviceName: deviceName},
            (data) => {
                try {
                    data = JSON.parse(data);
                } catch (error) {
                    return;
                }
                if (data.connecting && layerState[data.layerIndex]) {
                    layerState[data.layerIndex].connecting = true;
                    this.emit('NXT.Connecting', deviceName);
                    if (!this._updateTimeout) {
                        this._updateTimeout = setTimeout(this.update.bind(this), 20);
                    }
                }
            }
        );
    }

    stopPolling(callback) {
        if (this._connecting || !this._connected) {
            return;
        }
        this._dataProvider.getData(
            'post',
            'nxt/stop-polling',
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
            'nxt/resume-polling',
            {},
            this._createResponseHandler(callback)
        );
    }
};
