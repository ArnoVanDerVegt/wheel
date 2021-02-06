/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const platform        = require('../../shared/lib/platform');
const Emitter         = require('../lib/Emitter').Emitter;
const dispatcher      = require('../lib/dispatcher').dispatcher;
const getDataProvider = require('../lib/dataprovider/dataProvider').getDataProvider;

exports.IDEAssistant = class extends Emitter {
    constructor(opts) {
        super(opts);
        this._settings  = opts.settings;
        this._poweredUp = opts.devices.poweredUp;
        dispatcher
            .on('Create.Form',            this, this.onOpenForm)
            .on('IDE.Assistant.OpenForm', this, this.onOpenForm)
            .on('Device.Connected',       this, this.onConnectedDevice)
            .on('Editor.File.Saved',      this, this.onEditorFileSaved);
    }

    runDelayed(callback) {
        setTimeout(callback, 500);
    }

    /**
     * The user opens a form file but the property panel is not visible...
    **/
    onOpenForm() {
        // Add a timeout to allow the active window to close...
        this.runDelayed(() => {
            if (!this._settings.getShowProperties() && !this._settings.getDontShowOpenForm()) {
                dispatcher.dispatch('Dialog.Hint.OpenForm', {});
            }
        });
    }

    /**
     * A device was connected...
    **/
    onConnectedDevice() {
        // Add a timeout to allow the active window to close...
        this.runDelayed(() => {
            if (!this._settings.getShowSimulator() && !this._settings.getDontShowConnected()) {
                dispatcher.dispatch('Dialog.Hint.Connected', {});
            }
        });
    }

    updatePoweredUpDeviceList() {
        getDataProvider().getData(
            'post',
            'powered-up/device-list',
            {
                autoConnect: this._settings.getPoweredUpAutoConnect().toJSON()
            },
            (data) => {
                try {
                    data = JSON.parse(data);
                } catch (error) {
                    data = null;
                }
                if (data) {
                    this.onPoweredUpDeviceList(data.list);
                }
            }
        );
    }

    onPoweredUpDeviceList(list) {
        let autoConnectByUuid = this._settings.getPoweredUpAutoConnect().getAutoConnectByUuid();
        list.forEach((device) => {
            if (device && !device.connected && !device.connecting && (device.uuid in autoConnectByUuid)) {
                dispatcher.dispatch('PoweredUp.ConnectToDevice', device);
            }
        });
        setTimeout(this.updatePoweredUpDeviceList.bind(this), 2500);
    }

    onEditorFileSaved() {
        if (!platform.isWeb()) {
            return;
        }
        // Add a timeout to allow the active window to close...
        this.runDelayed(() => {
            if (!this._settings.getDontShowSave()) {
                dispatcher.dispatch('Dialog.Hint.Save', {});
            }
        });
    }

    autoConnectPoweredUp() {
        this.updatePoweredUpDeviceList();
    }
};
