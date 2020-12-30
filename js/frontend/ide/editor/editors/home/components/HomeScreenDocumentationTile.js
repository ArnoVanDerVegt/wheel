/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const ProgressBar    = require('../../../../../lib/components/status/ProgressBar').ProgressBar;
const dispatcher     = require('../../../../../lib/dispatcher').dispatcher;
const path           = require('../../../../../lib/path');
const HomeScreenTile = require('./HomeScreenTile').HomeScreenTile;

exports.HomeScreenDocumentationTile = class extends HomeScreenTile {
    constructor(opts) {
        opts.title = 'Open documentation &raquo;';
        super(opts);
        this._ui       = opts.ui;
        this._settings = opts.settings;
        dispatcher.on('Woc.Progress', this, this.onWocProgress);
    }

    getSubTitle() {
        return {
            ref:   this.setRef('progressBar'),
            type:  ProgressBar,
            ui:    this._ui,
            width: 160
        };
    }

    onWocProgress(opts) {
        let progressBar = this._refs.progressBar;
        if (!progressBar) {
            return;
        }
        if (!opts.total || (opts.index >= opts.total - 1)) {
            progressBar.onEvent({hidden: true});
            return;
        }
        progressBar.onEvent({value: opts.index * 100 / opts.total});
    }
};
