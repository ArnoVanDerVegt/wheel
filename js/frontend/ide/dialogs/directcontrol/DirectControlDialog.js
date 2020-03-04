/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher      = require('../../../lib/dispatcher').dispatcher;
const DOMNode         = require('../../../lib/dom').DOMNode;
const Dialog          = require('../../../lib/components/Dialog').Dialog;
const Button          = require('../../../lib/components/Button').Button;
const Checkbox        = require('../../../lib/components/Checkbox').Checkbox;
const Slider          = require('../../../lib/components/Slider').Slider;
const Tabs            = require('../../../lib/components/Tabs').Tabs;
const getDataProvider = require('../../../lib/dataprovider/dataProvider').getDataProvider;
const Motors          = require('./components/Motors').Motors;
const Piano           = require('./components/Piano').Piano;

exports.DirectControlDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this._device             = opts.device;
        this._layer              = 0;
        this._motorElements      = [];
        this._motorAliasElements = [];
        this._hasSound           = opts.hasSound;
        this.createWindow(
            'direct-control-dialog',
            opts.title,
            [
                {
                    ref:      this.setRef('tabs'),
                    type:     Tabs,
                    ui:       this._ui,
                    uiId:     this._uiId,
                    tabIndex: 1,
                    active:   {title: 'Layer 1', meta: ''}
                },
                {
                    type:           Motors,
                    motorValidator: opts.motorValidator,
                    settings:       this._settings,
                    ui:             this._ui,
                    uiId:           this._uiId,
                    device:         this._device,
                    dialog:         this
                },
                this._hasSound ?
                    {
                        type:     Piano,
                        ui:       this._ui,
                        uiId:     this._uiId,
                        device:   this._device,
                        dialog:   this
                    } :
                    null,
                {
                    ref:       this.setRef('brake'),
                    className: 'brake',
                    children: [
                        {
                            ref:      this.setRef('brakeCheckbox'),
                            ui:       this._ui,
                            uiId:     this._uiId,
                            type:     Checkbox,
                            tabIndex: 50,
                            checked:  false
                        },
                        {
                            className: 'label',
                            innerHTML: 'Brake motor'
                        }
                    ]
                },
                this._hasSound ?
                    {
                        ref:       this.setRef('volume'),
                        className: 'volume hidden',
                        children: [
                            {
                                className: 'label',
                                innerHTML: 'Volume:'
                            },
                            {
                                ref:      this.setRef('volumeSlider'),
                                type:     Slider,
                                ui:       this._ui,
                                uiId:     this._uiId,
                                value:    50,
                                maxValue: 100,
                                tabIndex: 100
                            }
                        ]
                    } :
                    null,
                {
                    className: 'buttons',
                    children: [
                        this.addButton({
                            tabIndex: 128,
                            value:     'Close',
                            onClick:   this.hide.bind(this),
                            className: 'right'
                        })
                    ]
                }
            ]
        );
        this.initLayerState();
        this.initEvents();
    }

    initLayerState() {
        this._layerState = [];
        for (let layer = 0; layer < 4; layer++) {
            let layerOutputs = [];
            for (let output = 0; output < 4; output++) {
                layerOutputs.push({
                    assigned: null,
                    speed:    50,
                    position: 0
                });
            }
            this._layerState.push(layerOutputs);
        }
    }

    initEvents() {
    }

    addMotorElement(element) {
        this._motorElements.push(element);
    }

    addMotorAliasElement(element) {
        this._motorAliasElements.push(element);
    }

    getVolumeSliderElement() {
        return this._refs.volumeSlider;
    }

    getBrake() {
        return this._refs.brakeCheckbox.getChecked() ? 1 : 0;
    }

    getLayer() {
        let tabToLayer = {
                'Layer 1': 0,
                'Layer 2': 1,
                'Layer 3': 2,
                'Layer 4': 3
            };
        if (!this._refs.tabs || !this._refs.tabs.getActiveTab()) {
            return 0;
        }
        return tabToLayer[this._refs.tabs.getActiveTab().title];
    }

    onOutputAssigned(layer, output, assigned) {
        this._layerState[layer][output].assigned = assigned;
        if (layer === this._layer) {
            this._motorElements[output].setAssigned(assigned);
        }
    }

    onOutputChanged(layer, output, position) {
        this._layerState[layer][output].position = position;
        if (layer === this._layer) {
            this._motorElements[output].setPosition(position);
        }
    }

    onSelectLayer(layer) {
        let refs = this._refs;
        this._layer           = layer;
        refs.brake.className  = 'brake';
        refs.motors.className = 'motors';
        if (refs.piano) {
            refs.piano.className = 'piano hidden';
        }
        if (refs.volume) {
            refs.volume.className = 'volume hidden';
        }
        let layerState = this._layerState[layer];
        for (let i = 0; i < 4; i++) {
            let state = layerState[i];
            this._motorElements[i]
                .clearAssignedTimeout()
                .setAssigned(state.assigned)
                .setPosition(state.position)
                .setSpeed(state.speed);
            this._motorAliasElements[i]
                .update();
        }
    }

    onClickSound() {
        let refs = this._refs;
        refs.brake.className  = 'brake hidden';
        refs.motors.className = 'motors hidden';
        refs.piano.className  = 'piano';
        refs.volume.className = 'volume';
    }

    onShow(opts) {
        this.show();
        if (opts.withAlias) {
            this._dialogNode.querySelector('.dialog-content').className += ' with-alias';
        }
        let tabs = [];
        for (let i = 0; i <= opts.deviceCount; i++) {
            (function(index) {
                tabs.push({
                    title: 'Layer ' + (i + 1),
                    onClick: (function() {
                        this.onSelectLayer(index);
                    }).bind(this)
                });
            }).call(this, i);
        }
        if (this._hasSound) {
            tabs.push({title: 'Sound', onClick: this.onClickSound.bind(this)});
        }
        this._refs.tabs
            .setTabs(tabs)
            .setActiveTab('Layer 1', '')
            .focus();
        this.onSelectLayer(0);
    }
};
