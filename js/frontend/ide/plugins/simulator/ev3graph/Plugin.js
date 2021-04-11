/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../../../shared/vm/modules/sensorModuleConstants');
const dispatcher            = require('../../../../lib/dispatcher').dispatcher;
const getImage              = require('../../../data/images').getImage;
const pluginUuid            = require('../../pluginUuid');
const Plugin                = require('../graph/Plugin').Plugin;

exports.Plugin = class extends Plugin {
    constructor(opts) {
        opts.device = opts.devices.ev3;
        super(opts);
        this._sensorPlugin = this._simulator.getPluginByUuid(pluginUuid.SIMULATOR_EV3_SENSORS_UUID);
        this._device
            .addEventListener('EV3.Connected',    this, this.onConnected)
            .addEventListener('EV3.Disconnected', this, this.onDisconnected);
    }

    /**
     * Called bound to Chart!
    **/
    initTypeAndMode(type, mode) {
        let img   = this._refs.img;
        let image = null;
        switch (type) {
            case sensorModuleConstants.SENSOR_TYPE_NXT_TOUCH:
            case sensorModuleConstants.SENSOR_TYPE_TOUCH:
                image = 'images/ev3/touch64.png';
                this._gridDrawer   = this._binaryDrawer;
                this._chartDrawers = [this._binaryDrawer];
                this._maxValue     = 1;
                break;
            case sensorModuleConstants.SENSOR_TYPE_NXT_COLOR:
            case sensorModuleConstants.SENSOR_TYPE_COLOR:
                image = 'images/ev3/color64.png';
                if (mode === sensorModuleConstants.COLOR_COLOR) {
                    this._gridDrawer   = this._binaryDrawer;
                    this._chartDrawers = [this._colorBarDrawer];
                    this._maxValue     = 7;
                } else {
                    this._gridDrawer   = this._fillDrawer;
                    this._chartDrawers = [this._fillDrawer, this._lineDrawer];
                    this._maxValue     = 100;
                }
                break;
            case sensorModuleConstants.SENSOR_TYPE_NXT_ULTRASONIC:
            case sensorModuleConstants.SENSOR_TYPE_ULTRASONIC:
                image = 'images/ev3/ultrasonic64.png';
                this._gridDrawer   = this._fillDrawer;
                this._chartDrawers = [this._fillDrawer, this._lineDrawer];
                this._maxValue     = 255;
                break;
            case sensorModuleConstants.SENSOR_TYPE_GYRO:
                image = 'images/ev3/gyro64.png';
                this._gridDrawer   = this._lineDrawer;
                this._chartDrawers = [this._lineDrawer];
                this._maxValue     = 255;
                break;
            case sensorModuleConstants.SENSOR_TYPE_INFRARED:
                image = 'images/ev3/infrared64.png';
                this._gridDrawer   = this._lineDrawer;
                this._chartDrawers = [this._lineDrawer];
                this._maxValue     = 255;
                break;
            case sensorModuleConstants.SENSOR_TYPE_NXT_SOUND:
                image = 'images/nxt/sound64.png';
                this._gridDrawer   = this._lineDrawer;
                this._chartDrawers = [this._lineDrawer];
                this._maxValue     = 100;
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
        return 'EV3 Graph';
    }

    getSensorTypeAndMode(layer, port) {
        let sensorContainer = this._sensorPlugin.getSensor(layer, port);
        let currentSensor   = sensorContainer ? sensorContainer.getCurrentSensor() : null;
        if (currentSensor) {
            let state = currentSensor.getState();
            return {
                type: state.getType(),
                mode: state.getMode()
            };
        }
        return null;
    }

    getSensorValue(layer, port) {
        let sensorContainer = this._sensorPlugin.getSensor(layer, port);
        let currentSensor   = sensorContainer ? sensorContainer.getCurrentSensor() : null;
        if (currentSensor) {
            return currentSensor.getState().getValue();
        }
        return 0;
    }

    onAddChart() {
        dispatcher.dispatch(
            'Dialog.Graph.New.Show',
            {
                title:         'New EV3 Graph',
                onApply:       this.initChart.bind(this),
                deviceCount:   this._settings.getDaisyChainMode(),
                portsPerLayer: 4
            }
        );
    }
};
