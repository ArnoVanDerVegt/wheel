/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const EV3Routes = require('../../../shared/routes/device/EV3Routes').EV3Routes;
const path      = require('path');
const fs        = require('fs');

exports.EV3Routes = class extends EV3Routes {
    download(req, res) {
        let result         = {};
        let localFilename  = req.body.localFilename;
        let remoteFilename = req.body.remoteFilename;
        if (fs.existsSync(path.sep + localFilename)) {
            localFilename = path.sep + localFilename;
        }
        if (fs.existsSync(localFilename)) {
            let data = fs.readFileSync(localFilename);
            this._downloadData(
                data,
                remoteFilename,
                function() {
                    result.error = false;
                    res.send(JSON.stringify(result));
                }
            );
        } else {
            result.error   = true;
            result.message = 'File not found';
            res.send(JSON.stringify(result));
        }
    }
};
