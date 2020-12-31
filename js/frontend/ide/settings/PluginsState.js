/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const platform     = require('../../../shared/lib/platform');
const dispatcher   = require('../../lib/dispatcher').dispatcher;
const Emitter      = require('../../lib/Emitter').Emitter;
const pluginUuid   = require('../plugins/pluginUuid');

exports.PluginsState = class extends Emitter {
    constructor(opts) {
        super(opts);
        this._settings = opts.settings;
        this._plugins  = this.getDefaultPlugins();
        this._updatePluginByUuid();
        dispatcher
            .on('Settings.Set.PluginPropertyByUuid', this, this._setPluginPropertyByUuid)
            .on('Settings.Toggle.PluginByUuid',      this, this._togglePluginByUuid)
            .on('Settings.Show.PluginByUuid',        this, this._showPluginByUuid);
    }

    _updatePluginByUuid() {
        let pluginByUuid = {};
        this._plugins.forEach((plugin) => { pluginByUuid[plugin.uuid] = plugin; });
        this._pluginByUuid = pluginByUuid;
    }

    _togglePluginByUuid(uuid) {
        let plugin = this.getPluginByUuid(uuid);
        if (!plugin) {
            return;
        }
        this._setPluginPropertyByUuid(uuid, 'visible', !plugin.visible);
    }

    _showPluginByUuid(uuid) {
        let plugin = this.getPluginByUuid(uuid);
        if (!plugin) {
            return;
        }
        this._setPluginPropertyByUuid(uuid, 'visible', true);
    }

    _setPluginPropertyByUuid(uuid, property, value) {
        let plugin = this.getPluginByUuid(uuid);
        if (!plugin) {
            return;
        }
        plugin[property] = value;
        this._settings.save();
        this._settings.emit('Settings.Plugin');
    }

    getDefaultPlugins() {
        return [
            {
                uuid:    pluginUuid.SIMULATOR_NXT_MOTORS_UUID,
                group:   'NXT',
                name:    'NXT Motors',
                path:    'nxtmotors',
                visible: false,
                order:   1
            },
            {
                uuid:    pluginUuid.SIMULATOR_NXT_SENSORS_UUID,
                group:   'NXT',
                name:    'NXT Sensors',
                path:    'nxtsensors',
                visible: false,
                order:   2
            },
            {
                uuid:    pluginUuid.SIMULATOR_EV3_MOTORS_UUID,
                group:   'EV3',
                name:    'EV3 Motors',
                path:    'ev3motors',
                visible: false,
                order:   3
            },
            {
                uuid:    pluginUuid.SIMULATOR_EV3_UUID,
                group:   'EV3',
                name:    'EV3',
                path:    'ev3',
                visible: false,
                order:   4
            },
            {
                uuid:    pluginUuid.SIMULATOR_EV3_SENSORS_UUID,
                group:   'EV3',
                name:    'EV3 Sensors',
                path:    'ev3sensors',
                visible: false,
                order:   5
            },
            {
                uuid:    pluginUuid.SIMULATOR_EV3_SENSOR_GRAPH_UUID,
                group:   'EV3',
                name:    'EV3 Sensor output graph',
                path:    'ev3graph',
                visible: true,
                order:   6
            },
            {
                uuid:    pluginUuid.SIMULATOR_POWERED_UP_UUID,
                group:   'PoweredUp',
                name:    'Hub',
                path:    'poweredup',
                visible: false,
                order:   7
            },
            {
                uuid:    pluginUuid.SIMULATOR_SPIKE_UUID,
                group:   'Spike',
                name:    'Spike',
                path:    'spike',
                visible: false,
                order:   8
            },
            {
                uuid:    pluginUuid.SIMULATOR_SPIKE_PORTS_UUID,
                group:   'Spike',
                name:    'Spike ports',
                path:    'spikeports',
                visible: false,
                order:   9
            },
            {
                uuid:    pluginUuid.SIMULATOR_SPIKE_SENSOR_GRAPH_UUID,
                group:   'Spike',
                name:    'Spike Sensor output graph',
                path:    'spikegraph',
                visible: true,
                order:   10
            }
        ];
    }

    getSortedPlugins() {
        let plugins  = [];
        this._plugins.forEach((plugin) => {
            plugins.push(Object.assign(
                {
                    toString: function() {
                        let order = ('000' + this.order).substr(-3);
                        return this.group + '_' + order + '_' + this.name;
                    }
                },
                plugin
            ));
        });
        plugins.sort();
        return plugins;
    }

    getPluginByUuid(uuid) {
        return this._pluginByUuid[uuid] || null;
    }

    load(data) {
        let plugins           = this.getDefaultPlugins();
        let pluginIndexByUuid = {};
        plugins.forEach((plugin, index) => {
            pluginIndexByUuid[plugin.uuid] = index;
        });
        data.forEach((plugin) => {
            if (plugin.uuid in pluginIndexByUuid) {
                let index         = pluginIndexByUuid[plugin.uuid];
                let defaultPlugin = plugins[index];
                for (let i in plugin) {
                    if (!(i in defaultPlugin) || (i === 'visible')) {
                        defaultPlugin[i] = plugin[i];
                    }
                }
            } else {
                pluginIndexByUuid[plugin.uuid] = plugins.length;
                plugins.push(plugin);
            }
        });
        this._plugins = plugins;
        this._updatePluginByUuid();
    }

    loadDefaults() {
        this._plugins = this.getDefaultPlugins();
        this._updatePluginByUuid();
    }

    toJSON() {
        return Object.assign([], this._plugins);
    }
};
