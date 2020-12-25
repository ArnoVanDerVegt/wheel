/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const poweredUpModuleConstants = require('../../../shared/vm/modules/poweredUpModuleConstants');
const dispatcher               = require('../../lib/dispatcher').dispatcher;
const getDataProvider          = require('../../lib/dataprovider/dataProvider').getDataProvider;
const BasicDeviceState         = require('../BasicDeviceState').BasicDeviceState;
const LayerState               = require('./LayerState').LayerState;

exports.PoweredUpState = class extends BasicDeviceState {
    constructor(opts) {
        opts.LayerState       = LayerState;
        opts.layerCount       = poweredUpModuleConstants.POWERED_UP_LAYER_COUNT;
        opts.signalPrefix     = 'PoweredUp';
        opts.updateURL        = 'powered-up/update';
        opts.setModeURL       = 'powered-up/set-mode';
        opts.stopAllMotorsURL = 'powered-up/stop-all-motors';
        super(opts);
        this._deviceName = 'PoweredUp';
    }

    getDeviceName() {
        return this._deviceName;
    }

    onConnectToDevice(hub) {
        if (this.getConnectionCount() >= poweredUpModuleConstants.POWERED_UP_LAYER_COUNT) {
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

    disconnect() {
        this._dataProvider.getData('post', 'powered-up/disconnect-all', {});
        let layerState = this._layerState;
        for (let i = 0; i < poweredUpModuleConstants.POWERED_UP_LAYER_COUNT; i++) {
            layerState[i].setConnected(false);
            this.emit('PoweredUp.Disconnected', i);
        }
        this.emit('PoweredUp.Disconnect');
    }
};
