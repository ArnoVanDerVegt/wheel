/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../shared/vm/modules/sensorModuleConstants');
const dispatcher            = require('../../lib/dispatcher').dispatcher;
const DOMNode               = require('../../lib/dom').DOMNode;
const Checkbox              = require('../../lib/components/Checkbox').Checkbox;
const ContextMenu           = require('../../lib/components/ContextMenu').ContextMenu;
const tabIndex              = require('../tabIndex');
const Sensor                = require('./io/Sensor').Sensor;

exports.SimulatorSensors = class extends DOMNode {
    constructor(opts) {
        super(opts);
        let brick = opts.brick;
        this._ui                  = opts.ui;
        this._brick               = brick;
        this._simulator           = opts.simulator;
        this._sensors             = [];
        this._disconnectedTimeout = null;
        this._connected           = false;
        this
            .initDOM(opts.parentNode)
            .initContextMenus();
        // Brick events...
        brick
            .addEventListener('Brick.Connected',    this, this.onBrickConnected)
            .addEventListener('Brick.Connecting',   this, this.onBrickConnecting)
            .addEventListener('Brick.Disconnected', this, this.onBrickDisconnected);
        dispatcher
            .on('VM.Start', this, this.onVMStart)
            .on('VM.Stop',  this, this.onVMStop);
        this._simulator.registerPlugin('sensors', this);
    }

    initDOM(parentNode) {
        let addSensor = this.addSensor.bind(this);
        let children  = [];
        for (let i = 0; i < 16; i++) {
            children.push({
                type:      Sensor,
                ui:        this._ui,
                brick:     this._brick,
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
                id:        this.setSensorsElement.bind(this),
                className: 'sensors',
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

    initContextMenus() {
        this._colorContextMenu = this.initSensorModeMenu(
            '_colorContextMenu',
            [
                'COLOR_REFLECTED',
                'COLOR_AMBIENT',
                'COLOR_COLOR',
                'COLOR_REFLECTED_RAW',
                'COLOR_RGB_RAW',
                'COLOR_CALIBRATION'
            ]
        );
        this._ultrasonicContextMenu = this.initSensorModeMenu(
            '_ultrasonicContextMenu',
            [
                'ULTRASONIC_CM',
                'ULTRASONIC_INCH',
                'ULTRASONIC_LISTEN',
                'ULTRASONIC_SI_CM',
                'ULTRASONIC_SI_INCH',
                'ULTRASONIC_DC_CM',
                'ULTRASONIC_DC_INCH'
            ]
        );
        this._gyroContextMenu = this.initSensorModeMenu(
            '_gyroContextMenu',
            [
                'GYRO_ANGLE',
                'GYRO_RATE',
                'GYRO_FAST',
                'GYRO_RATE_AND_ANGLE',
                'GYRO_CALIBRATION'
            ]
        );
        this._irContextMenu = this.initSensorModeMenu(
            '_irContextMenu',
            [
                'IR_PROXIMITY',
                'IR_SEEKER',
                'IR_REMOTE',
                'IR_REMOTE_ADVANCED',
                'IR_NOT_UTILIZED',
                'IR_CALIBRATION'
            ]
        );
    }

    initSensorModeMenu(menu, options) {
        for (let i = 0; i < options.length; i++) {
            options[i] = this.initSensorModeOption(menu, options[i], i);
        }
        return new ContextMenu({
            ui:         this._ui,
            parentNode: document.body,
            options:    options,
            withCheck:  true
        });
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
                    this._brick.setMode(sensor.getLayer(), sensor.getId(), mode);
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

    onBrickConnecting(deviceName) {
        this.clearDisconnectedTimeout();
        this._autoResetPanelElement.style.display = 'none';
    }

    onBrickConnected() {
        this.clearDisconnectedTimeout();
        this._connected                           = true;
        this._autoResetPanelElement.style.display = 'none';
    }

    onBrickDisconnected() {
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
        this._sensorsElement.className = 'sensors' + (this._connected ? ' running' : '');
    }

    onVMStop() {
        this._sensorsElement.className = 'sensors';
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
        let contextMenu = null;
        switch (sensor.getType()) {
            case sensorModuleConstants.SENSOR_TYPE_NXT_COLOR:
            case sensorModuleConstants.SENSOR_TYPE_COLOR:
                contextMenu = this._colorContextMenu;
                break;
            case sensorModuleConstants.SENSOR_TYPE_NXT_ULTRASONIC:
            case sensorModuleConstants.SENSOR_TYPE_ULTRASONIC:
                contextMenu = this._ultrasonicContextMenu;
                break;
            case sensorModuleConstants.SENSOR_TYPE_GYRO:
                contextMenu = this._gyroContextMenu;
                break;
            case sensorModuleConstants.SENSOR_TYPE_INFRARED:
                contextMenu = this._irContextMenu;
                break;
        }
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
