/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const PoweredUpState = require('../../js/frontend/vm/poweredup/PoweredUpState').PoweredUpState;
const dispatcher     = require('../../js/frontend/lib/dispatcher').dispatcher;
const assert         = require('assert');

afterEach(function() {
    dispatcher.reset();
});

const getMockLayers = function() {
        const getLayer = function() {
                let result = {
                        uuid:      'uuid',
                        type:      'type',
                        connected: false,
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
        return {layers: [getLayer(), getLayer(), getLayer(), getLayer()]};
    };

class MockDataProvider {
    constructor(opts) {
        this._uuid         = false;
        this._updateCalled = false;
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
        }
    }

    getUuid() {
        return this._uuid;
    }

    getUpdateCalled() {
        return this._updateCalled;
    }
}

describe(
    'Test Powered Up state',
    function() {
        it(
            'Should create PoweredUpState',
            function() {
                let poweredUpState = new PoweredUpState({dataProvider: new MockDataProvider({})});
                assert.equal(poweredUpState.getConnected(), false);
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
            }
        );
        it(
            'Should connect to device and update',
            function() {
                let mockDataProvider = new MockDataProvider({});
                let poweredUpState   = new PoweredUpState({dataProvider: mockDataProvider, noTimeout: true});
                let called           = false;
                poweredUpState.addEventListener('PoweredUp.Connecting', this, function() {});
                assert.equal(mockDataProvider.getUpdateCalled(), false);
                poweredUpState.onConnectToDevice({uuid: 'xyz'});
                assert.equal(mockDataProvider.getUpdateCalled(), true);
            }
        );
    }
);
