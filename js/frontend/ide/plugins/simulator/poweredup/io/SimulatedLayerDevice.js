/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const poweredUpModuleConstants = require('../../../../../../shared/vm/modules/poweredUpModuleConstants');

exports.SimulatedLayerDevice = class {
    constructor(opts) {
        this._type  = -1;
        this._ports = [
            this.createPort(),
            this.createPort(),
            this.createPort(),
            this.createPort()
        ];
    }

    createPort() {
        return {
            type: -1
        };
    }

    getValidPort(port) {
        return ((port >= 0) && (port <= 3));
    }

    getType() {
        return this._type;
    }

    setType(type) {
        if (type === poweredUpModuleConstants.POWERED_UP_DEVICE_MOVE_HUB) {
            let ports = this._ports;
            ports[0].type = poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_MOVE_HUB_MOTOR;
            ports[1].type = poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_MOVE_HUB_MOTOR;
        }
        this._type = type;
    }

    getPortType(port) {
        return this.getValidPort(port) ? this._ports[port].type : -1;
    }

    setPortType(port, type) {
        if (this.getValidPort(port)) {
            if ((this._type === poweredUpModuleConstants.POWERED_UP_DEVICE_MOVE_HUB) && (port < 2)) {
                // The first two ports of the Move Hub are built in and can not be changed...
                return;
            }
            this._ports[port].type = type;
        }
    }
};
