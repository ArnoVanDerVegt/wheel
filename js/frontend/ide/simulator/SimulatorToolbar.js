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
            .on('Button.Layer0', this, this.onToggleLayer0.bind(this))
            .on('Button.Layer1', this, this.onToggleLayer1.bind(this))
            .on('Button.Layer2', this, this.onToggleLayer2.bind(this))
            .on('Button.Layer3', this, this.onToggleLayer3.bind(this));
        this._settings
            .addEventListener('Settings.EV3',  this, this.updateSettings.bind(this));
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
            options:  options
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

    updateLayerButtons() {
        let settings       = this._settings;
        let daisyChainMode = settings.getDaisyChainMode();
        let layer          = this._simulator.getLayer();
        dispatcher.dispatch(
            'Button.Layer0.Change',
            {
                hidden:    (daisyChainMode === 0),
                className: (daisyChainMode === 0 ? 'last ' : '') +
                            (layer === 0 ? 'active' : 'in-active')
            }
        );
        dispatcher.dispatch(
            'Button.Layer1.Change',
            {
                hidden:    (daisyChainMode < 1),
                className: (daisyChainMode === 1 ? 'last ' : '') +
                            (layer === 1 ? ' active' : 'in-active')
            }
        );
        dispatcher.dispatch(
            'Button.Layer2.Change',
            {
                hidden:    (daisyChainMode < 2),
                className: (daisyChainMode === 2 ? 'last ' : '') +
                            (layer === 2 ? ' active' : 'in-active')
            }
        );
        dispatcher.dispatch(
            'Button.Layer3.Change',
            {
                hidden:    (daisyChainMode < 3),
                className: (daisyChainMode === 3 ? 'last ' : '') +
                            (layer === 3 ? ' active' : 'in-active')
            }
        );
    }

    updateSettings() {
        let settings       = this._settings;
        let daisyChainMode = settings.getDaisyChainMode();
        let layer          = this._simulator.getLayer();
        if (layer > daisyChainMode) {
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

    onCloseSimulator() {
        let settings = this._settings;
        settings.getShowSimulatorMotors()  && dispatcher.dispatch('Settings.Toggle.ShowSimulatorMotors');
        settings.getShowSimulatorEV3()     && dispatcher.dispatch('Settings.Toggle.ShowSimulatorEV3');
        settings.getShowSimulatorSensors() && dispatcher.dispatch('Settings.Toggle.ShowSimulatorSensors');
    }
};
