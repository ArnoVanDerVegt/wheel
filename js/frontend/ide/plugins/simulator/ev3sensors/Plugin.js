/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../../../shared/vm/modules/sensorModuleConstants');
const dispatcher            = require('../../../../lib/dispatcher').dispatcher;
const DOMNode               = require('../../../../lib/dom').DOMNode;
const Checkbox              = require('../../../../lib/components/Checkbox').Checkbox;
const ContextMenu           = require('../../../../lib/components/ContextMenu').ContextMenu;
const tabIndex              = require('../../../tabIndex');
const SimulatorPlugin       = require('../lib/SimulatorPlugin').SimulatorPlugin;
const SensorContainer       = require('./SensorContainer').SensorContainer;

exports.Plugin = class extends SimulatorPlugin {
    constructor(opts) {
        super(opts);
        this._baseClassName = 'sensors';
        this._contextMenus  = {};
        this._sensors       = [];
        this.initDOM(opts.parentNode);
        this._device
            .addEventListener('EV3.Connected',    this, this.onEV3Connected)
            .addEventListener('EV3.Connecting',   this, this.onEV3Connecting)
            .addEventListener('EV3.Disconnected', this, this.onEV3Disconnected);
        dispatcher
            .on('VM.Start', this, this.onVMStart)
            .on('VM.Stop',  this, this.onVMStop);
        opts.settings.on('Settings.Plugin', this, this.onPluginSettings);
    }

    initDOM(parentNode) {
        let addSensor = this.addSensor.bind(this);
        let children  = [];
        for (let i = 0; i < 16; i++) {
            children.push({
                type:      SensorContainer,
                ui:        this._ui,
                device:    this._device,
                simulator: this._simulator,
                sensors:   this,
                tabIndex:  tabIndex.LAYER_1_SENSOR_1 + i,
                layer:     ~~(i / 4),
                id:        i & 3,
                title:     (1 + (i & 3)) + '',
                addSensor: addSensor,
                hidden:    (i >= 4)
            });
        }
        this.create(
            parentNode,
            {
                ref:       this.setRef('sensors'),
                id:        this.setSensorsElement.bind(this),
                className: this.getClassName(),
                children:  children.concat([
                    {
                        id:        this.setAutoResetPanel.bind(this),
                        className: 'auto-reset',
                        children: [
                            {
                                id:       this.setAutoResetCheckbox.bind(this),
                                ui:       this._ui,
                                uiId:     1,
                                type:     Checkbox,
                                tabIndex: tabIndex.SENSOR_AUTO_RESET,
                                checked:  true
                            },
                            {
                                className: 'label',
                                innerHTML: 'Auto reset sensor value'
                            }
                        ]
                    }
                ])
            }
        );
        return this;
    }

    initSensorModeMenu(menu, options) {
        for (let i = 0; i < options.length; i++) {
            options[i] = this.initSensorModeOption(menu, options[i], i);
        }
        let contextMenu = new ContextMenu({
                ui:         this._ui,
                parentNode: document.body,
                options:    options,
                withCheck:  true
            });
        this[menu] = contextMenu;
        return contextMenu;
    }

    initSensorModeOption(menu, sensorMode, index) {
        return {
            title: sensorMode,
            onClick: (function() {
                let mode      = null;
                let menuItems = this[menu].getMenuItems();
                for (let i = 0; i < menuItems.length; i++) {
                    let menuItem = menuItems[i];
                    let checked  = index === i;
                    if (checked) {
                        mode = sensorModuleConstants[menuItem.getTitle()];
                        break;
                    }
                }
                if (mode !== null) {
                    let sensor = this._activeSensor;
                    sensor.setMode(mode);
                    this._device.setMode(sensor.getLayer(), sensor.getId(), mode);
                }
            }).bind(this)
        };
    }

    clearDisconnectedTimeout() {
        if (this._disconnectedTimeout) {
            clear(this._disconnectedTimeout);
        }
        this._disconnectedTimeout = null;
    }

    onEV3Connecting(deviceName) {
        this.clearDisconnectedTimeout();
        this._autoResetPanelElement.style.display = 'none';
    }

    onEV3Connected() {
        this.clearDisconnectedTimeout();
        this._connected                           = true;
        this._autoResetPanelElement.style.display = 'none';
    }

    onEV3Disconnected() {
        this.clearDisconnectedTimeout();
        this._connected = true;
        this._disconnectedTimeout = setTimeout(
            (function() {
                this._autoResetPanelElement.style.display = 'block';
                this._disconnectedTimeout                 = null;
            }).bind(this),
            5000
        );
    }

    onVMStart() {
        this._sensorsElement.className = 'sensors' +
            (this._plugin.visible ? ' visible' : '') +
            (this._connected      ? ' running' : '');
    }

    onVMStop() {
        this._sensorsElement.className = 'sensors' + (this._plugin.visible ? ' visible' : '');
    }

    onPluginSettings() {
        this._refs.sensors.className = this.getClassName();
    }

    getContextMenu(options) {
        let key          = options.join('|');
        let contextMenus = this._contextMenus;
        if (!(key in contextMenus)) {
            contextMenus[key] = this.initSensorModeMenu(key, options);
        }
        return contextMenus[key];
    }

    getAutoReset() {
        return this._autoResetCheckbox.getChecked();
    }

    setSensorsElement(element) {
        this._sensorsElement = element;
    }

    setAutoResetPanel(element) {
        this._autoResetPanelElement = element;
    }

    setAutoResetCheckbox(element) {
        this._autoResetCheckbox = element;
    }

    showContextMenu(sensor, pos, event) {
        this._activeSensor = sensor;
        pos.x += 62;
        if (pos.y < window.innerHeight / 2) {
            pos.y += 71;
        }
        let options = sensor.getContextMenuOptions();
        if (!options) {
            return;
        }
        let contextMenu = this.getContextMenu(options);
        if (contextMenu) {
            let menuItems = contextMenu.getMenuItems();
            for (let i = 0; i < menuItems.length; i++) {
                let menuItem = menuItems[i];
                menuItem.setChecked(sensor.getMode() === sensorModuleConstants[menuItem.getTitle()]);
            }
            contextMenu.show(pos.x, pos.y, this);
        }
    }

    showLayer(layer) {
        let sensors = this._sensors;
        for (let i = 0; i < sensors.length; i++) {
            sensors[i].setHidden(layer !== (i >> 2));
        }
    }

    addSensor(sensor) {
        this._sensors.push(sensor);
    }

    callOnSensor(layer, id, func, param) {
        let sensor = this.getSensor(layer, id);
        if (sensor && sensor[func]) {
            return sensor[func](param);
        }
        return false;
    }

    getSensor(layer, id) {
        return this._sensors[layer * 4 + id] || null;
    }

    setType(opts) {
        this.callOnSensor(opts.layer, opts.id, 'setType', opts.type);
    }

    getType(opts) {
        return this.callOnSensor(opts.layer, opts.id, 'getType');
    }

    setMode(opts) {
        this.callOnSensor(opts.layer, opts.id, 'setMode', opts.mode);
    }

    reset(opts) {
        this.callOnSensor(opts.layer, opts.id, 'reset');
    }

    read(opts) {
        return this.callOnSensor(opts.layer, opts.id, 'read');
    }
};
