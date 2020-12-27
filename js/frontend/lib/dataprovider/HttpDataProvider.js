/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
///Users/arnovandervegt/Projects/wheel/js/frontend/lib/dataprovider/HttpDataProvider.js
const Http      = require('../Http').Http;
const path      = require('../path');
const platform  = require('../platform');
const IDERoutes = require('../../../browser/routes/IDERoutes').IDERoutes;

const ideRoutes = new IDERoutes({});

let poweredUpRoutes = {};
let pathByIndex     = {};

if ((typeof document === 'object') &&
    ((document.location.href.indexOf('electron.html') === -1) && (document.location.href.indexOf('vm.html') === -1))) {
    const PoweredUp       = require('../../../shared/device/poweredup/PoweredUp').PoweredUp;
    const PoweredUpRoutes = require('../../../browser/routes/device/PoweredUpRoutes').PoweredUpRoutes;
    poweredUpRoutes = new PoweredUpRoutes({
        poweredUp: new PoweredUp({
            poweredUpConstructor: window.PoweredUP.PoweredUP,
            poweredUpConstants:   window.PoweredUP.Consts
        })
    });

}

const getPathByIndex = function(index) {
        if (index in pathByIndex) {
            return pathByIndex[index];
        }
        pathByIndex[index] = 'Wheel';
        return pathByIndex[index];
    };

let routes = {
        'ide/files':                        ideRoutes.files,
        'ide/file':                         ideRoutes.file,
        'ide/file-save':                    ideRoutes.fileSave,
        'ide/file-delete':                  ideRoutes.fileDelete,
        'ide/files-in-path':                ideRoutes.filesInPath,
        'ide/find-in-file':                 ideRoutes.findInFile,
        'ide/settings-load':                ideRoutes.settingsLoad,
        'ide/settings-save':                ideRoutes.settingsSave,
        'ide/changes':                      ideRoutes.changes,
        'ide/path-create':                  ideRoutes.pathCreate,
        'ide/path-exists':                  ideRoutes.pathExists,
        'ide/directory-create':             ideRoutes.directoryCreate,
        'ide/directory-delete':             ideRoutes.directoryDelete,
        // Powered Up...
        'powered-up/discover':              poweredUpRoutes.discover,
        'powered-up/scan':                  poweredUpRoutes.scan,
        'powered-up/device-list':           poweredUpRoutes.deviceList,
        'powered-up/connected-device-list': poweredUpRoutes.connectedDeviceList,
        'powered-up/connect':               poweredUpRoutes.connect,
        'powered-up/disconnect':            poweredUpRoutes.disconnect,
        'powered-up/connecting':            poweredUpRoutes.connecting,
        'powered-up/connected':             poweredUpRoutes.connected,
        'powered-up/update':                poweredUpRoutes.update,
        'powered-up/stop-all-motors':       poweredUpRoutes.stopAllMotors,
        'powered-up/stop-polling':          poweredUpRoutes.stopPolling,
        'powered-up/resume-polling':        poweredUpRoutes.resumePolling,
        'powered-up/set-mode':              poweredUpRoutes.setMode
    };

for (let route in routes) {
    if (typeof routes[route] === 'function') {
        switch (route.substr(0, 4)) {
            case 'ide/': routes[route] = routes[route].bind(ideRoutes);       break;
            case 'powe': routes[route] = routes[route].bind(poweredUpRoutes); break;
        }
    }
}

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
