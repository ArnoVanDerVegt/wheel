/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const HomeScreenTile = require('./HomeScreenTile').HomeScreenTile;

exports.HomeScreenConnectNXTTile = class extends HomeScreenTile {
    constructor(opts) {
        super(opts);
        this._nxt = opts.nxt;
        opts.nxt
            .on('NXT.Connecting',     this, this.onNXTConnecting)
            .on('NXT.StopConnecting', this, this.onNXTStopConnecting)
            .on('NXT.Connected',      this, this.onNXTConnected);
    }

    onNXTConnecting() {
        let refs = this._refs;
        refs.homeScreenTileText.className = 'frt max-h home-screen-tile-text with-sub-title';
        refs.title.innerHTML              = 'NXT';
        refs.subTitle.innerHTML           = 'Connecting...';
    }

    onNXTStopConnecting() {
        if (this._nxt.getConnectionCount()) {
            this.onNXTConnected();
        } else {
            let refs = this._refs;
            refs.homeScreenTileText.className = 'frt max-h home-screen-tile-text';
            refs.title.innerHTML              = 'Connect NXT &raquo;';
            refs.subTitle.innerHTML           = '';
        }
    }

    onNXTConnected() {
        let refs           = this._refs;
        let connectedCount = this._nxt.getConnectionCount();
        refs.homeScreenTileText.className = 'frt max-h home-screen-tile-text with-sub-title';
        refs.title.innerHTML              = 'NXT';
        refs.subTitle.innerHTML           = 'Connected to ' + connectedCount + ' device' + (connectedCount > 1 ? 's' : '');
    }
};
