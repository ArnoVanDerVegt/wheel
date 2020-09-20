/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher               = require('../../../js/frontend/lib/dispatcher').dispatcher;
const DeviceListState          = require('../../../js/frontend/ide/dialogs/file/state/DeviceListState').DeviceListState;
const poweredUpModuleConstants = require('../../../js/shared/vm/modules/poweredUpModuleConstants');
const assert                   = require('assert');

afterEach(() => {
    dispatcher.reset();
});

describe(
    'Test powered up device list state',
    () => {
        it(
            'Should create DeviceListState',
            () => {
                let deviceListState = new DeviceListState({});
                assert.equal(deviceListState.getActiveIndex(), 0);
                assert.equal(deviceListState.getList().length, 0);
            }
        );
        it(
            'Should add device',
            () => {
                let deviceListState = new DeviceListState({});
                let added           = false;
                let setIndex        = false;
                deviceListState.on('AddDevice',      this, () => { added    = true; });
                deviceListState.on('SetActiveIndex', this, () => { setIndex = true; });
                dispatcher.dispatch('Dialog.File.PoweredUpProject.AddDevice', 0);
                assert.equal(added,    true);
                assert.equal(setIndex, true);
            }
        );
        it(
            'Should add device and get device type',
            () => {
                let deviceListState = new DeviceListState({});
                let device;
                deviceListState.on('AddDevice', this, (d) => { device = d; });
                dispatcher.dispatch('Dialog.File.PoweredUpProject.AddDevice', poweredUpModuleConstants.POWERED_UP_DEVICE_HUB);
                assert.equal(device.getType(), poweredUpModuleConstants.POWERED_UP_DEVICE_HUB);
            }
        );
        it(
            'Should add device and update active index',
            () => {
                let deviceListState = new DeviceListState({});
                dispatcher.dispatch('Dialog.File.PoweredUpProject.AddDevice', poweredUpModuleConstants.POWERED_UP_DEVICE_HUB);
                assert.equal(deviceListState.getActiveIndex(), 0);
                dispatcher.dispatch('Dialog.File.PoweredUpProject.AddDevice', poweredUpModuleConstants.POWERED_UP_DEVICE_HUB);
                assert.equal(deviceListState.getActiveIndex(), 1);
            }
        );
        it(
            'Should update device and emit port info',
            () => {
                let deviceListState = new DeviceListState({});
                let portInfo        = [];
                deviceListState.on('ChangePort', this, (p) => { portInfo.push(p); });
                dispatcher.dispatch('Dialog.File.PoweredUpProject.AddDevice',    poweredUpModuleConstants.POWERED_UP_DEVICE_HUB);
                dispatcher.dispatch('Dialog.File.PoweredUpProject.UpdateDevice', poweredUpModuleConstants.POWERED_UP_DEVICE_TECHNIC_HUB);
                assert.deepEqual(
                    portInfo,
                    [
                        {index: 0, port: 'A', portInfo: {enabled: true, available: true, type: 0}},
                        {index: 0, port: 'B', portInfo: {enabled: true, available: true, type: 0}},
                        {index: 0, port: 'C', portInfo: {enabled: true, available: true, type: 0}},
                        {index: 0, port: 'D', portInfo: {enabled: true, available: true, type: 0}}
                    ]
                );
            }
        );
        it(
            'Should update device and get device type',
            () => {
                let deviceListState = new DeviceListState({});
                let device;
                deviceListState.on('UpdateDevice', this, (d) => { device = d; });
                dispatcher.dispatch('Dialog.File.PoweredUpProject.AddDevice',    poweredUpModuleConstants.POWERED_UP_DEVICE_HUB);
                dispatcher.dispatch('Dialog.File.PoweredUpProject.UpdateDevice', poweredUpModuleConstants.POWERED_UP_DEVICE_TECHNIC_HUB);
                assert.equal(device.getType(), poweredUpModuleConstants.POWERED_UP_DEVICE_TECHNIC_HUB);
            }
        );
        it(
            'Should set active index',
            () => {
                let deviceListState = new DeviceListState({});
                dispatcher.dispatch('Dialog.File.PoweredUpProject.AddDevice', poweredUpModuleConstants.POWERED_UP_DEVICE_HUB);
                dispatcher.dispatch('Dialog.File.PoweredUpProject.AddDevice', poweredUpModuleConstants.POWERED_UP_DEVICE_HUB);
                dispatcher.dispatch('Dialog.File.PoweredUpProject.AddDevice', poweredUpModuleConstants.POWERED_UP_DEVICE_HUB);
                assert.equal(deviceListState.getActiveIndex(), 2);
                dispatcher.dispatch('Dialog.File.PoweredUpProject.SetActiveIndex', 1);
                assert.equal(deviceListState.getActiveIndex(), 1);
            }
        );
        it(
            'Should update port type',
            () => {
                let deviceListState = new DeviceListState({});
                let portInfo;
                deviceListState.on('ChangePort', this, (p) => { portInfo = p; });
                dispatcher.dispatch('Dialog.File.PoweredUpProject.AddDevice',   poweredUpModuleConstants.POWERED_UP_DEVICE_HUB);
                dispatcher.dispatch('Dialog.File.PoweredUpProject.SetPortType', 'B', 5);
                assert.deepEqual(portInfo, {index: 0, port: 'B', portInfo: {enabled: true, available: true, type: 5}});
            }
        );
        it(
            'Should add remove device and update active index',
            () => {
                let deviceListState = new DeviceListState({});
                dispatcher.dispatch('Dialog.File.PoweredUpProject.AddDevice', poweredUpModuleConstants.POWERED_UP_DEVICE_HUB);
                assert.equal(deviceListState.getActiveIndex(), 0);
                dispatcher.dispatch('Dialog.File.PoweredUpProject.AddDevice', poweredUpModuleConstants.POWERED_UP_DEVICE_HUB);
                assert.equal(deviceListState.getActiveIndex(), 1);
                dispatcher.dispatch('Dialog.File.PoweredUpProject.RemoveDevice', 1);
                assert.equal(deviceListState.getActiveIndex(), 0);
                assert.equal(deviceListState.getList().length, 1);
            }
        );
        it(
            'Should reset',
            () => {
                let deviceListState = new DeviceListState({});
                dispatcher.dispatch('Dialog.File.PoweredUpProject.AddDevice', poweredUpModuleConstants.POWERED_UP_DEVICE_HUB);
                dispatcher.dispatch('Dialog.File.PoweredUpProject.AddDevice', poweredUpModuleConstants.POWERED_UP_DEVICE_HUB);
                dispatcher.dispatch('Dialog.File.PoweredUpProject.AddDevice', poweredUpModuleConstants.POWERED_UP_DEVICE_HUB);
                assert.equal(deviceListState.getActiveIndex(), 2);
                dispatcher.dispatch('Dialog.File.PoweredUpProject.Reset');
                assert.equal(deviceListState.getActiveIndex(), 0);
                assert.equal(deviceListState.getList().length, 0);
            }
        );
    }
);
