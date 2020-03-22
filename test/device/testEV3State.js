/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const EV3State   = require('../../js/frontend/vm/ev3/EV3State').EV3State;
const dispatcher = require('../../js/frontend/lib/dispatcher').dispatcher;
const assert     = require('assert');

afterEach(function() {
    dispatcher.reset();
});

const getMockLayers = function() {
        return [
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}]
        ];
    };

class MockDataProvider {
    constructor(opts) {
        this._applyConnecting = opts.applyConnecting;
        this._connected       = false;
        this._deletedFile     = null;
        this._createdDir      = null;
        this._mode            = null;
        this._localFilename   = null;
        this._remoteFilename  = null;
        this._layerCount      = null;
    }

    setConnected(connected) {
        this._connected = connected;
    }

    getDeletedFile() {
        return this._deletedFile;
    }

    getCreatedDir() {
        return this._createdDir;
    }

    getMode() {
        return this._mode;
    }

    getLocalFilename() {
        return this._localFilename;
    }

    getRemoteFilename() {
        return this._remoteFilename;
    }

    getLayerCount() {
        return this._layerCount;
    }

    getData(method, route, params, callback) {
        switch (method + ':' + route) {
            case 'post:ev3/connect':
                callback(JSON.stringify({
                    deviceName: params.deviceName,
                    connecting: true
                }));
                break;
            case 'post:ev3/connecting':
                if (!this._applyConnecting) {
                    return;
                }
                callback(JSON.stringify({
                    connected: this._connected,
                    state: {
                        layers: getMockLayers()
                    }
                }));
                break;
            case 'post:ev3/update':
                callback(JSON.stringify({
                    connected: this._connected,
                    state: {
                        layers: getMockLayers()
                    }
                }));
                break;
            case 'post:ev3/disconnect':
                callback(JSON.stringify({}));
                break;
            case 'post:ev3/delete-file':
                this._deletedFile = params.path;
                callback(JSON.stringify({}));
                break;
            case 'post:ev3/create-dir':
                this._createdDir = params.path;
                callback(JSON.stringify({}));
                break;
            case 'post:ev3/set-mode':
                this._mode = params;
                callback(JSON.stringify({}));
                break;
            case 'post:ev3/upload':
                this._localFilename  = params.localFilename;
                this._remoteFilename = params.remoteFilename;
                callback(JSON.stringify({}));
                break;
            case 'post:ev3/stop-all-motors':
                this._layerCount = params.layerCount;
                break;
        }
    }
}

describe(
    'Test EV3 state',
    function() {
        it(
            'Should create EV3State',
            function() {
                let ev3State = new EV3State({dataProvider: new MockDataProvider({}), noTimeout: true});
                assert.equal(ev3State.getConnected(), false);
            }
        );
        it(
            'Should get initial battery',
            function() {
                let ev3State = new EV3State({dataProvider: new MockDataProvider({}), noTimeout: true});
                assert.equal(ev3State.getBattery(), null);
            }
        );
        it(
            'Should connect',
            function() {
                let ev3State       = new EV3State({dataProvider: new MockDataProvider({}), noTimeout: true});
                let testDeviceName = null;
                ev3State.on(
                    'EV3.Connecting',
                    this,
                    function(deviceName) {
                        testDeviceName = deviceName;
                    }
                );
                dispatcher.dispatch('EV3.ConnectToDevice', 'TestDevice');
                assert.equal(testDeviceName, 'TestDevice');
                assert.equal(ev3State.getConnecting(), true);
            }
        );
        it(
            'Should poll connecting',
            function() {
                let mockDataProvider = new MockDataProvider({applyConnecting: true});
                let ev3State         = new EV3State({dataProvider: mockDataProvider, noTimeout: true});
                dispatcher.dispatch('EV3.ConnectToDevice', 'TestDevice');
                assert.equal(ev3State.getConnecting(), true);
                assert.equal(ev3State.getConnected(), false);
                // The dataProvider should return connected with the following update call...
                mockDataProvider.setConnected(true);
                // The EV3.ConnectToDevice dispatcher signal sets the _connecting value, force it to false
                // to allow the ev3State.connecting() call to be executed...
                ev3State._connecting = false;
                ev3State.connecting();
                ev3State.update();
                assert.equal(ev3State.getConnected(), true);
            }
        );
        it(
            'Should disconnect after connecting',
            function() {
                let mockDataProvider = new MockDataProvider({applyConnecting: true});
                let ev3State         = new EV3State({dataProvider: mockDataProvider, noTimeout: true});
                dispatcher.dispatch('EV3.ConnectToDevice', 'TestDevice');
                assert.equal(ev3State.getConnecting(), true);
                assert.equal(ev3State.getConnected(), false);
                mockDataProvider.setConnected(true);
                ev3State._connecting = false;
                ev3State.connecting();
                ev3State.update();
                assert.equal(ev3State.getConnected(), true);
                ev3State.disconnect();
                assert.equal(ev3State.getConnected(), false);
            }
        );
        it(
            'Should delete file',
            function() {
                let mockDataProvider = new MockDataProvider({applyConnecting: true});
                let ev3State         = new EV3State({dataProvider: mockDataProvider, noTimeout: true});
                let called           = false;
                ev3State._connecting = false;
                ev3State._connected  = true;
                ev3State.deleteFile('test.file', function() { called = true; });
                assert.equal(mockDataProvider.getDeletedFile(), 'test.file');
                assert.equal(called, true);
            }
        );
        it(
            'Should create dir',
            function() {
                let mockDataProvider = new MockDataProvider({applyConnecting: true});
                let ev3State         = new EV3State({dataProvider: mockDataProvider, noTimeout: true});
                let called           = false;
                ev3State._connecting = false;
                ev3State._connected  = true;
                ev3State.createDir('test.dir', function() { called = true; });
                assert.equal(mockDataProvider.getCreatedDir(), 'test.dir');
                assert.equal(called, true);
            }
        );
        it(
            'Should set mode',
            function() {
                let mockDataProvider = new MockDataProvider({applyConnecting: true});
                let ev3State         = new EV3State({dataProvider: mockDataProvider, noTimeout: true});
                let called           = false;
                ev3State._connecting = false;
                ev3State._connected  = true;
                ev3State.setMode(2, 3, 4, function() { called = true; });
                let mode = mockDataProvider.getMode();
                assert.equal(mode.layer, 2);
                assert.equal(mode.port,  3);
                assert.equal(mode.mode,  4);
                assert.equal(called, true);
            }
        );
        it(
            'Should upload file',
            function() {
                let mockDataProvider = new MockDataProvider({applyConnecting: true});
                let ev3State         = new EV3State({dataProvider: mockDataProvider, noTimeout: true});
                let called           = false;
                ev3State._connecting = false;
                ev3State._connected  = true;
                ev3State.upload('remote.file', 'local.file', function() { called = true; });
                assert.equal(mockDataProvider.getLocalFilename(),  'local.file');
                assert.equal(mockDataProvider.getRemoteFilename(), 'remote.file');
                assert.equal(called, true);
            }
        );
        it(
            'Should stop all motors',
            function() {
                let mockDataProvider = new MockDataProvider({applyConnecting: true});
                let ev3State         = new EV3State({dataProvider: mockDataProvider, noTimeout: true});
                ev3State._connecting = false;
                ev3State._connected  = true;
                assert.equal(mockDataProvider.getLayerCount(), null);
                ev3State.stopAllMotors(3);
                assert.equal(mockDataProvider.getLayerCount(), 3);
            }
        );
    }
);
