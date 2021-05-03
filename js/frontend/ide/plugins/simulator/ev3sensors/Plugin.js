/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../../../shared/vm/modules/sensorModuleConstants');
const dispatcher            = require('../../../../lib/dispatcher').dispatcher;
const SimulatorPlugin       = require('../lib/SimulatorPlugin').SimulatorPlugin;
const SensorContainer       = require('./SensorContainer').SensorContainer;

exports.Plugin = class extends SimulatorPlugin {
    constructor(opts) {
        opts.device    = opts.devices.ev3;
        opts.constants = sensorModuleConstants;
        super(opts);
        this._baseClassName = 'sensors';
        this._sensors       = [];
        this.initDOM(opts.parentNode);
        dispatcher
            .on('VM.Start', this, this.onVMStart)
            .on('VM.Stop',  this, this.onVMStop);
        opts.settings.on('Settings.Plugin', this, this.onPluginSettings);
    }

    initDOM(parentNode) {
        let addSensor = this.addSensor.bind(this);
        let children  = [
                this.initTitle('EV3 sensors')
            ];
        for (let i = 0; i < 16; i++) {
            children.push({
                type:      SensorContainer,
                settings:  this._settings,
                ui:        this._ui,
                device:    this._device,
                simulator: this._simulator,
                sensors:   this,
                tabIndex:  this._tabIdex + (i & 3),
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
                children:  children
            }
        );
        return this;
    }

    onVMStart() {
        this._sensorsElement.className = 'sensors' +
            (this.getVisible() ? ' visible' : '') +
            (this._connected   ? ' running' : '');
    }

    onVMStop() {
        this._sensorsElement.className = 'sensors' +
            (this.getVisible() ? ' visible' : '');
    }

    onPluginSettings() {
        this._refs.sensors.className = this.getClassName();
    }

    setSensorsElement(element) {
        this._sensorsElement = element;
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

    callOnSensorState(layer, id, func, param) {
        let sensor = this.getSensor(layer, id);
        if (!sensor || !sensor.getCurrentSensor) {
            return 0;
        }
        let currentSensor = sensor.getCurrentSensor();
        if (currentSensor && currentSensor.getState() && currentSensor.getState()[func]) {
            return currentSensor.getState()[func](param);
        }
        return false;
    }

    getSensor(layer, id) {
        return this._sensors[layer * 4 + id] || null;
    }

    setType(opts) {
        let sensor = this.getSensor(opts.layer, opts.id);
        sensor && sensor.onAssigned(opts.type, null);
    }

    getType(opts) {
        return this.callOnSensorState(opts.layer, opts.id, 'getType');
    }

    setMode(opts) {
        return this.callOnSensorState(opts.layer, opts.id, 'setMode', opts.mode);
    }

    reset(opts) {
        return this.callOnSensorState(opts.layer, opts.id, 'reset');
    }

    read(opts) {
        return this.callOnSensorState(opts.layer, opts.id, 'getValue');
    }
};
