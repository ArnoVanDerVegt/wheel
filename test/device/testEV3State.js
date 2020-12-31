/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const EV3State            = require('../../js/frontend/vm/device/ev3/EV3State').EV3State;
const LayerState          = require('../../js/frontend/vm/device/ev3/LayerState').LayerState;
const dispatcher          = require('../../js/frontend/lib/dispatcher').dispatcher;
const MockEV3DataProvider = require('./MockEV3DataProvider').MockEV3DataProvider;
const assert              = require('assert');

afterEach(() => {
    dispatcher.reset();
});

describe(
    'Test EV3 state',
    () => {
        it(
            'Should create EV3State',
            () => {
                let ev3State = new EV3State({dataProvider: new MockEV3DataProvider({}), noTimeout: true});
                assert.equal(ev3State.getConnected(),                         false);
                assert.equal(ev3State.getDeviceName(),                        'EV3');
                assert.equal(ev3State.getLayerState(0) instanceof LayerState, true);
            }
        );
        it(
            'Should get initial battery',
            () => {
                let ev3State = new EV3State({dataProvider: new MockEV3DataProvider({}), noTimeout: true});
                assert.equal(ev3State.getBattery(), null);
            }
        );
        it(
            'Should connect',
            () => {
                let ev3State       = new EV3State({dataProvider: new MockEV3DataProvider({}), noTimeout: true});
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
            () => {
                let mockEV3DataProvider = new MockEV3DataProvider({applyConnecting: true});
                let ev3State            = new EV3State({dataProvider: mockEV3DataProvider, noTimeout: true});
                dispatcher.dispatch('EV3.ConnectToDevice', 'TestDevice');
                assert.equal(ev3State.getConnecting(), true);
                assert.equal(ev3State.getConnected(), false);
                // The dataProvider should return connected with the following update call...
                mockEV3DataProvider.setConnected(true);
                // The EV3.ConnectToDevice dispatcher signal sets the _connecting value, force it to false to allow the ev3State.connecting() call to be executed...
                ev3State._connecting = false;
                ev3State.connecting();
                ev3State.update();
                assert.equal(ev3State.getConnected(), true);
            }
        );
        it(
            'Should disconnect after connecting',
            () => {
                let mockEV3DataProvider = new MockEV3DataProvider({applyConnecting: true});
                let ev3State            = new EV3State({dataProvider: mockEV3DataProvider, noTimeout: true});
                dispatcher.dispatch('EV3.ConnectToDevice', 'TestDevice');
                assert.equal(ev3State.getConnecting(), true);
                assert.equal(ev3State.getConnected(), false);
                mockEV3DataProvider.setConnected(true);
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
            () => {
                let mockEV3DataProvider = new MockEV3DataProvider({applyConnecting: true});
                let ev3State            = new EV3State({dataProvider: mockEV3DataProvider, noTimeout: true});
                let called              = false;
                ev3State._connecting = false;
                ev3State._connected  = true;
                ev3State.deleteFile('test.file', () => { called = true; });
                assert.equal(mockEV3DataProvider.getDeletedFile(), 'test.file');
                assert.equal(called, true);
            }
        );
        it(
            'Should create dir',
            () => {
                let mockEV3DataProvider = new MockEV3DataProvider({applyConnecting: true});
                let ev3State            = new EV3State({dataProvider: mockEV3DataProvider, noTimeout: true});
                let called           = false;
                ev3State._connecting = false;
                ev3State._connected  = true;
                ev3State.createDir('test.dir', () => { called = true; });
                assert.equal(mockEV3DataProvider.getCreatedDir(), 'test.dir');
                assert.equal(called, true);
            }
        );
        it(
            'Should set mode',
            () => {
                let mockEV3DataProvider = new MockEV3DataProvider({applyConnecting: true});
                let ev3State            = new EV3State({dataProvider: mockEV3DataProvider, noTimeout: true});
                let called           = false;
                ev3State._connecting = false;
                ev3State._connected  = true;
                ev3State.setMode(2, 3, 4, () => { called = true; });
                let mode = mockEV3DataProvider.getMode();
                assert.equal(mode.layer, 2);
                assert.equal(mode.port,  3);
                assert.equal(mode.mode,  4);
                assert.equal(called, true);
            }
        );
        it(
            'Should upload file',
            () => {
                let mockEV3DataProvider = new MockEV3DataProvider({applyConnecting: true});
                let ev3State            = new EV3State({dataProvider: mockEV3DataProvider, noTimeout: true});
                let called           = false;
                ev3State._connecting = false;
                ev3State._connected  = true;
                ev3State.upload('remote.file', 'local.file', () => { called = true; });
                assert.equal(mockEV3DataProvider.getLocalFilename(),  'local.file');
                assert.equal(mockEV3DataProvider.getRemoteFilename(), 'remote.file');
                assert.equal(called, true);
            }
        );
        it(
            'Should stop all motors',
            () => {
                let mockEV3DataProvider = new MockEV3DataProvider({applyConnecting: true});
                let ev3State            = new EV3State({dataProvider: mockEV3DataProvider, noTimeout: true});
                ev3State._connecting = false;
                ev3State._connected  = true;
                assert.equal(mockEV3DataProvider.getStoppedAll(), false);
                ev3State.stopAllMotors(3);
                assert.equal(mockEV3DataProvider.getStoppedAll(), true);
            }
        );
        it(
            'Should download data',
            () => {
                let mockEV3DataProvider = new MockEV3DataProvider({applyConnecting: true});
                let ev3State            = new EV3State({dataProvider: mockEV3DataProvider, noTimeout: true});
                ev3State._connecting = false;
                ev3State._connected  = true;
                assert.equal(mockEV3DataProvider.getDataV(),          null);
                assert.equal(mockEV3DataProvider.getRemoteFilename(), null);
                ev3State.downloadData('<data>', 'file.data', () => {});
                assert.equal(mockEV3DataProvider.getDataV(),          '<data>');
                assert.equal(mockEV3DataProvider.getRemoteFilename(), 'file.data');
            }
        );
        it(
            'Should stop polling',
            () => {
                let mockEV3DataProvider = new MockEV3DataProvider({applyConnecting: true});
                let ev3State            = new EV3State({dataProvider: mockEV3DataProvider, noTimeout: true});
                ev3State._connecting = false;
                ev3State._connected  = true;
                assert.equal(mockEV3DataProvider.getPolling(), true);
                ev3State.stopPolling(() => {});
                assert.equal(mockEV3DataProvider.getPolling(), false);
            }
        );
        it(
            'Should resume polling',
            () => {
                let mockEV3DataProvider = new MockEV3DataProvider({applyConnecting: true});
                let ev3State            = new EV3State({dataProvider: mockEV3DataProvider, noTimeout: true});
                ev3State._connecting = false;
                ev3State._connected  = true;
                assert.equal(mockEV3DataProvider.getPolling(), true);
                ev3State.stopPolling(() => {});
                ev3State.resumePolling(() => {});
                assert.equal(mockEV3DataProvider.getPolling(), true);
            }
        );
    }
);
