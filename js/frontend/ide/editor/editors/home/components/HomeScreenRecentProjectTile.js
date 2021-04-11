/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path           = require('../../../../../../shared/lib/path');
const dispatcher     = require('../../../../../lib/dispatcher').dispatcher;
const HomeScreenTile = require('./HomeScreenTile').HomeScreenTile;

exports.HomeScreenRecentProjectTile = class extends HomeScreenTile {
    constructor(opts) {
        opts.subTitle = path.getPathAndFilename(opts.settings.getRecentProject()).filename;
        super(opts);
        this._settings = opts.settings;
        this._settings.on('Settings.RecentProject', this, this.onRecentProject);
    }

    onRecentProject() {
        this._refs.subTitle.innerHTML = path.getPathAndFilename(this._settings.getRecentProject()).filename;
    }

    onClick() {
        dispatcher.dispatch('Dialog.File.Open', this._settings.getRecentProject());
    }
};
