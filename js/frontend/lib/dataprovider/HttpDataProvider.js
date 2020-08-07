/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Http      = require('../Http').Http;
const path      = require('../path');
const platform  = require('../platform');
const ideRoutes = require('../../../browser/routes/ide').ideRoutes;

let poweredUpRoutes = {};
let pathByIndex     = {};

if ((typeof document === 'object') && (document.location.href.indexOf('electron.html') === -1)) {
    poweredUpRoutes = require('../../../browser/routes/poweredUp').poweredUpRoutes;
}

const getPathByIndex = function(index) {
        if (index in pathByIndex) {
            return pathByIndex[index];
        }
        pathByIndex[index] = 'Wheel';
        return pathByIndex[index];
    };

const routes = {
        'ide/files':                      ideRoutes.files,
        'ide/file':                       ideRoutes.file,
        'ide/file-save':                  ideRoutes.fileSave,
        'ide/file-delete':                ideRoutes.fileDelete,
        'ide/files-in-path':              ideRoutes.filesInPath,
        'ide/settings-load':              ideRoutes.settingsLoad,
        'ide/settings-save':              ideRoutes.settingsSave,
        'ide/changes':                    ideRoutes.changes,
        'ide/path-create':                ideRoutes.pathCreate,
        'ide/directory-create':           ideRoutes.directoryCreate,
        'ide/directory-delete':           ideRoutes.directoryDelete,
        'ide/exec':                       ideRoutes.exec,
        'ide/reveal-in-finder':           ideRoutes.revealInFinder,
        // Powered Up...
        'powered-up/scan':                poweredUpRoutes.scan,
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

const useWebPoweredUp = function(uri) {
        return (uri.indexOf('powered-up') !== -1) && (uri in routes) && platform.forceWebVersion();
    };

exports.HttpDataProvider = class {
    getData(method, uri, params, callback) {
        if (useWebPoweredUp(uri)) {
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
            return;
        } else if (platform.isNode()) {
            let http = new Http({onLoad: callback});
            if (uri.substr(0, 1) !== '/') {
                uri = '/' + uri;
            }
            if (method === 'get') {
                http.get(uri, params);
            } else {
                http.post(uri, params);
            }
        } else {
            require('./js/frontend/ide/data/templates').files;
            if (uri in routes) {
                setTimeout(
                    function() {
                        routes[uri](params, callback);
                    },
                    1
                );
                return;
            }
            console.error('Unknown route:', uri);
        }
    }
};
