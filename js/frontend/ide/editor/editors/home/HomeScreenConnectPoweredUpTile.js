/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const HomeScreenTile = require('./HomeScreenTile').HomeScreenTile;

exports.HomeScreenConnectPoweredUpTile = class extends HomeScreenTile {
    constructor(opts) {
        super(opts);
        this._poweredUp = opts.poweredUp;
        opts.poweredUp
            .on('PoweredUp.Connecting', this, this.onPoweredUpConnecting)
            .on('PoweredUp.Connected',  this, this.onPoweredUpConnected);
    }

    onPoweredUpConnecting() {
        let refs = this._refs;
        refs.homeScreenTileText.className = 'frt max-h home-screen-tile-text with-sub-title';
        refs.subTitle.innerHTML           = 'Connecting...';
        refs.title.innerHTML              = 'Powered Up';
    }

    onPoweredUpConnected() {
        let refs           = this._refs;
        let connectedCount = this._poweredUp.getConnectionCount();
        refs.homeScreenTileText.className = 'frt max-h home-screen-tile-text with-sub-title';
        refs.subTitle.innerHTML           = 'Connected to ' + connectedCount + ' device' + (connectedCount > 1 ? 's' : '');
        refs.title.innerHTML              = 'Powered Up';
    }
};
