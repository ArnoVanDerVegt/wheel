/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const ContextMenu = require('../../../../lib/components/ContextMenu').ContextMenu;
const dispatcher  = require('../../../../lib/dispatcher').dispatcher;
const DOMNode     = require('../../../../lib/dom').DOMNode;

exports.SimulatorPlugin = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._parentNode          = opts.parentNode;
        this._constants           = opts.constants;
        this._plugin              = opts.plugin;
        this._ui                  = opts.ui;
        this._settings            = opts.settings;
        this._device              = opts.ev3;
        this._simulator           = opts.simulator;
        this._onStop              = opts.onStop;
        this._tabIndex            = opts.tabIndex;
        this._disconnectedTimeout = null;
        this._connected           = false;
        this._contextMenus        = {};
        this._simulator.registerPlugin(this._plugin.uuid, this);
     }

    initSensorModeMenu(menu, options) {
        for (let i = 0; i < options.length; i++) {
            options[i] = this.initSensorModeOption(menu, options[i], i);
        }
        let contextMenu = new ContextMenu({
                ui:         this._ui,
                parentNode: this._parentNode,
                options:    options,
                withCheck:  true
            });
        this[menu] = contextMenu;
        return contextMenu;
    }

    initSensorModeOption(menu, sensorMode, index) {
        let constants = this._constants;
        return {
            title: sensorMode,
            onClick: () => {
                let mode      = null;
                let menuItems = this[menu].getMenuItems();
                for (let i = 0; i < menuItems.length; i++) {
                    let menuItem = menuItems[i];
                    let checked  = index === i;
                    if (checked) {
                        mode = constants[menuItem.getTitle()];
                        break;
                    }
                }
                if ((mode !== null) && this._activeSensor) {
                    let state = this._activeSensor.getState();
                    state.setMode(mode);
                    this._device.setMode(state.getLayer(), state.getId(), mode);
                }
            }
        };
    }

    getClassName() {
        let settings = this._settings;
        let uuid     = this._plugin.uuid;
        return this._baseClassName + ' ' + (settings.getPlugins().getPluginByUuid(uuid).visible ? ' visible' : '');
    }

    getContextMenu(options) {
        let key          = options.join('|');
        let contextMenus = this._contextMenus;
        if (!(key in contextMenus)) {
            contextMenus[key] = this.initSensorModeMenu(key, options);
        }
        return contextMenus[key];
    }

    showContextMenu(sensor, pos, event) {
        this._activeSensor = sensor;
        pos.x += 62;
        if (pos.y < window.innerHeight / 2) {
            pos.y += 71;
        }
        let options = sensor.getContextMenuOptions();
        if (!options) {
            return;
        }
        let contextMenu = this.getContextMenu(options);
        if (contextMenu) {
            let constants = this._constants;
            let menuItems = contextMenu.getMenuItems();
            let state     = sensor.getState();
            for (let i = 0; i < menuItems.length; i++) {
                let menuItem = menuItems[i];
                menuItem.setChecked(state.getMode() === constants[menuItem.getTitle()]);
            }
            contextMenu.show(pos.x, pos.y, this);
        }
    }
};
