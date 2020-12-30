/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher     = require('../../../../../lib/dispatcher').dispatcher;
const path           = require('../../../../../lib/path');
const HomeScreenTile = require('./HomeScreenTile').HomeScreenTile;

exports.HomeScreenThemeTile = class extends HomeScreenTile {
    constructor(opts) {
        opts.subTitle = '-';
        super(opts);
        this._settings = opts.settings;
        this.updateSubTitle();
    }

    onClick() {
        dispatcher.dispatch('Settings.Toggle.DarkMode');
        this.updateSubTitle();
    }

    updateSubTitle() {
        this._refs.subTitle.innerHTML = this._settings.getDarkMode() ? 'Dark' : 'Light';
    }
};
