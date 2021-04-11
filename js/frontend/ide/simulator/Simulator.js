/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher       = require('../../lib/dispatcher').dispatcher;
const DOMNode          = require('../../lib/dom').DOMNode;
const Button           = require('../../lib/components/input/Button').Button;
const Checkbox         = require('../../lib/components/input/Checkbox').Checkbox;
const pluginUuid       = require('../plugins/pluginUuid');
const tabIndex         = require('../tabIndex');
const SimulatorToolbar = require('./SimulatorToolbar').SimulatorToolbar;

exports.Simulator = class extends DOMNode {
    constructor(opts) {
        super(opts);
        (typeof opts.id === 'function') && opts.id(this);
        this._opts      = opts;
        this._ui        = opts.ui;
        this._devices   = opts.devices;
        this._settings  = opts.settings;
        this._layer     = 0;
        this._vm        = null;
        this._plugins   = {};
        this.initDOM(opts.parentNode);
        dispatcher.on('Simulator.ShowPluginByName', this, this.onShowPluginByName);
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
            function(plugin, index) {
                let uuid = plugin.uuid;
                if (pluginUuid.UUID_LIST.indexOf(uuid) === -1) {
                    return;
                }
                dispatcher.on(
                    'Menu.Simulator.' + uuid,
                    this,
                    function() {
                        let pluginSettings = settings.getPluginByUiid(uuid, {});
                        dispatcher.dispatch('Settings.Plugin.SetByUuid', uuid, 'visible', !pluginSettings.visible);
                    }
                );
                let type;
                try {
                    type = require('../plugins/simulator/' + this.cleanPath(plugin.path) + '/Plugin').Plugin;
                } catch (error) {
                    type = null;
                }
                if (type) {
                    children.push({
                        type:      type,
                        plugin:    plugin,
                        ui:        this._ui,
                        devices:   this._devices,
                        simulator: this,
                        settings:  settings,
                        tabIndex:  tabIndex.SIMULATOR_PLUGINS + index * 96
                    });
                }
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
                        settings:  this._settings,
                        simulator: this
                    },
                    {
                        className: 'abs plugin-container',
                        children:  this.initPlugins()
                    }
                ]
            }
        );
        dispatcher.dispatch('Settings.UpdateViewSettings');
    }

    registerPlugin(uuid, plugin) {
        this._plugins[uuid] = plugin;
    }

    setAutoResetPanel(element) {
        this._autoResetPanelElement = element;
    }

    setAutoResetCheckbox(element) {
        this._autoResetCheckbox = element;
    }

    getPluginByName(name) {
        let plugins = this._settings.getPlugins().getSortedPlugins();
        for (let i in plugins) {
            let plugin = plugins[i];
            if (plugin.name === name) {
                return plugin;
            }
        }
        return null;
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

    onShowPluginByName(name) {
        let plugin = this.getPluginByName(name);
        if (plugin) {
            dispatcher.dispatch('Settings.Plugin.ShowByUuid', plugin.uuid);
        }
    }
};
