/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const HomeScreenTile = require('./HomeScreenTile').HomeScreenTile;

exports.HomeScreenConnectEV3Tile = class extends HomeScreenTile {
    constructor(opts) {
        super(opts);
        this._ev3 = opts.ev3;
        opts.ev3
            .on('EV3.Connecting',     this, this.onEV3Connecting)
            .on('EV3.StopConnecting', this, this.onEV3StopConnecting)
            .on('EV3.Connected',      this, this.onEV3Connected)
            .on('EV3.Disconnected',   this, this.onEV3Disconnected);
    }

    onEV3Connecting() {
        let refs = this._refs;
        refs.homeScreenTileText.className = 'frt max-h home-screen-tile-text with-sub-title';
        refs.subTitle.innerHTML           = 'Connecting...';
        refs.title.innerHTML              = 'EV3';
    }

    onEV3StopConnecting() {
        let refs = this._refs;
        refs.homeScreenTileText.className = 'frt max-h home-screen-tile-text';
        refs.title.innerHTML              = 'Connect EV3 &raquo;';
        refs.subTitle.innerHTML           = '';
    }

    onEV3Connected() {
        let refs = this._refs;
        refs.homeScreenTileText.className = 'frt max-h home-screen-tile-text with-sub-title';
        refs.subTitle.innerHTML           = 'Connected';
        refs.title.innerHTML              = 'EV3';
    }

    onEV3Disconnected() {
        let refs = this._refs;
        refs.homeScreenTileText.className = 'frt max-h home-screen-tile-text';
        refs.subTitle.innerHTML           = '';
        refs.title.innerHTML              = 'Connect to EV3 &raquo;';
    }

    onClick() {
        if (!this._ev3.getConnected()) {
            this._onClick();
        }
    }
};
