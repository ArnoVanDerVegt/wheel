/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher                = require('../../../js/frontend/lib/dispatcher').dispatcher;
const PoweredUpAutoConnectState = require('../../../js/frontend/ide/settings/PoweredUpAutoConnectState').PoweredUpAutoConnectState;
const MockSettings              = require('../../mock/MockSettings').MockSettings;
const assert                    = require('assert');

afterEach(() => {
    dispatcher.reset();
});

describe(
    'Test powered up auto connect',
    () => {
        it(
            'Should create settings',
            () => {
                let poweredUpAutoConnectState = new PoweredUpAutoConnectState({settings: new MockSettings()});
                assert.deepEqual(poweredUpAutoConnectState.toJSON(), []);
            }
        );
        it(
            'Should load settings',
            () => {
                let poweredUpAutoConnectState = new PoweredUpAutoConnectState({settings: new MockSettings()});
                poweredUpAutoConnectState.load([
                    {index: 1, uuid: 'abc'},
                    {index: 2, uuid: 'def'}
                ]);
                assert.deepEqual(
                    poweredUpAutoConnectState.toJSON(),
                    [
                        {index: 1, uuid: 'abc'},
                        {index: 2, uuid: 'def'}
                    ]
                );
            }
        );
        it(
            'Should get by uuid',
            () => {
                let poweredUpAutoConnectState = new PoweredUpAutoConnectState({settings: new MockSettings()});
                poweredUpAutoConnectState.load([
                    {index: 1, uuid: 'abc'},
                    {index: 2, uuid: 'def'}
                ]);
                assert.deepEqual(
                    poweredUpAutoConnectState.getAutoConnectByUuid(),
                    {
                        abc: {index: 1, uuid: 'abc'},
                        def: {index: 2, uuid: 'def'}
                    }
                );
            }
        );
        it(
            'Should get by uuid and index',
            () => {
                let poweredUpAutoConnectState = new PoweredUpAutoConnectState({settings: new MockSettings()});
                poweredUpAutoConnectState.load([
                    {index: 1, uuid: 'abc'},
                    {index: 2, uuid: 'def'}
                ]);
                assert.equal(poweredUpAutoConnectState.getAutoConnect(1, 'abc'), true);
                assert.equal(poweredUpAutoConnectState.getAutoConnect(2, 'def'), true);
                assert.equal(poweredUpAutoConnectState.getAutoConnect(1, 'def'), false);
                assert.equal(poweredUpAutoConnectState.getAutoConnect(2, 'abc'), false);
                assert.equal(poweredUpAutoConnectState.getAutoConnect(2, 'xxx'), false);
            }
        );
        it(
            'Should set',
            () => {
                let mockSettings              = new MockSettings();
                let poweredUpAutoConnectState = new PoweredUpAutoConnectState({settings: mockSettings});
                poweredUpAutoConnectState.load([
                    {index: 1, uuid: 'abc'},
                    {index: 2, uuid: 'def'}
                ]);
                dispatcher.dispatch('Settings.PoweredUpAutoLoad.Set', {index: 3, uuid: 'xyz'});
                assert.equal(poweredUpAutoConnectState.getAutoConnect(3, 'xyz'), true);
                assert.equal(mockSettings.getSaved(),                            true);
            }
        );
        it(
            'Should set existing',
            () => {
                let mockSettings              = new MockSettings();
                let poweredUpAutoConnectState = new PoweredUpAutoConnectState({settings: mockSettings});
                poweredUpAutoConnectState.load([
                    {index: 1, uuid: 'abc'},
                    {index: 2, uuid: 'def'}
                ]);
                dispatcher.dispatch('Settings.PoweredUpAutoLoad.Set', {index: 3, uuid: 'def'});
                assert.deepEqual(
                    poweredUpAutoConnectState.getAutoConnectByUuid(),
                    {
                        abc: {index: 1, uuid: 'abc'},
                        def: {index: 3, uuid: 'def'}
                    }
                );
                assert.equal(mockSettings.getSaved(), true);
            }
        );
        it(
            'Should remove',
            () => {
                let mockSettings              = new MockSettings();
                let poweredUpAutoConnectState = new PoweredUpAutoConnectState({settings: mockSettings});
                poweredUpAutoConnectState.load([
                    {index: 1, uuid: 'abc'},
                    {index: 2, uuid: 'def'}
                ]);
                dispatcher.dispatch('Settings.PoweredUpAutoLoad.Remove', {uuid: 'abc'});
                assert.deepEqual(
                    poweredUpAutoConnectState.getAutoConnectByUuid(),
                    {
                        def: {index: 2, uuid: 'def'}
                    }
                );
                assert.equal(mockSettings.getSaved(), true);
            }
        );
    }
);
