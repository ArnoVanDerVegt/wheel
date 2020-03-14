/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const poweredUpModuleConstants = require('../../../../../shared/vm/modules/poweredUpModuleConstants');
const dispatcher               = require('../../../../lib/dispatcher').dispatcher;
const DOMNode                  = require('../../../../lib/dom').DOMNode;
const TextInput                = require('../../../../lib/components/TextInput').TextInput;
const SimulatorPlugin          = require('../lib/SimulatorPlugin').SimulatorPlugin;
const Plugin                   = require('../lib/motor/Plugin').Plugin;
const Motor                    = require('./io/Motor').Motor;
const SimulatedDevices         = require('./io/SimulatedDevices').SimulatedDevices;
const Hub                      = require('./components/Hub').Hub;
const TechnicHub               = require('./components/TechnicHub').TechnicHub;
const MoveHub                  = require('./components/MoveHub').MoveHub;
const Remote                   = require('./components/Remote').Remote;

const dummyLight = {
        setColor: function(color) {},
        off: function() {}
    };

exports.Plugin = class extends Plugin {
    constructor(opts) {
        opts.motorConstructor = Motor;
        opts.ev3              = opts.poweredUp; // Hack device should be fixed!
        super(opts);
        this.initEvents();
        this._buttons          = null;
        this._poweredUp        = opts.poweredUp;
        this._uuid             = '';
        this._simulatedDevices = new SimulatedDevices({});
    }

    initEvents() {
        let device = this._device;
        for (let i = 0; i < 4; i++) {
            device
                .on('PoweredUp.Layer' + i + 'Uuid',   this, this.onUuid.bind(this, i))
                .on('PoweredUp.Layer' + i + 'Type',   this, this.onType.bind(this, i))
                .on('PoweredUp.Layer' + i + 'Tilt',   this, this.onTilt.bind(this, i))
                .on('PoweredUp.Layer' + i + 'Button', this, this.onButton.bind(this, i))
                .on('PoweredUp.Layer' + i + 'Accel',  this, this.onAccel.bind(this, i));
        }
        this._settings.on('Settings.AliasChanged', this, this.onAliasChanged);
        dispatcher
            .on('Button.Layer0', this, this.onToggleLayer0.bind(this))
            .on('Button.Layer1', this, this.onToggleLayer1.bind(this))
            .on('Button.Layer2', this, this.onToggleLayer2.bind(this))
            .on('Button.Layer3', this, this.onToggleLayer3.bind(this));
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

    getDeviceTypeByLayer(layer) {
        let layerState = this._poweredUp.getLayerState(layer);
        let type       = this._simulatedDevices.getType(layer);
        if (layerState && layerState.getConnected()) {
            type = layerState.getType();
        }
        return type;
    }

    getDeviceByLayer(layer) {
        return this.getDeviceByType(this.getDeviceTypeByLayer(layer));
    }

    getMotorCount() {
        let layerState = this._poweredUp.getLayerState(this._simulator.getLayer());
        if (layerState) {
            switch (layerState.getType()) {
                case poweredUpModuleConstants.POWERED_UP_DEVICE_MOVE_HUB:    return 4;
                case poweredUpModuleConstants.POWERED_UP_DEVICE_HUB:         return 2;
                case poweredUpModuleConstants.POWERED_UP_DEVICE_REMOTE:      return 0;
                case poweredUpModuleConstants.POWERED_UP_DEVICE_TECHNIC_HUB: return 4;
            }
        }
        return 0;
    }

    getButtons() {
        let poweredUp = this._poweredUp;
        if (!this._buttons) {
            this._buttons = {
                readButton: (function(layer) {
                    let device = this.getDeviceByLayer(layer);
                    if (device && device.getButtons) {
                        return device.getButtons();
                    }
                    return 0;
                }).bind(this)
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

    _setDeviceType(type) {
        this._hub.hide();
        this._moveHub.hide();
        this._technicHub.hide();
        this._remote.hide();
        if (this._type !== type) {
            this._type = type;
            let simulatedLayerDevice = this._simulatedDevices.getLayer(this._simulator.getLayer());
            for (let i = 0; i < 4; i++) {
                simulatedLayerDevice.setPortType(i, -1);
            }
        }
        let device = this.getDeviceByType(type);
        device && device.show();
        this.showMotors();
    }

    /**
     * Select the type of device for the layer...
    **/
    setDeviceType(layer, type) {
        this._simulatedDevices.setType(layer, type);
        if (layer === this._simulator.getLayer()) {
            this._setDeviceType(this.getDeviceTypeByLayer(layer));
        }
        this.updateActiveLayer(layer);
    }

    /**
     * Select the device at the given port for the device at the given layer...
    **/
    setType(port) {
        let simulatedLayerDevice = this._simulatedDevices.getLayer(port.layer);
        if (simulatedLayerDevice) {
            simulatedLayerDevice.setPortType(port.id, port.type);
            this.updateActiveLayer(port.layer);
        }
    }

    updateActiveLayer(layer) {
        if (layer === this._simulator.getLayer()) {
            this.showLayer(layer);
        }
    }

    showLayer(layer) {
        this._technicHub.clear();
        this._uuidElement.innerHTML = '';
        super.showLayer(layer);
        let layerState = this._poweredUp.getLayerState(layer);
        if (layerState && layerState.getConnected()) {
            this._setDeviceType(layerState.getType());
        } else if ((layer >= 0) && (layer <= 3)) {
            let simulatedLayerDevice = this._simulatedDevices.getLayer(layer);
            let motors               = this._motors;
            for (let port = 0; port < 4; port++) {
                motors[layer * 4 + port].onAssigned(simulatedLayerDevice.getPortType(port));
            }
        }
    }

    onUuid(layer, uuid) {
        if (layer === this._simulator.getLayer()) {
            this._uuid                  = uuid;
            this._uuidElement.innerHTML = this._settings.getDeviceAlias(uuid);
        }
    }

    onType(layer, type) {
        if (layer === this._simulator.getLayer()) {
            this._setDeviceType(type);
        }
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

    onToggleLayer0() {
        this.showLayer(0);
    }

    onToggleLayer1() {
        this.showLayer(1);
    }

    onToggleLayer2() {
        this.showLayer(2);
    }

    onToggleLayer3() {
        this.showLayer(3);
    }
};
