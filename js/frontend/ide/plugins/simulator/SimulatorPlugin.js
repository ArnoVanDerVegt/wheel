/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const DOMNode    = require('../../../lib/dom').DOMNode;

exports.SimulatorPlugin = class extends DOMNode {
    constructor(opts) {
        super(opts);
        let brick = opts.brick;
        this._plugin              = opts.plugin;
        this._ui                  = opts.ui;
        this._settings            = opts.settings;
        this._brick               = opts.brick;
        this._simulator           = opts.simulator;
        this._onStop              = opts.onStop;
        this._disconnectedTimeout = null;
        this._connected           = false;
     }

    getClassName() {
        let settings = this._settings;
        let uuid     = this._plugin.uuid;
        return this._baseClassName + ' ' + (settings.getPlugins().getPluginByUuid(uuid).visible ? ' visible' : '');
    }
};
