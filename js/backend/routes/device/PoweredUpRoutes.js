/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const PoweredUpRoutes = require('../../../shared/routes/device/PoweredUpRoutes').PoweredUpRoutes;

exports.PoweredUpRoutes = class extends PoweredUpRoutes {
    stopAllMotors(req, res) {
        let result           = {success: true};
        let activeLayerCount = req.body.activeLayerCount;
        let brake            = req.body.brake ? 1 : 0;
        let poweredUp        = this._poweredUp;
        for (let i = 0; i < activeLayerCount; i++) {
            for (let j = 0; j < 4; j++) {
                poweredUp.motorStop(i, j, brake);
            }
        }
        res.send(JSON.stringify(result));
    }
};
