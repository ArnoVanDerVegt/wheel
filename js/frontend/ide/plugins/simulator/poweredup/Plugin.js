/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const poweredUpModuleConstants = require('../../../../../shared/vm/modules/poweredUpModuleConstants');
const dispatcher               = require('../../../../lib/dispatcher').dispatcher;
const DOMNode                  = require('../../../../lib/dom').DOMNode;
const TextInput                = require('../../../../lib/components/TextInput').TextInput;
const Console                  = require('../../../console/Console');
const SimulatorPlugin          = require('../lib/SimulatorPlugin').SimulatorPlugin;
const Plugin                   = require('../lib/motor/Plugin').Plugin;
const MotorOrSensor            = require('./io/MotorOrSensor').MotorOrSensor;
const MotorOrSensorState       = require('./io/MotorOrSensorState').MotorOrSensorState;
const SimulatedDevices         = require('./io/SimulatedDevices').SimulatedDevices;
const Hub                      = require('./components/Hub').Hub;
const TechnicHub               = require('./components/TechnicHub').TechnicHub;
const MoveHub                  = require('./components/MoveHub').MoveHub;
const Remote                   = require('./components/Remote').Remote;

const dummyLight = {
        setColor: function(color) {},
        off:      function() {}
    };

exports.Plugin = class extends Plugin {
    constructor(opts) {
        opts.motorConstructor = MotorOrSensor;
        opts.stateConstructor = MotorOrSensorState;
        opts.ev3              = opts.poweredUp; // Todo: Hack device should be fixed!
        opts.constants        = poweredUpModuleConstants;
        super(opts);
        this.initEvents();
        this._assignmentError  = false;
        this._buttons          = null;
        this._poweredUp        = opts.poweredUp;
        this._uuid             = '';
        this._simulatedDevices = new SimulatedDevices({});
    }

    initEvents() {
        let device = this._device;
        for (let i = 0; i < poweredUpModuleConstants.POWERED_UP_LAYER_COUNT; i++) {
            device
                .on('PoweredUp.Layer' + i + 'Uuid',   this, this.onUuid.bind(this, i))
                .on('PoweredUp.Layer' + i + 'Type',   this, this.onType.bind(this, i))
                .on('PoweredUp.Layer' + i + 'Tilt',   this, this.onTilt.bind(this, i))
                .on('PoweredUp.Layer' + i + 'Button', this, this.onButton.bind(this, i))
                .on('PoweredUp.Layer' + i + 'Accel',  this, this.onAccel.bind(this, i));
        }
        this._settings.on('Settings.AliasChanged', this, this.onAliasChanged);
        dispatcher.on('Simulator.Layer.Change', this, this.onChangeLayer.bind(this));
    }

    getMainElement() {
        return {
            className: 'powered-up remote',
            children: [
                {
                    className: 'hub-id',
                    children: [
                        {
                            id:        this.setUuidElement.bind(this),
                            type:      'span',
                            innerHTML: ''
                        }
                    ]
                },
                {
                    children: [
                        {
                            type:   TechnicHub,
                            plugin: this
                        },
                        {
                            type:   Hub,
                            plugin: this
                        },
                        {
                            type:   MoveHub,
                            plugin: this
                        },
                        {
                            type:   Remote,
                            plugin: this
                        }
                    ]
                }
            ]
        };
    }

    getDeviceByType(type) {
        switch (type) {
            case poweredUpModuleConstants.POWERED_UP_DEVICE_MOVE_HUB:    return this._moveHub;
            case poweredUpModuleConstants.POWERED_UP_DEVICE_HUB:         return this._hub;
            case poweredUpModuleConstants.POWERED_UP_DEVICE_REMOTE:      return this._remote;
            case poweredUpModuleConstants.POWERED_UP_DEVICE_TECHNIC_HUB: return this._technicHub;
        }
        return null;
    }

    getDeviceStateByLayer(layer) {
        let layerState = this._poweredUp.getLayerState(layer);
        if (layerState && layerState.getConnected()) {
            return layerState;
        }
        return this._simulatedDevices.getLayer(layer);
    }

    getDeviceTypeByLayer(layer) {
        return this.getDeviceStateByLayer(layer).getType();
    }

    getDeviceByLayer(layer) {
        return this.getDeviceByType(this.getDeviceTypeByLayer(layer));
    }

    getMotorCount() {
        switch (this.getDeviceStateByLayer(this._simulator.getLayer()).getType()) {
            case poweredUpModuleConstants.POWERED_UP_DEVICE_MOVE_HUB:    return 4;
            case poweredUpModuleConstants.POWERED_UP_DEVICE_HUB:         return 2;
            case poweredUpModuleConstants.POWERED_UP_DEVICE_REMOTE:      return 0;
            case poweredUpModuleConstants.POWERED_UP_DEVICE_TECHNIC_HUB: return 4;
        }
        return 0;
    }

    getButtons() {
        let poweredUp = this._poweredUp;
        if (!this._buttons) {
            this._buttons = {
                readButton: (layer) => {
                    let device = this.getDeviceByLayer(layer);
                    if (device && device.getButtons) {
                        return device.getButtons();
                    }
                    return 0;
                }
            };
        }
        return this._buttons;
    }

    getLight(layer) {
        let device = this.getDeviceByLayer(layer);
        if (device) {
            return device.getLight();
        }
        return dummyLight;
    }

    setUuidElement(element) {
        this._uuidElement = element;
        element.addEventListener('click', this.onClickUuid.bind(this));
    }

    setMoveHub(moveHub) {
        this._moveHub = moveHub;
    }

    setHub(hub) {
        this._hub = hub;
    }

    setRemote(remote) {
        this._remote = remote;
    }

    setTechnicHub(technicHub) {
        this._technicHub = technicHub;
    }

    /**
     * Select the type of device for the layer...
    **/
    setDeviceType(layer, type) {
        let motors = this._motors;
        for (let i = 0; i < 4; i++) {
            let motor = motors[layer * 4 + i];
            if (motor) {
                motor.getState().setType(-1);
            }
        }
        if (type === poweredUpModuleConstants.POWERED_UP_DEVICE_MOVE_HUB) {
            let motor = motors[layer * 4];
            if (motor) {
                motor.getState().setType(poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_MOVE_HUB_MOTOR);
            }
            motor = motors[layer * 4 + 1];
            if (motor) {
                motor.getState().setType(poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_MOVE_HUB_MOTOR);
            }
        }
        let device = this.getDeviceStateByLayer(layer);
        if (device && device.setType) {
            device.setType(type);
        } else {
            this._uuidElement.innerHTML = '';
        }
        if (layer === this._simulator.getLayer()) {
            this._hub.hide();
            this._moveHub.hide();
            this._technicHub.hide();
            this._remote.hide();
            let device = this.getDeviceByType(type);
            device && device.show();
            this.showMotors();
        }
    }

    setType(port) {
        let motor  = this._motors[port.layer * 4 + port.id];
        let device = this.getDeviceStateByLayer(port.layer);
        if (device && (device.getType() === poweredUpModuleConstants.POWERED_UP_DEVICE_MOVE_HUB) && (port.id < 2)) {
            if (!this._assignmentError) {
                dispatcher.dispatch(
                    'Console.Log',
                    {
                        type:      Console.MESSAGE_TYPE_ERROR,
                        message:   'Error: Can\'t assign motor type to <i>Move Hub</i> port "A" or "B".'
                    }
                );
                this._assignmentError = true;
            }
            return; // Can't assign built in motor!
        }
        this._assignmentError = false;
        motor && motor.getState().setType(port.type);
    }

    setMode(port) {
        let motor = this._motors[port.layer * 4 + port.id];
        motor && motor.getState().setMode(port.mode);
    }

    updateActiveLayer(layer) {
        if (layer === this._simulator.getLayer()) {
            this.showLayer(layer);
        }
    }

    showLayer(layer) {
        this._technicHub.clear();
        this._uuidElement.innerHTML = '';
        this.setDeviceType(layer, this.getDeviceTypeByLayer(layer));
        this.showMotors();
    }

    read(opts) {
        let motors = this._motors;
        let motor  = motors[opts.layer * 4 + opts.id];
        return motor ? motor.getState().getValue() : 0;
    }

    onUuid(layer, uuid) {
        if (layer === this._simulator.getLayer()) {
            this._uuid                  = uuid;
            this._uuidElement.innerHTML = this._settings.getDeviceAlias(uuid);
        }
    }

    onType(layer, type) {
        this.setDeviceType(layer, type);
    }

    onClickUuid(event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this._uuid) {
            return;
        }
        dispatcher.dispatch(
            'Dialog.DeviceAlias.Show',
            {
                uuid:  this._uuid,
                alias: this._settings.getDeviceAlias(this._uuid)
            }
        );
    }

    onTilt(layer, tilt) {
        if (layer === this._simulator.getLayer()) {
            let device = this.getDeviceByLayer(layer);
            device && device.setTilt && device.setTilt(tilt);
        }
    }

    onAccel(layer, accel) {
        if (layer === this._simulator.getLayer()) {
            let device = this.getDeviceByLayer(layer);
            device && device.setAccel && device.setAccel(accel);
        }
    }

    onButton(layer, button) {
        if (layer === this._simulator.getLayer()) {
            let device = this.getDeviceByLayer(layer);
            device && device.setButton && device.setButton(button);
        }
    }

    onAliasChanged() {
        this._uuidElement.innerHTML = this._settings.getDeviceAlias(this._uuid);
    }

    onChangeLayer(layer) {
        if (layer < poweredUpModuleConstants.POWERED_UP_LAYER_COUNT) {
            this.showLayer(layer);
        }
    }
};
