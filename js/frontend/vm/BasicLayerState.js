/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/

exports.BasicLayerState = class {
    constructor(opts) {
        this._device       = opts.device;
        this._signalPrefix = opts.signalPrefix;
        this._layer        = opts.layer;
        this._ports        = [this.createPort(), this.createPort(), this.createPort(), this.createPort()];
    }

    createPort() {
        return {
            mode:       0,
            value:      0,
            assignment: 0,
            ready:      true
        };
    }

    getPorts() {
        return this._ports;
    }

    getPortValues(property) {
        let result = [];
        for (let i = 0; i < 4; i++) {
            result.push(this._ports[i][property]);
        }
    }

    getSensors() {
        return this.getPortValues('value');
    }

    getMotors() {
        return this.getPortValues('value');
    }

    getPortAssignments() {
        return this.getPortValues('assignment');
    }

    checkSensorChange(newSensors) {
        let device = this._device;
        let ports  = this._ports;
        let layer  = this._layer;
        for (let i = 0; i < 4; i++) {
            let port     = ports[i];
            let assigned = newSensors[i].assigned || 0;
            let mode     = newSensors[i].mode     || null;
            if ((port.assigned !== assigned) || (port.mode !== mode)) {
                port.assigned = assigned;
                port.mode     = mode;
                device.emit(this._signalPrefix + layer + 'Sensor' + i + 'Assigned', assigned, mode);
            }
            let value = newSensors[i].value || 0;
            if (port.value !== value) {
                port.value = value;
                device.emit(this._signalPrefix + layer + 'Sensor' + i + 'Changed', value);
            }
        }
    }
};
