/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../../../shared/vm/modules/sensorModuleConstants');
const dispatcher            = require('../../../../lib/dispatcher').dispatcher;
const DOMNode               = require('../../../../lib/dom').DOMNode;
const SimulatorPlugin       = require('../lib/SimulatorPlugin').SimulatorPlugin;
const SensorContainer       = require('./SensorContainer').SensorContainer;

exports.Plugin = class extends SimulatorPlugin {
    constructor(opts) {
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
        let children  = [];
        for (let i = 0; i < 16; i++) {
            children.push({
                type:      SensorContainer,
                ui:        this._ui,
                device:    this._device,
                simulator: this._simulator,
                sensors:   this,
                tabIndex:  this._tabIdex + i * 3,
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
            (this._plugin.visible ? ' visible' : '') +
            (this._connected      ? ' running' : '');
    }

    onVMStop() {
        this._sensorsElement.className = 'sensors' + (this._plugin.visible ? ' visible' : '');
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
