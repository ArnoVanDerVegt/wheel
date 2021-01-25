/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const EV3Routes      = require('../../../shared/routes/device/EV3Routes').EV3Routes;
const messageEncoder = require('../../../shared/device/ev3/messageEncoder');
const CommandQueue   = require('../../../shared/device/ev3/CommandQueue').CommandQueue;
const constants      = require('../../../shared/device/ev3/constants');
const path           = require('../../../shared/lib/path');

exports.EV3Routes = class extends EV3Routes {
    /**
     * Todo: Fix for web version...
    **/
    download(req, res) {
        let result = {};
        result.error   = true;
        result.message = 'File not found';
        res.send(JSON.stringify(result));
    }
};
