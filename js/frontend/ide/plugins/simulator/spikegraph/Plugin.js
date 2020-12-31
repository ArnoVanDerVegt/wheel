/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../../../shared/vm/modules/sensorModuleConstants');
const spikeModuleConstants  = require('../../../../../shared/vm/modules/spikeModuleConstants');
const dispatcher            = require('../../../../lib/dispatcher').dispatcher;
const getImage              = require('../../../data/images').getImage;
const pluginUuid            = require('../../pluginUuid');
const Plugin                = require('../graph/Plugin').Plugin;

exports.Plugin = class extends Plugin {
    constructor(opts) {
        opts.device = opts.devices.spike;
        super(opts);
        this._sensorPlugin = this._simulator.getPluginByUuid(pluginUuid.SIMULATOR_SPIKE_PORTS_UUID);
        this._device
            .addEventListener('Spike.Connected',    this, this.onConnected)
            .addEventListener('Spike.Disconnected', this, this.onDisconnected);
    }

    initTypeAndMode(type, mode) {
        let img   = this._refs.img;
        let image = null;
        switch (type) {
            case spikeModuleConstants.SPIKE_DEVICE_COLOR_SENSOR:
                image = 'images/spike/colorSensor64.png';
                this._gridDrawer   = this._binaryDrawer;
                this._chartDrawers = [this._colorBarDrawer];
                this._maxValue     = 7;
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
        return 'Spike Graph';
    }

    getSensorTypeAndMode(layer, port) {
        let sensor = this._sensorPlugin.getSensor(layer, port);
        if (!sensor) {
            return null;
        }
        let state = sensor.getState();
        return {
            type: state.getType(),
            mode: state.getMode()
        };
        return null;
    }

    getSensorValue(layer, port) {
        let sensor = this._sensorPlugin.getSensor(layer, port);
        if (!sensor) {
            return 0;
        }
        let state = sensor.getState();
        switch (state.getType()) {
            case spikeModuleConstants.SPIKE_DEVICE_COLOR_SENSOR:
                return state.getValue();
        }
        return 0;
    }

    onAddChart() {
        dispatcher.dispatch(
            'Dialog.Graph.New.Show',
            {
                title:         'New Spike Graph',
                onApply:       this.initChart.bind(this),
                deviceCount:   this._settings.getSpikeDeviceCount(),
                portsPerLayer: 6
            }
        );
    }
};
