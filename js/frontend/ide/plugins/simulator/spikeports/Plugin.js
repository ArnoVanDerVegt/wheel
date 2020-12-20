/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../../../shared/vm/modules/sensorModuleConstants');
const dispatcher            = require('../../../../lib/dispatcher').dispatcher;
const Plugin                = require('../lib/motor/Plugin').Plugin;
const MotorOrSensor         = require('./io/MotorOrSensor').MotorOrSensor;
const MotorOrSensorState    = require('./io/MotorOrSensorState').MotorOrSensorState;

exports.Plugin = class extends Plugin {
    constructor(opts) {
        opts.device           = opts.spike;
        opts.constants        = sensorModuleConstants;
        opts.motorConstructor = MotorOrSensor;
        opts.stateConstructor = MotorOrSensorState;
        opts.baseClassName    = 'motors spike-ports';
        opts.portCount        = 6;
        super(opts);
        dispatcher
            .on('VM.Start', this, this.onVMStart)
            .on('VM.Stop',  this, this.onVMStop);
    }

    initEvents() {
    }

    onVMStart() {
        this._refs.motors.className = 'motors spike-ports' +
            (this._plugin.visible ? ' visible' : '') +
            (this._connected      ? ' running' : '');
    }

    onVMStop() {
        this._refs.motors.className = 'motors spike-ports' + (this._plugin.visible ? ' visible' : '');
    }

    onPluginSettings() {
        this._refs.motors.className = this.getClassName();
    }

    showLayer(layer) {
        let sensors = this._sensors;
        for (let i = 0; i < sensors.length; i++) {
            sensors[i].setHidden(layer !== Math.floor(i / 6));
        }
    }

    addSensor(sensor) {
        this._sensors.push(sensor);
    }

    callOnSensorState(layer, id, func, param) {
        let sensor = this.getSensor(layer, id);
        if (!sensor) {
            return 0;
        }
        let currentSensor = sensor.getCurrentSensor();
        if (currentSensor && currentSensor.getState() && currentSensor.getState()[func]) {
            return currentSensor.getState()[func](param);
        }
        return false;
    }

    getSensor(layer, id) {
        return this._sensors[layer * 6 + id] || null;
    }

    setType(opts) {
        console.log(opts);
        // Todo: let sensor = this.getSensor(opts.layer, opts.id); sensor && sensor.onAssigned(opts.type, null);
    }

    getType(opts) {
        return 0; // Todo: this.callOnSensorState(opts.layer, opts.id, 'getType');
    }

    setMode(opts) {
        return 0; // Todo: this.callOnSensorState(opts.layer, opts.id, 'setMode', opts.mode);
    }

    reset(opts) {
        return 0; // Todo: this.callOnSensorState(opts.layer, opts.id, 'reset');
    }

    read(opts) {
        return 0; // Todo: this.callOnSensorState(opts.layer, opts.id, 'getValue');
    }
};
