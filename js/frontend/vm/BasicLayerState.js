/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/

exports.BasicLayerState = class {
    constructor(opts) {
        this._device       = opts.device;
        this._signalPrefix = opts.signalPrefix;
        this._layerIndex   = opts.layerIndex;
        this._connected    = false;
        this._connecting   = false;
        this._ports        = [];
        for (let i = 0; i < this._device.getPortsPerLayer(); i++) {
            this._ports.push(this.createPort());
        }
    }

    createPort() {
        return {
            ready:         true,
            mode:          0,
            value:         0,
            assigned:      0,
            startDegrees:  0,
            targetDegrees: 0,
            reverse:       1
        };
    }

    getConnecting() {
        return this._connecting;
    }

    getPorts() {
        return this._ports;
    }

    getMotorPort(port) {
        return this._ports[port];
    }

    getPortValues(property) {
        let result = [];
        for (let i = 0; i < this._device.getPortsPerLayer(); i++) {
            result.push(this._ports[i][property]);
        }
        return result;
    }

    getSensors() {
        return this.getPortValues('value');
    }

    getMotors() {
        return this.getPortValues('value');
    }

    getPortAssignments() {
        return this.getPortValues('assigned');
    }

    getConnected() {
        return this._connected;
    }

    setConnected(connected) {
        this._connected = connected;
    }

    disconnect() {
        this._connecting = false;
        this._connected  = false;
        this._deviceName = '';
        this._device
            .emit(this._signalPrefix + '.Disconnected')
            .emit(this._signalPrefix + '.Disconnected' + this._layerIndex);
    }

    checkSensorChange(newSensors) {
        let device     = this._device;
        let ports      = this._ports;
        let layerIndex = this._layerIndex;
        for (let i = 0; i < this._device.getPortsPerLayer(); i++) {
            let port      = ports[i];
            let newSensor = newSensors[i];
            let assigned  = ('assigned' in newSensor) ? newSensor.assigned : 0;
            let mode      = ('mode'     in newSensor) ? newSensor.mode     : null;
            if ((port.assigned !== assigned) || (port.mode !== mode)) {
                port.assigned = assigned;
                port.mode     = mode;
                device.emit(this._signalPrefix + layerIndex + 'Sensor' + i + 'Assigned', assigned, mode);
            }
            let value = ('value' in newSensor) ? newSensor.value : 0;
            if (port.value !== value) {
                port.value = value;
                device.emit(this._signalPrefix + layerIndex + 'Sensor' + i + 'Changed', value);
            }
        }
        return this;
    }
};
