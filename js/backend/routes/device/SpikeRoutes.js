/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const SpikeRoutes = require('../../../shared/routes/device/SpikeRoutes').SpikeRoutes;

exports.SpikeRoutes = class extends SpikeRoutes {
    deviceList(req, res) {
        let spike = this._spike;
        new this._serialPortConstructor().getPorts((ports) => {
            let list = [];
            ports.forEach((port) => {
                list.push({
                    title:      port.path,
                    connected:  spike.getConnected(port.path),
                    connecting: spike.getConnecting(port.path)
                });
            });
            res.send(JSON.stringify({result: true, list: list}));
        });
    }
};
