/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const nxtModuleConstants       = require('../../../shared/vm/modules/nxtModuleConstants');
const poweredUpModuleConstants = require('../../../shared/vm/modules/poweredUpModuleConstants');
const spikeModuleConstants     = require('../../../shared/vm/modules/spikeModuleConstants');
const platform                 = require('../../../shared/lib/platform');
const dispatcher               = require('../../lib/dispatcher').dispatcher;

exports.selectNXTDeviceCount = (settings, nxt) => {
    const applyDeviceCount = (deviceCount) => {
            nxt.setActiveLayerCount(deviceCount);
            dispatcher
                .dispatch('NXT.ActiveLayerCount', deviceCount)
                .dispatch('Settings.Set.NXTDeviceCount', deviceCount)
                .dispatch('Button.Device.NXT');
        };
    const selectDeviceCount = () => {
            dispatcher.dispatch(
                'Dialog.DeviceCount.Show',
                {
                    deviceCount: settings.getNXTDeviceCount(),
                    layerCount:  nxtModuleConstants.NXT_LAYER_COUNT,
                    title:       'Number of NXT devices',
                    onApply:     applyDeviceCount
                }
            );
        };
    const disconnectAndSelectDeviceCount = () => {
            nxt.disconnect();
            selectDeviceCount();
        };
    if (nxt.getConnected()) {
        dispatcher.dispatch(
            'Dialog.Confirm.Show',
            {
                title:         'NXT is connected',
                lines:         ['To change the NXT daisy chain mode you must disconnect first', 'Do you want to continue?'],
                applyCallback: disconnectAndSelectDeviceCount
            }
        );
    } else {
        selectDeviceCount();
    }
};

exports.selectEV3DaisyChainMode = (settings, ev3) => {
    const applyDeviceCount = (daisyChainMode) => {
            ev3.setActiveLayerCount(deviceCount);
            dispatcher
                .dispatch('EV3.ActiveLayerCount', daisyChainMode)
                .dispatch('Settings.Set.DaisyChainMode', daisyChainMode)
                .dispatch('Button.Device.EV3');
        };
    const selectDeviceCount = () => {
            dispatcher.dispatch(
                'Dialog.DaisyChain.Show',
                {
                    daisyChainMode: settings.getDaisyChainMode(),
                    applyCallback:  applyDeviceCount
                }
            );
        };
    const disconnectAndSelectDeviceCount = () => {
            ev3.disconnect();
            selectDeviceCount();
        };
    if (ev3.getConnected()) {
        dispatcher.dispatch(
            'Dialog.Confirm.Show',
            {
                title:         'EV3 is connected',
                lines:         ['To change the EV3 daisy chain mode you must disconnect first', 'Do you want to continue?'],
                applyCallback: disconnectAndSelectDeviceCount
            }
        );
    } else {
        selectDeviceCount();
    }
};

exports.selectPoweredUpDeviceCount = (settings, poweredUp) => {
    const applyDeviceCount = (deviceCount) => {
            poweredUp.setActiveLayerCount(deviceCount);
            dispatcher
                .dispatch('PoweredUp.DeviceCount',             deviceCount)
                .dispatch('Settings.Set.PoweredUpDeviceCount', deviceCount)
                .dispatch('Button.Device.PoweredUp');
        };
    const selectDeviceCount = () => {
            dispatcher.dispatch(
                'Dialog.DeviceCount.Show',
                {
                    deviceCount: settings.getPoweredUpDeviceCount(),
                    layerCount:  poweredUpModuleConstants.POWERED_UP_LAYER_COUNT,
                    title:       'Number of Powered Up devices',
                    onApply:     applyDeviceCount
                }
            );
        };
    const disconnectAndSelectDeviceCount = () => {
            poweredUp.disconnect();
            selectDeviceCount();
        };
    if (poweredUp.getConnected()) {
        dispatcher.dispatch(
            'Dialog.Confirm.Show',
            {
                title:         'Powered Up is connected',
                lines:         ['To change the Powered Up device count you must disconnect first', 'Do you want to continue?'],
                applyCallback: disconnectAndSelectDeviceCount
            }
        );
    } else {
        selectDeviceCount();
    }
};

exports.selectSpikeDeviceCount = (settings, spike) => {
    const applyDeviceCount = (deviceCount) => {
            spike.setActiveLayerCount(deviceCount);
            dispatcher
                .dispatch('Spike.DeviceCount',             deviceCount)
                .dispatch('Settings.Set.SpikeDeviceCount', deviceCount)
                .dispatch('Button.Device.Spike');
        };
    const selectDeviceCount = () => {
            dispatcher.dispatch(
                'Dialog.DeviceCount.Show',
                {
                    deviceCount: settings.getSpikeDeviceCount(),
                    layerCount:  spikeModuleConstants.SPIKE_LAYER_COUNT,
                    title:       'Number of Spike devices',
                    onApply:     applyDeviceCount
                }
            );
        };
    const disconnectAndSelectDeviceCount = () => {
            spike.disconnect();
            selectDeviceCount();
        };
    if (spike.getConnected()) {
        dispatcher.dispatch(
            'Dialog.Confirm.Show',
            {
                title:         'Spike is connected',
                lines:         ['To change the Spike device count you must disconnect first', 'Do you want to continue?'],
                applyCallback: disconnectAndSelectDeviceCount
            }
        );
    } else {
        selectDeviceCount();
    }
};
