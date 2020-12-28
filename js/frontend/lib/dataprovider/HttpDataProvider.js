/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const platform  = require('../../../shared/lib/platform');
const IDERoutes = require('../../../browser/routes/IDERoutes').IDERoutes;
const Http      = require('../Http').Http;
const path      = require('../path');

const ideRoutes = new IDERoutes({});

let nxtRoutes       = {};
let ev3Routes       = {};
let poweredUpRoutes = {};
let spikeRoutes     = {};
let pathByIndex     = {};

// Check if it's the web version...
if ((typeof document === 'object') &&
    ((document.location.href.indexOf('electron.html') === -1) && (document.location.href.indexOf('vm.html') === -1))) {
    const WebSerial       = require('../WebSerial').WebSerial;
    const NXT             = require('../../../shared/device/nxt/NXT').NXT;
    const EV3             = require('../../../shared/device/ev3/EV3').EV3;
    const PoweredUp       = require('../../../shared/device/poweredup/PoweredUp').PoweredUp;
    const Spike           = require('../../../shared/device/spike/Spike').Spike;
    const NXTRoutes       = require('../../../browser/routes/device/NXTRoutes').NXTRoutes;
    const EV3Routes       = require('../../../browser/routes/device/EV3Routes').EV3Routes;
    const PoweredUpRoutes = require('../../../browser/routes/device/PoweredUpRoutes').PoweredUpRoutes;
    const SpikeRoutes     = require('../../../browser/routes/device/SpikeRoutes').SpikeRoutes;
    nxtRoutes = new NXTRoutes({
        nxt:                   new NXT({serialPortConstructor: WebSerial}),
        serialPortConstructor: WebSerial
    });
    ev3Routes = new EV3Routes({
        ev3:                   new EV3({serialPortConstructor: WebSerial}),
        serialPortConstructor: WebSerial
    });
    poweredUpRoutes = new PoweredUpRoutes({
        poweredUp: new PoweredUp({
            poweredUpConstructor: window.PoweredUP.PoweredUP,
            poweredUpConstants:   window.PoweredUP.Consts
        })
    });
    spikeRoutes = new SpikeRoutes({
        spike:                 new Spike({serialPortConstructor: WebSerial}),
        serialPortConstructor: WebSerial
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
        // NXT...
        'nxt/device-list':                  nxtRoutes.deviceList,
        'nxt/connect':                      nxtRoutes.connect,
        'nxt/disconnect':                   nxtRoutes.disconnect,
        'nxt/connecting':                   nxtRoutes.connecting,
        'nxt/connected':                    nxtRoutes.connected,
        'nxt/update':                       nxtRoutes.update,
        'nxt/stop-all-motors':              nxtRoutes.stopAllMotors,
        'nxt/stop-polling':                 nxtRoutes.stopPolling,
        'nxt/resume-polling':               nxtRoutes.resumePolling,
        'nxt/set-mode':                     nxtRoutes.setMode,
        // EV3...
        'ev3/device-list':                  ev3Routes.deviceList,
        'ev3/connect':                      ev3Routes.connect,
        'ev3/disconnect':                   ev3Routes.disconnect,
        'ev3/connecting':                   ev3Routes.connecting,
        'ev3/connected':                    ev3Routes.connected,
        'ev3/update':                       ev3Routes.update,
        'ev3/download-data':                ev3Routes.downloadData,
        'ev3/download':                     ev3Routes.download,
        'ev3/create-dir':                   ev3Routes.createDir,
        'ev3/delete-file':                  ev3Routes.deleteFile,
        'ev3/files':                        ev3Routes.files,
        'ev3/stop-all-motors':              ev3Routes.stopAllMotors,
        'ev3/stop-polling':                 ev3Routes.stopPolling,
        'ev3/resume-polling':               ev3Routes.resumePolling,
        'ev3/set-mode':                     ev3Routes.setMode,
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
        'powered-up/set-mode':              poweredUpRoutes.setMode,
        // Spike...
        'spike/device-list':                spikeRoutes.deviceList,
        'spike/connect':                    spikeRoutes.connect,
        'spike/disconnect':                 spikeRoutes.disconnect,
        'spike/connecting':                 spikeRoutes.connecting,
        'spike/connected':                  spikeRoutes.connected,
        'spike/update':                     spikeRoutes.update,
        'spike/stop-all-motors':            spikeRoutes.stopAllMotors,
        'spike/stop-polling':               spikeRoutes.stopPolling,
        'spike/resume-polling':             spikeRoutes.resumePolling,
        'spike/set-mode':                   spikeRoutes.setMode
    };

for (let route in routes) {
    if (typeof routes[route] === 'function') {
        switch (route.substr(0, 3)) {
            case 'ide': routes[route] = routes[route].bind(ideRoutes);       break;
            case 'nxt': routes[route] = routes[route].bind(nxtRoutes);       break;
            case 'ev3': routes[route] = routes[route].bind(ev3Routes);       break;
            case 'pow': routes[route] = routes[route].bind(poweredUpRoutes); break;
            case 'spi': routes[route] = routes[route].bind(spikeRoutes);     break;
        }
    }
}

const useWebNXT = function(uri) {
        return (uri.indexOf('nxt/') === 0) && (uri in routes) && platform.forceWebVersion();
    };

const useWebEV3 = function(uri) {
        return (uri.indexOf('ev3/') === 0) && (uri in routes) && platform.forceWebVersion();
    };

const useWebPoweredUp = function(uri) {
        return (uri.indexOf('powered-up/') === 0) && (uri in routes) && platform.forceWebVersion();
    };

const useWebSpike = function(uri) {
        return (uri.indexOf('spike/') === 0) && (uri in routes) && platform.forceWebVersion();
    };

exports.HttpDataProvider = class {
    getData(method, uri, params, callback) {
        if (useWebNXT(uri) || useWebEV3(uri) || useWebPoweredUp(uri) || useWebSpike(uri)) {
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
