/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const IDERoutes       = require('../../../backend/routes/IDERoutes').IDERoutes;
const NXTRoutes       = require('../../../backend/routes/device/NXTRoutes').NXTRoutes;
const EV3Routes       = require('../../../backend/routes/device/EV3Routes').EV3Routes;
const PoweredUpRoutes = require('../../../backend/routes/device/PoweredUpRoutes').PoweredUpRoutes;
const SpikeRoutes     = require('../../../backend/routes/device/SpikeRoutes').SpikeRoutes;
const NXT             = require('../../../shared/device/nxt/NXT').NXT;
const EV3             = require('../../../shared/device/ev3/EV3').EV3;
const PoweredUp       = require('../../../shared/device/poweredup/PoweredUp').PoweredUp;
const Spike           = require('../../../shared/device/spike/Spike').Spike;
const serialport      = require('serialport');

class SerialPort {
    getPorts(callback) {
        serialport.list().then(callback);
    }

    getPort(deviceName, opts) {
        return new serialport(deviceName, opts);
    }
}

const ideRoutes       = new IDERoutes({});
const nxtRoutes       = new NXTRoutes({
        nxt:                   new NXT({serialPortConstructor: SerialPort}),
        serialPortConstructor: SerialPort
    });
const ev3Routes       = new EV3Routes({
        ev3:                   new EV3({serialPortConstructor: SerialPort}),
        serialPortConstructor: SerialPort
    });
const spikeRoutes     = new SpikeRoutes({
        spike:                 new Spike({serialPortConstructor: SerialPort}),
        serialPortConstructor: SerialPort
    });
const poweredUpRoutes = new PoweredUpRoutes({
        poweredUp: new PoweredUp({
            poweredUpConstructor: require('node-poweredup').PoweredUP,
            poweredUpConstants:   require('node-poweredup').Consts
        })
    });

const routes = {
        // IDE...
        'ide/file':                         ideRoutes.file,
        'ide/file-save':                    ideRoutes.fileSave,
        'ide/file-save-base64-as-binary':   ideRoutes.fileSaveBase64AsBinary,
        'ide/file-append':                  ideRoutes.fileAppend,
        'ide/file-delete':                  ideRoutes.fileDelete,
        'ide/file-size':                    ideRoutes.fileSize,
        'ide/files':                        ideRoutes.files,
        'ide/files-in-path':                ideRoutes.filesInPath,
        'ide/find-in-file':                 ideRoutes.findInFile,
        'ide/directory-create':             ideRoutes.directoryCreate,
        'ide/directory-delete':             ideRoutes.directoryDelete,
        'ide/path-create':                  ideRoutes.pathCreate,
        'ide/path-exists':                  ideRoutes.pathExists,
        'ide/rename':                       ideRoutes.rename,
        'ide/settings-load':                ideRoutes.settingsLoad,
        'ide/settings-save':                ideRoutes.settingsSave,
        'ide/changes':                      ideRoutes.changes,
        'ide/user-info':                    ideRoutes.userInfo,
        'ide/exec':                         ideRoutes.exec,
        'ide/reveal-in-finder':             ideRoutes.revealInFinder,
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
        'powered-up/device-list':           poweredUpRoutes.deviceList,
        'powered-up/connected-device-list': poweredUpRoutes.connectedDeviceList,
        'powered-up/connect':               poweredUpRoutes.connect,
        'powered-up/disconnect':            poweredUpRoutes.disconnect,
        'powered-up/disconnect-all':        poweredUpRoutes.disconnectAll,
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
    switch (route.substr(0, 3)) {
        case 'ide': routes[route] = routes[route].bind(ideRoutes);       break;
        case 'nxt': routes[route] = routes[route].bind(nxtRoutes);       break;
        case 'ev3': routes[route] = routes[route].bind(ev3Routes);       break;
        case 'pow': routes[route] = routes[route].bind(poweredUpRoutes); break;
        case 'spi': routes[route] = routes[route].bind(spikeRoutes);     break;
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
