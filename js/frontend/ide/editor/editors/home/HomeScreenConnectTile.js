/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const HomeScreenTile = require('./HomeScreenTile').HomeScreenTile;

exports.HomeScreenConnectTile = class extends HomeScreenTile {
    constructor(opts) {
        super(opts);
        this._brick = opts.brick;
        opts.brick.on('Brick.Connecting',   this, this.onBrickConnecting);
        opts.brick.on('Brick.Connected',    this, this.onBrickConnected);
        opts.brick.on('Brick.Disconnected', this, this.onBrickDisconnected);
    }

    onBrickConnecting() {
        let refs = this._refs;
        refs.homeScreenTileText.className = 'home-screen-tile-text with-sub-title';
        refs.subTitle.innerHTML           = 'Connecting...';
        refs.title.innerHTML              = 'EV3';
    }

    onBrickConnected() {
        let refs = this._refs;
        refs.homeScreenTileText.className = 'home-screen-tile-text with-sub-title';
        refs.subTitle.innerHTML           = 'Connected';
        refs.title.innerHTML              = 'EV3';
    }

    onBrickDisconnected() {
        let refs = this._refs;
        refs.homeScreenTileText.className = 'home-screen-tile-text';
        refs.subTitle.innerHTML           = '';
        refs.title.innerHTML              = 'Connect to EV3 &raquo;';
    }

    onClick() {
        if (!this._brick.getConnected()) {
            this._onClick();
        }
    }

    getIcon() {
        return {
            className: 'icon-ev3',
            children: [
                {
                    className: 'body-side'
                },
                {
                    className: 'body',
                    children: [
                        {
                            className: 'screen',
                            children: [
                                {
                                    className: 'display'
                                }
                            ]
                        },
                        {
                            className: 'buttons'
                        },
                        {
                            className: 'bottom'
                        }
                    ]
                }
            ]
        };
    }
};
