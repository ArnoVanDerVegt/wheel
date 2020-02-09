/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher          = require('../../lib/dispatcher').dispatcher;
const DOMNode             = require('../../lib/dom').DOMNode;
const Button              = require('../../lib/components/Button').Button;
const SimulatorToolbar    = require('./SimulatorToolbar').SimulatorToolbar;
const SimulatorConnection = require('./SimulatorConnection').SimulatorConnection;

exports.Simulator = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._opts      = opts;
        this._ui        = opts.ui;
        this._ev3       = opts.ev3;
        this._poweredUp = opts.poweredUp;
        this._settings  = opts.settings;
        this._layer     = 0;
        this._vm        = null;
        this._plugins   = {};
        this.initDOM(opts.parentNode || document.body);
    }

    cleanPath(path) {
        let valid  = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789';
        let result = '';
        for (let i = 0; i < path.length; i++) {
            (valid.indexOf(path[i]) !== -1) && (result += path[i]);
        }
        return result;
    }

    initPlugins() {
        let plugins  = this._settings.getPlugins().getSortedPlugins();
        let children = [];
        let settings = this._settings;
        plugins.forEach(
            function(plugin) {
                let uuid = plugin.uuid;
                dispatcher.on(
                    'Menu.Simulator.' + uuid,
                    this,
                    function() {
                        let pluginSettings = settings.getPluginByUiid(uuid, {});
                        dispatcher.dispatch('Settings.Set.PluginPropertyByUuid', uuid, 'visible', !pluginSettings.visible);
                    }
                );
                children.push({
                    type:      require('../plugins/simulator/' + this.cleanPath(plugin.path) + '/Plugin').Plugin,
                    plugin:    plugin,
                    ui:        this._ui,
                    ev3:       this._ev3,
                    poweredUp: this._poweredUp,
                    settings:  settings,
                    simulator: this
                });
            },
            this
        );
        return children;
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'simulator',
                children: [
                    {
                        type:      SimulatorToolbar,
                        ui:        this._ui,
                        ev3:       this._ev3,
                        settings:  this._settings,
                        simulator: this
                    },
                    {
                        className: 'ev3-background',
                        children: this.initPlugins().concat({
                            type: SimulatorConnection,
                            ui:   this._ui,
                            ev3:  this._ev3
                        })
                    }
                ]
            }
        );
        dispatcher.dispatch('Settings.UpdateViewSettings');
    }

    registerPlugin(uuid, plugin) {
        this._plugins[uuid] = plugin;
    }

    getPluginByUuid(uuid) {
        return this._plugins[uuid] || null;
    }

    getVM() {
        return this._vm;
    }

    setVM(vm) {
        this._vm = vm;
    }

    getLayer() {
        return this._layer;
    }

    setLayer(layer) {
        this._layer = layer;
        for (let plugin in this._plugins) {
            plugin = this._plugins[plugin];
            if ('showLayer' in plugin) {
                plugin.showLayer(layer);
            }
        }
    }
};
