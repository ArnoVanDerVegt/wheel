/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const PoweredUpState = require('../../js/frontend/vm/poweredup/PoweredUpState').PoweredUpState;
const LayerState     = require('../../js/frontend/vm/poweredup/LayerState').LayerState;
const dispatcher     = require('../../js/frontend/lib/dispatcher').dispatcher;
const assert         = require('assert');

afterEach(function() {
    dispatcher.reset();
});

const getMockLayers = function() {
        const getLayer = function(connected) {
                let result = {
                        uuid:      'uuid',
                        type:      'type',
                        connected: connected,
                        button:    0,
                        tilt:      {},
                        accel:     {},
                        ports:     []
                    };
                for (let i = 0; i < 4; i++) {
                    result.ports.push({
                        value:    0,
                        assigned: 0,
                        ready:    false
                    });
                }
                return result;
            };
        return {layers: [
            getLayer(false),
            getLayer(false),
            getLayer(true),
            getLayer(false)
        ]};
    };

class MockDataProvider {
    constructor(opts) {
        this._uuid         = false;
        this._updateCalled = false;
        this._layer        = null;
        this._port         = null;
        this._mode         = null;
        this._stopped      = false;
        this._layerCount   = 0;
    }

    getData(method, route, params, callback) {
        switch (method + ':' + route) {
            case 'post:powered-up/connect':
                this._uuid = params.uuid;
                callback(JSON.stringify({}));
                break;
            case 'post:powered-up/update':
                this._updateCalled = true;
                callback(JSON.stringify({state: getMockLayers()}));
                break;
            case 'post:powered-up/set-mode':
                this._layer = params.layer;
                this._port  = params.port;
                this._mode  = params.mode;
                break;
            case 'post:powered-up/stop-all-motors':
                this._layerCount = params.layerCount;
                this._stopped    = true;
                break;
        }
    }

    getUuid() {
        return this._uuid;
    }

    getUpdateCalled() {
        return this._updateCalled;
    }

    getLayer() {
        return this._layer;
    }

    getPort() {
        return this._port;
    }

    getMode() {
        return this._mode;
    }

    getStopped() {
        return this._stopped;
    }

    getLayerCount() {
        return this._layerCount;
    }
}

