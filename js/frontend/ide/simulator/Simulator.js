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
        this._opts     = opts;
        this._ui       = opts.ui;
        this._brick    = opts.brick;
        this._settings = opts.settings;
        this._layer    = 0;
        this._vm       = null;
        this._plugins  = {};
        this.initDOM(opts.parentNode || document.body);
    }

    initPlugins() {
        const plugins = [
                {
                    name: 'EV3 Motors',
                    path: '../plugins/simulator/ev3motors/Motors'
                },
                {
                    name: 'EV3',
                    path: '../plugins/simulator/ev3/EV3'
                },
                {
                    name: 'EV3 Sensors',
                    path: '../plugins/simulator/ev3sensors/Sensors'
                }
            ];
        let children = [];
        let settings = this._settings;
        plugins.forEach(
            function(plugin) {
                let name = plugin.name.split(' ').join('');
                dispatcher.on(
                    'Menu.Simulator.' + name,
                    this,
                    function() {
                        let pluginSettings = settings.getPluginByName(name, {});
                        pluginSettings.visible = !pluginSettings.visible;
                        dispatcher.dispatch('Settings.Set.PluginByName', name, pluginSettings);
                    }
                );
                children.push({
                    type:      require(plugin.path).Plugin,
                    name:      plugin.name,
                    ui:        this._ui,
                    brick:     this._brick,
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
                        brick:     this._brick,
                        settings:  this._settings,
                        simulator: this
                    },
                    {
                        className: 'ev3-background',
                        children: this.initPlugins().concat({
                            type:  SimulatorConnection,
                            ui:    this._ui,
                            brick: this._brick
                        })
                    }
                ]
            }
        );
        dispatcher.dispatch('Settings.UpdateViewSettings');
    }

    registerPlugin(name, plugin) {
        this._plugins[name] = plugin;
    }

    getPlugin(name) {
        return this._plugins[name] || null;
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
