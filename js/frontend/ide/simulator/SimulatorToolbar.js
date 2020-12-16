/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher  = require('../../lib/dispatcher').dispatcher;
const DOMNode     = require('../../lib/dom').DOMNode;
const Button      = require('../../lib/components/input/Button').Button;
const ToolOptions = require('../../lib/components/input/ToolOptions').ToolOptions;
const Dropdown    = require('../../lib/components/input/Dropdown').Dropdown;
const CloseButton = require('../../lib/components/input/CloseButton').CloseButton;
const tabIndex    = require('../tabIndex');

exports.SimulatorToolbar = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui        = opts.ui;
        this._settings  = opts.settings;
        this._simulator = opts.simulator;
        this.initDOM(opts.parentNode);
        dispatcher
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
        this.create(
            parentNode,
            {
                className: 'flt max-w simulator-options',
                children: [
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
                    },
                    {
                        type:      Dropdown,
                        ref:       this.setRef('layerList'),
                        ui:        this._ui,
                        uiId:      1,
                        tabIndex:  tabIndex.LAYER_1_BUTTON,
                        onChange:  this.onChangeLayer.bind(this),
                        items:     []
                    },
                    {
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
                            },
                            {
                                ui:       this._ui,
                                uiId:     2,
                                dispatch: 'Button.Device.Spike',
                                event:    'Button.Device.Spike.Change',
                                value:    'Spike'
                            }
                        ]
                    }
                ]
            }
        );
        this.updateLayerButtons();
    }

    getLayerCount() {
        let settings = this._settings;
        switch (settings.getActiveDevice()) {
            case 0: return settings.getDaisyChainMode();
            case 1: return settings.getDeviceCount() - 1;
            case 2: return 4;
        }
        return 4;
    }

    getLayerItems(layerCount) {
        let items = [];
        for (let i = 0; i <= layerCount; i++) {
            items.push({
                value: i,
                title: (i + 1) + ''
            });
        }
        return items;
    }

    updateLayerButtons() {
        let settings   = this._settings;
        let layerCount = this.getLayerCount();
        let layer      = this._simulator.getLayer();
        if (layer >= layerCount) {
            dispatcher.dispatch('Button.Layer' + layerCount);
            layer = layerCount;
        }
        this._refs.layerList
            .setItems(this.getLayerItems(layerCount))
            .setValue(layer);
    }

    updateSettings() {
        if (this._simulator.getLayer() >= this.getLayerCount()) {
            this._simulator.setLayer(0);
        }
        this.updateLayerButtons();
    }

    onChangeLayer(layer) {
        this._simulator.setLayer(layer);
        this.updateLayerButtons();
        dispatcher.dispatch('Simulator.Layer.Change', layer);
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
