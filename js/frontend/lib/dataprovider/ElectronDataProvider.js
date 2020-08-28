/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const ideRoutes       = require('../../../backend/routes/ide').ideRoutes;
const ev3Routes       = require('../../../backend/routes/ev3').ev3Routes;
const poweredUpRoutes = require('../../../backend/routes/poweredUp').poweredUpRoutes;

const routes = {
        // IDE...
        'ide/file':                       ideRoutes.file,
        'ide/file-save':                  ideRoutes.fileSave,
        'ide/file-save-base64-as-binary': ideRoutes.fileSaveBase64AsBinary,
        'ide/file-append':                ideRoutes.fileAppend,
        'ide/file-delete':                ideRoutes.fileDelete,
        'ide/file-size':                  ideRoutes.fileSize,
        'ide/files':                      ideRoutes.files,
        'ide/files-in-path':              ideRoutes.filesInPath,
        'ide/find-in-file':               ideRoutes.findInFile,
        'ide/directory-create':           ideRoutes.directoryCreate,
        'ide/directory-delete':           ideRoutes.directoryDelete,
        'ide/path-create':                ideRoutes.pathCreate,
        'ide/path-exists':                ideRoutes.pathExists,
        'ide/rename':                     ideRoutes.rename,
        'ide/settings-load':              ideRoutes.settingsLoad,
        'ide/settings-save':              ideRoutes.settingsSave,
        'ide/changes':                    ideRoutes.changes,
        'ide/user-info':                  ideRoutes.userInfo,
        'ide/exec':                       ideRoutes.exec,
        'ide/reveal-in-finder':           ideRoutes.revealInFinder,
        // EV3...
        'ev3/device-list':                ev3Routes.deviceList,
        'ev3/connect':                    ev3Routes.connect,
        'ev3/disconnect':                 ev3Routes.disconnect,
        'ev3/connecting':                 ev3Routes.connecting,
        'ev3/connected':                  ev3Routes.connected,
        'ev3/update':                     ev3Routes.update,
        'ev3/download-data':              ev3Routes.downloadData,
        'ev3/download':                   ev3Routes.download,
        'ev3/create-dir':                 ev3Routes.createDir,
        'ev3/delete-file':                ev3Routes.deleteFile,
        'ev3/files':                      ev3Routes.files,
        'ev3/stop-all-motors':            ev3Routes.stopAllMotors,
        'ev3/stop-polling':               ev3Routes.stopPolling,
        'ev3/resume-polling':             ev3Routes.resumePolling,
        'ev3/set-mode':                   ev3Routes.setMode,
        // Powered Up...
        'powered-up/device-list':         poweredUpRoutes.deviceList,
        'powered-up/connect':             poweredUpRoutes.connect,
        'powered-up/disconnect':          poweredUpRoutes.disconnect,
        'powered-up/connecting':          poweredUpRoutes.connecting,
        'powered-up/connected':           poweredUpRoutes.connected,
        'powered-up/update':              poweredUpRoutes.update,
        'powered-up/stop-all-motors':     poweredUpRoutes.stopAllMotors,
        'powered-up/stop-polling':        poweredUpRoutes.stopPolling,
        'powered-up/resume-polling':      poweredUpRoutes.resumePolling,
        'powered-up/set-mode':            poweredUpRoutes.setMode
    };

for (let i in routes) {
    switch (i.substr(0, 3)) {
        case 'ide':
            routes[i] = routes[i].bind(ideRoutes);
            break;
        case 'ev3':
            routes[i] = routes[i].bind(ev3Routes);
            break;
        case 'pow':
            routes[i] = routes[i].bind(poweredUpRoutes);
            break;
    }
}

exports.ElectronDataProvider = class {
    getData(method, uri, params, callback) {
        if (!(uri in routes)) {
            console.error('Unknown electron route "' + uri + '".');
            return;
        }
        let req = {};
        let res = {
                send: function(data) {
                    if (params.arrayBuffer) {
                        let arrayBuffer = new ArrayBuffer(data.length);
                        let buffer      = new Uint8Array(arrayBuffer);
                        for (let i = 0; i < data.length; i++) {
                            buffer[i] = data[i];
                        }
                        data = arrayBuffer;
                    }
                    callback && callback(data);
                }
            };
        if (method === 'get') {
            req.query = params;
        } else {
            req.body = params;
        }
        setTimeout(() => { routes[uri](req, res); }, 0);
    }
};
