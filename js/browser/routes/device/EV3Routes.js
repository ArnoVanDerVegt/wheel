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
    getLocalStorageFiles() {
        return require('./js/browser/routes/LocalStorageFiles').getLocalStorageFiles();
    }

    file(params, callback) {
        let path       = require('./js/shared/lib/path');
        let files      = require('./js/frontend/ide/data/templates').files;
        let localFiles = this.getLocalStorageFiles().getFiles();
        let extension  = path.getExtension(params.filename);
        let data       = null;
        let filenames  = (typeof params.filename === 'string') ? [params.filename] : params.filename;
        let filename   = '';
        const findFile = (filename) => {
                if (filename in files) {
                    return atob(files[filename]);
                } else if ('Wheel' + filename in files) {
                    return atob(files['Wheel' + filename]);
                } else if (filename in localFiles) {
                    return localFiles[filename];
                }
                return null;
            };
        for (let i = filenames.length - 1; i >= 0; i--) {
            filename = filenames[i];
            data     = findFile(filename);
            if (data) {
                break;
            }
        }
        switch (extension) {
            case '.rgf':
                const RgfImage = require('./js/shared/lib/RgfImage').RgfImage;
                data = new RgfImage().unpack(data);
                break;
            case '.rsf':
                let rsf = [];
                for (let i = 0; i < data.length; i++) {
                    rsf.push(data.charCodeAt(i));
                }
                data = {data: rsf};
                break;
            case '.wfrm':
                let whlData  = findFile(path.replaceExtension(filename, '.whl'));
                let whlpData = findFile(path.replaceExtension(filename, '.whlp'));
                if (whlData || whlpData) {
                    data = {wfrm: data, whl: whlData || whlpData, isProject: !!whlpData};
                } else {
                    data = {wfrm: data, whl: whlData || whlpData};
                }
                break;
        }
        callback({success: !!data, data: data});
    }

    download(req, res) {
        let result         = {};
        let localFilename  = req.body.localFilename;
        let remoteFilename = req.body.remoteFilename;
        this.file(
            {filename: localFilename},
            (file) => {
                if (!file.success) {
                    result.error   = true;
                    result.message = 'File not found';
                    res.send(JSON.stringify(result));
                    return;
                }
                this._downloadData(
                    file.data,
                    remoteFilename,
                    function() {
                        result.error = false;
                        res.send(JSON.stringify(result));
                    }
                );
            }
        );
    }
};
