/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher      = require('../../../../lib/dispatcher').dispatcher;
const DOMNode         = require('../../../../lib/dom').DOMNode;
const TextInput       = require('../../../../lib/components/TextInput').TextInput;
const SimulatorPlugin = require('../lib/SimulatorPlugin').SimulatorPlugin;
const Plugin          = require('../lib/motor/Plugin').Plugin;
const Motor           = require('./io/Motor').Motor;
const TechnicHub      = require('./components/TechnicHub').TechnicHub;
const Remote          = require('./components/Remote').Remote;

const POWERED_UP_REMOTE = 4;
const POWERED_UP_HUB    = 6;

exports.Plugin = class extends Plugin {
    constructor(opts) {
        opts.motorConstructor = Motor;
        opts.ev3              = opts.poweredUp; // Hack device should be fixed!
        super(opts);
        this.initEvents();
        this._buttons   = null;
        this._poweredUp = opts.poweredUp;
        this._uuid      = '';
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
                            type:   Remote,
                            plugin: this
                        }
                    ]
                }
            ]
        };
    }

    getActiveDevice() {
        switch (this._type) {
            case POWERED_UP_REMOTE:
                return this._remote;
            case POWERED_UP_HUB:
                return this._technicHub;
        }
        return null;
    }

    getButtons() {
        if (!this._buttons) {
            this._buttons = {
                readButton: (function(layer) {
                    let device = this.getActiveDevice();
                    if (device && device.getButtons) {
                        return device.getButtons();
                    }
                    return 0;
                }).bind(this)
            };
        }
        return this._buttons;
    }

    getLight() {
        let device = this.getActiveDevice();
        if (device) {
            return device.getLight();
        }
        return {
            setColor: function(color) {},
            off: function() {}
        };
    }

    setUuidElement(element) {
        this._uuidElement = element;
        element.addEventListener('click', this.onClickUuid.bind(this));
    }

    setTechnicHub(technicHub) {
        this._technicHub = technicHub;
    }

    setRemote(remote) {
        this._remote = remote;
    }

    setType(type) {
        this._technicHub.hide();
        this._remote.hide();
        this._type = type;
        let device = this.getActiveDevice();
        device && device.show();
        this.showMotors((this._type === POWERED_UP_REMOTE) ? 0 : 4);
    }

    showLayer(layer) {
        this._technicHub.clear();
        this._uuidElement.innerHTML = '';
        super.showLayer(layer);
        this.setType(this._poweredUp.getLayerState(layer).getType());
    }

    onUuid(layer, uuid) {
        if (layer === this._simulator.getLayer()) {
            this._uuid                  = uuid;
            this._uuidElement.innerHTML = this._settings.getDeviceAlias(uuid);
        }
    }

    onType(layer, type) {
        if (layer === this._simulator.getLayer()) {
            this.setType(type);
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
            this._technicHub.setTilt(tilt);
        }
    }

    onAccel(layer, accel) {
        if (layer === this._simulator.getLayer()) {
            this._technicHub.setAccel(accel);
        }
    }

    onButton(layer, button) {
        if (layer === this._simulator.getLayer()) {
            let device = this.getActiveDevice();
            device && device.setButton(button);
        }
    }

    onAliasChanged() {
        console.log('Changed:', this._uuid);
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
