/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const PoweredUpRoutes = require('../../../shared/routes/device/PoweredUpRoutes').PoweredUpRoutes;

exports.PoweredUpRoutes = class extends PoweredUpRoutes {
    scan(req, res) {
        this._poweredUp.scan();
        res.send(JSON.stringify({}));
    }
};
