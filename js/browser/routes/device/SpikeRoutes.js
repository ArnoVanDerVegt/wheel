/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const SpikeRoutes = require('../../../shared/routes/device/SpikeRoutes').SpikeRoutes;

exports.SpikeRoutes = class extends SpikeRoutes {
    deviceList(req, res) {
        let list = [];
        res.send(JSON.stringify({result: true, list: list}));
    }
};
