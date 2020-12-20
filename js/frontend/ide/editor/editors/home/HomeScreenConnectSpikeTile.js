/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const HomeScreenTile = require('./HomeScreenTile').HomeScreenTile;

exports.HomeScreenConnectSpikeTile = class extends HomeScreenTile {
    constructor(opts) {
        super(opts);
        this._spike = opts.spike;
        opts.spike
            .on('Spike.Connecting', this, this.onSpikeConnecting)
            .on('Spike.Connected',  this, this.onSpikeConnected);
    }

    onSpikeConnecting() {
        let refs = this._refs;
        refs.homeScreenTileText.className = 'frt max-h home-screen-tile-text with-sub-title';
        refs.subTitle.innerHTML           = 'Connecting...';
        refs.title.innerHTML              = 'Spike';
    }

    onSpikeConnected() {
        let refs           = this._refs;
        let connectedCount = 1; // Todo: this._spike.getConnectionCount();
        refs.homeScreenTileText.className = 'frt max-h home-screen-tile-text with-sub-title';
        refs.subTitle.innerHTML           = 'Connected to ' + connectedCount + ' device' + (connectedCount > 1 ? 's' : '');
        refs.title.innerHTML              = 'Spike';
    }
};