describe(
    'Test Powered Up state',
    function() {
        it(
            'Should create PoweredUpState',
            function() {
                let poweredUpState = new PoweredUpState({dataProvider: new MockDataProvider({})});
                assert.equal(poweredUpState.getConnected(),   false);
                assert.equal(poweredUpState.getQueueLength(), 0);
            }
        );
        it(
            'Should get LayerState',
            function() {
                let poweredUpState = new PoweredUpState({dataProvider: new MockDataProvider({})});
                assert.equal(poweredUpState.getLayerState().length, 4);
            }
        );
        it(
            'Should get LayerState, layer',
            function() {
                let poweredUpState = new PoweredUpState({dataProvider: new MockDataProvider({})});
                assert.equal(poweredUpState.getLayerState(1) instanceof LayerState, true);
            }
        );
        it(
            'Should get device name',
            function() {
                let poweredUpState = new PoweredUpState({dataProvider: new MockDataProvider({})});
                assert.equal(poweredUpState.getDeviceName(), 'PoweredUp');
            }
        );
        it(
            'Should connect to device',
            function() {
                let mockDataProvider = new MockDataProvider({});
                let poweredUpState   = new PoweredUpState({dataProvider: mockDataProvider, noTimeout: true});
                let called           = false;
                poweredUpState.addEventListener(
                    'PoweredUp.Connecting',
                    this,
                    function() {
                        called = true;
                    }
                );
                assert.equal(mockDataProvider.getUuid(), false);
                poweredUpState.onConnectToDevice({uuid: 'xyz'});
                assert.equal(mockDataProvider.getUuid(), 'xyz');
                assert.equal(called, true);
                assert.equal(poweredUpState.getConnectionCount(), 1);
            }
        );
        it(
            'Should connect to device and update',
            function() {
                let mockDataProvider = new MockDataProvider({});
                let poweredUpState   = new PoweredUpState({dataProvider: mockDataProvider, noTimeout: true});
                poweredUpState.addEventListener('PoweredUp.Connecting', this, function() {});
                assert.equal(mockDataProvider.getUpdateCalled(), false);
                poweredUpState.onConnectToDevice({uuid: 'xyz'});
                assert.equal(mockDataProvider.getUpdateCalled(), true);
            }
        );
        it(
            'Should connect to device and emit connected',
            function() {
                let mockDataProvider = new MockDataProvider({});
                let poweredUpState   = new PoweredUpState({dataProvider: mockDataProvider, noTimeout: true});
                let called           = false;
                poweredUpState.addEventListener(
                    'PoweredUp.Connected',
                    this,
                    function(index) {
                        called = index;
                    }
                );
                poweredUpState.onConnectToDevice({uuid: 'xyz'});
                assert.equal(called, 2);
            }
        );
        it(
            'Should set mode',
            function() {
                let mockDataProvider = new MockDataProvider({});
                let poweredUpState   = new PoweredUpState({dataProvider: mockDataProvider, noTimeout: true});
                poweredUpState._connecting = false; // Force correct state...
                poweredUpState._connected  = true;  // Force correct state...
                poweredUpState.setMode(112, 113, 114, function() {});
                assert.equal(mockDataProvider.getLayer(), 112);
                assert.equal(mockDataProvider.getPort(),  113);
                assert.equal(mockDataProvider.getMode(),  114);
            }
        );
        it(
            'Should stop all motors',
            function() {
                let mockDataProvider = new MockDataProvider({});
                let poweredUpState   = new PoweredUpState({dataProvider: mockDataProvider, noTimeout: true});
                poweredUpState._connecting = false; // Force correct state...
                poweredUpState._connected  = true;  // Force correct state...
                assert.equal(mockDataProvider.getStopped(),    false);
                assert.equal(mockDataProvider.getLayerCount(), 0);
                poweredUpState.stopAllMotors(3);
                assert.equal(mockDataProvider.getStopped(),    true);
                assert.equal(mockDataProvider.getLayerCount(), 3);
            }
        );
        it(
            'Should add command to queue',
            function() {
                let mockDataProvider = new MockDataProvider({});
                let poweredUpState   = new PoweredUpState({dataProvider: mockDataProvider, noTimeout: true});
                poweredUpState._connecting = false; // Force correct state...
                poweredUpState._connected  = true;  // Force correct state...
                poweredUpState.module(13, 14, {layer: 1, id: 2, hello: 'World'});
                assert.deepEqual(poweredUpState._queue, [{module: 13, command: 14, data: {layer: 1, id: 2, hello: 'World'}}]);
            }
        );
        it(
            'Should add duplicate command to queue',
            function() {
                let mockDataProvider = new MockDataProvider({});
                let poweredUpState   = new PoweredUpState({dataProvider: mockDataProvider, noTimeout: true});
                poweredUpState._connecting = false; // Force correct state...
                poweredUpState._connected  = true;  // Force correct state...
                poweredUpState.module(13, 14, {layer: 1, id: 2, hello: 'Hello'});
                poweredUpState.module(13, 14, {layer: 1, id: 2, hello: 'World'});
                assert.deepEqual(poweredUpState._queue, [{module: 13, command: 14, data: {layer: 1, id: 2, hello: 'World'}}]);
            }
        );
        it(
            'Should create response handler',
            function() {
                let mockDataProvider = new MockDataProvider({});
                let poweredUpState   = new PoweredUpState({dataProvider: mockDataProvider, noTimeout: true});
                let called           = false;
                let responseHandler  = poweredUpState._createResponseHandler(function(data) { called = data; });
                assert.equal(typeof responseHandler === 'function', true);
                responseHandler('456');
                assert.strictEqual(called, 456);
                responseHandler('!456');
                assert.deepEqual(called, {error: true, message: 'Invalid data.'});
            }
        );
    }
);
