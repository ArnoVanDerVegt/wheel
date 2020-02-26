/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher  = require('../../lib/dispatcher').dispatcher;
const DOMNode     = require('../../lib/dom').DOMNode;
const Button      = require('../../lib/components/Button').Button;
const ToolOptions = require('../../lib/components/ToolOptions').ToolOptions;
const CloseButton = require('../../lib/components/CloseButton').CloseButton;
const tabIndex    = require('../tabIndex');

exports.SimulatorToolbar = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui        = opts.ui;
        this._settings  = opts.settings;
        this._simulator = opts.simulator;
        this.initDOM(opts.parentNode);
        dispatcher
            .on('Button.Layer0',                  this, this.onToggleLayer0)
            .on('Button.Layer1',                  this, this.onToggleLayer1)
            .on('Button.Layer2',                  this, this.onToggleLayer2)
            .on('Button.Layer3',                  this, this.onToggleLayer3)
            .on('Button.Device.EV3.Change',       this, this.onEV3Device)
            .on('Button.Device.PoweredUp.Change', this, this.onPoweredUpDevice);
        this._settings
            .addEventListener('Settings.EV3',       this, this.updateSettings)
            .addEventListener('Settings.PoweredUp', this, this.updateSettings);
        let activeDevice = this._settings.getActiveDevice();
        dispatcher.dispatch('Button.Device.EV3.Change',       {className: activeDevice ? 'in-active' : 'active'});
        dispatcher.dispatch('Button.Device.PoweredUp.Change', {className: activeDevice ? 'active' : 'in-active'});
    }

    initDOM(parentNode) {
        let children = [
                {
                    type:      Button,
                    ui:        this._ui,
                    uiId:      1,
                    dispatch:  'Button.Run',
                    event:     'Button.Run.Change',
                    tabIndex:  tabIndex.SIMULATOR_RUN_BUTTON,
                    className: 'run',
                    value:     'Run',
                    disabled:  true
                },
                {
                    type:      Button,
                    ui:        this._ui,
                    uiId:      1,
                    dispatch:  'Button.Continue',
                    event:     'Button.Continue.Change',
                    tabIndex:  tabIndex.SIMULATOR_CONTINUE_BUTTON,
                    className: 'continue',
                    value:     'Continue',
                    disabled:  true,
                    hidden:    true
                },
                {
                    type:      CloseButton,
                    ui:        this._ui,
                    uiId:      1,
                    onClick:   this.onCloseSimulator.bind(this),
                    tabIndex:  tabIndex.CLOSE_SIMULATOR_BUTTON,
                    onSelect:  this.updateLayerButtons.bind(this)
                }
            ];
        let options = [];
        for (let i = 0; i < 4; i++) {
            options.push({
                ui:       this._ui,
                uiId:     1,
                dispatch: 'Button.Layer' + i,
                event:    'Button.Layer' + i + '.Change',
                value:    (i + 1)
            });
        }
        children.push({
            type:     ToolOptions,
            ui:       this._ui,
            uiId:     1,
            tabIndex: tabIndex.LAYER_1_BUTTON,
            options:  options,
            color:    'green'
        });
        children.push({
            type:     ToolOptions,
            ui:       this._ui,
            uiId:     1,
            tabIndex: tabIndex.DEVICE_EV3_BUTTON,
            color:    'green',
            options:  [
                {
                    ui:       this._ui,
                    uiId:     1,
                    dispatch: 'Button.Device.EV3',
                    event:    'Button.Device.EV3.Change',
                    value:    'EV3'
                },
                {
                    ui:       this._ui,
                    uiId:     1,
                    dispatch: 'Button.Device.PoweredUp',
                    event:    'Button.Device.PoweredUp.Change',
                    value:    'Hub'
                }
            ]
        });
        this.create(
            parentNode,
            {
                className: 'simulator-options',
                children:  children
            }
        );
        this.updateLayerButtons();
    }

    getLayerCount() {
        let settings = this._settings;
        return (settings.getActiveDevice() === 0) ? settings.getDaisyChainMode() : (settings.getDeviceCount() - 1);
    }

    updateLayerButtons() {
        let settings   = this._settings;
        let layerCount = this.getLayerCount();
        let layer      = this._simulator.getLayer();
        if (layer > layerCount) {
            dispatcher.dispatch('Button.Layer' + layerCount);
            layer = layerCount;
        }
        dispatcher.dispatch(
            'Button.Layer0.Change',
            {
                hidden:    (layerCount === 0),
                className: (layerCount === 0 ? 'last ' : '') +
                            (layer === 0 ? 'active' : 'in-active')
            }
        );
        dispatcher.dispatch(
            'Button.Layer1.Change',
            {
                hidden:    (layerCount < 1),
                className: (layerCount === 1 ? 'last ' : '') +
                            (layer === 1 ? ' active' : 'in-active')
            }
        );
        dispatcher.dispatch(
            'Button.Layer2.Change',
            {
                hidden:    (layerCount < 2),
                className: (layerCount === 2 ? 'last ' : '') +
                            (layer === 2 ? ' active' : 'in-active')
            }
        );
        dispatcher.dispatch(
            'Button.Layer3.Change',
            {
                hidden:    (layerCount < 3),
                className: (layerCount === 3 ? 'last ' : '') +
                            (layer === 3 ? ' active' : 'in-active')
            }
        );
    }

    updateSettings() {
        if (this._simulator.getLayer() > this.getLayerCount()) {
            this._simulator.setLayer(0);
        }
        this.updateLayerButtons();
    }

    onToggleLayer0() {
        this._simulator.setLayer(0);
        this.updateLayerButtons();
    }

    onToggleLayer1() {
        this._simulator.setLayer(1);
        this.updateLayerButtons();
    }

    onToggleLayer2() {
        this._simulator.setLayer(2);
        this.updateLayerButtons();
    }

    onToggleLayer3() {
        this._simulator.setLayer(3);
        this.updateLayerButtons();
    }

    onEV3Device() {
        this.updateLayerButtons();
    }

    onPoweredUpDevice() {
        this.updateLayerButtons();
    }

    onCloseSimulator() {
        this._settings.getShowSimulator() && dispatcher.dispatch('Settings.Toggle.ShowSimulator');
    }
};
