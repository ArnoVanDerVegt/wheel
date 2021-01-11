/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants    = require('../../../../../shared/vm/modules/sensorModuleConstants');
const poweredUpModuleConstants = require('../../../../../shared/vm/modules/poweredUpModuleConstants');
const dispatcher               = require('../../../../lib/dispatcher').dispatcher;
const getImage                 = require('../../../data/images').getImage;
const pluginUuid               = require('../../pluginUuid');
const Plugin                   = require('../graph/Plugin').Plugin;

exports.Plugin = class extends Plugin {
    constructor(opts) {
        opts.device = opts.devices.poweredUp;
        super(opts);
        this._sensorPlugin = this._simulator.getPluginByUuid(pluginUuid.SIMULATOR_POWERED_UP_UUID);
        this._device
            .addEventListener('PoweredUp.Connected',    this, this.onConnected)
            .addEventListener('PoweredUp.Disconnected', this, this.onDisconnected);
    }

    initTypeAndMode(type, mode) {
        let img   = this._refs.img;
        let image = null;
        switch (type) {
            case poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_DISTANCE:
                image = 'images/poweredup/lightSensor64.png';
                switch (mode) {
                    case poweredUpModuleConstants.POWERED_UP_SENSOR_MODE_DISTANCE:
                        this._gridDrawer   = this._fillDrawer;
                        this._chartDrawers = [this._fillDrawer, this._lineDrawer];
                        this._maxValue     = 64;
                        break;
                    case poweredUpModuleConstants.POWERED_UP_SENSOR_MODE_COLOR:
                        this._gridDrawer   = this._binaryDrawer;
                        this._chartDrawers = [this._colorBarDrawer];
                        this._maxValue     = 9;
                        break;
                }
                break;
        }
        if (image) {
            img.src           = getImage(image);
            img.style.display = 'block';
        } else {
            img.style.display = 'none';
            this._gridDrawer  = null;
        }
        this._type = type;
        this._mode = mode;
    }

    getTitle() {
        return 'Powered Up Graph';
    }

    getSensorTypeAndMode(layer, port) {
        let motor = this._sensorPlugin.getMotor(layer, port);
        if (!motor) {
            return null;
        }
        let state = motor.getState();
        return {
            type: state.getType(),
            mode: state.getMode()
        };
        return null;
    }

    getSensorValue(layer, port) {
        let motor = this._sensorPlugin.getMotor(layer, port);
        if (!motor) {
            return 0;
        }
        let state = motor.getState();
        switch (state.getType()) {
            case poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_DISTANCE:
                return state.getValue();
        }
        return 0;
    }

    onAddChart() {
        dispatcher.dispatch(
            'Dialog.Graph.New.Show',
            {
                title:         'New Powered Up Graph',
                onApply:       this.initChart.bind(this),
                deviceCount:   this._settings.getPoweredUpDeviceCount(),
                portsPerLayer: 6
            }
        );
    }
};
