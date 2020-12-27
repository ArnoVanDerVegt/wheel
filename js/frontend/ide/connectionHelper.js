let spikeConnectionId = 0;

exports.connectSpike = (settings, spike) => {
    if (spike.getConnectionCount() < this._settings.getSpikeDeviceCount()) {
        if (platform.isWeb()) {
            spikeConnectionId++;
            dispatcher.dispatch('Spike.ConnectToDevice', 'Browser connection (' + spikeConnectionId + ')');
        } else {
            dispatcher.dispatch('Dialog.ConnectSpike.Show');
        }
        this.onSelectDeviceSpike();
    } else {
        let lines = ['You\'ve reached the maximum number of connections.'];
        if (spike.getConnectionCount() < spikeModuleConstants.LAYER_COUNT) {
            lines.push('You can change this setting in the <i>Spike</i> > <i>Device count</i> menu.');
        }
        dispatcher.dispatch('Dialog.Alert.Show', {title: 'Maximum connections reached', lines: lines});
    }
};
