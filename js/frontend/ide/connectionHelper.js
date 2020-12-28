/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const poweredUpModuleConstants = require('../../shared/vm/modules/poweredUpModuleConstants');
const spikeModuleConstants     = require('../../shared/vm/modules/spikeModuleConstants');
const platform                 = require('../../shared/lib/platform');
const dispatcher               = require('../lib/dispatcher').dispatcher;

let spikeConnectionId = 0;

exports.connectPoweredUp = (settings, poweredUp) => {
    if (platform.isWeb() && !window.PoweredUP.isWebBluetooth) {
        dispatcher.dispatch(
            'Dialog.Alert.Show',
            {
                title: 'Bluetooth not supported',
                lines: [
                    'Your browser does not support the Web Bluetooth specification.'
                ]
            }
        );
    } else if (poweredUp.getConnectionCount() >= settings.getPoweredUpDeviceCount()) {
        let lines = ['You\'ve reached the maximum number of connections.'];
        if (poweredUp.getConnectionCount() < poweredUpModuleConstants.LAYER_COUNT) {
            lines.push('You can change this setting in the <i>PoweredUp</i> > <i>Device count</i> menu.');
        }
        dispatcher.dispatch('Dialog.Alert.Show', {title: 'Maximum connections reached', lines: lines});
    } else {
        dispatcher
            .dispatch('Dialog.ConnectPoweredUp.Show')
            .dispatch('Button.Device.PoweredUp');
    }
};

exports.connectSpike = (settings, spike) => {
    if (spike.getConnectionCount() < settings.getSpikeDeviceCount()) {
        if (platform.isWeb()) {
            spikeConnectionId++;
            dispatcher.dispatch('Spike.ConnectToDevice', 'Spike connection (' + spikeConnectionId + ')');
        } else {
            dispatcher.dispatch('Dialog.ConnectSpike.Show');
        }
        dispatcher.dispatch('Button.Device.Spike');
    } else {
        let lines = ['You\'ve reached the maximum number of connections.'];
        if (spike.getConnectionCount() < spikeModuleConstants.LAYER_COUNT) {
            lines.push('You can change this setting in the <i>Spike</i> > <i>Device count</i> menu.');
        }
        dispatcher.dispatch('Dialog.Alert.Show', {title: 'Maximum connections reached', lines: lines});
    }
};
