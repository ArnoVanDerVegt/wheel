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
        this._brick         = opts.brick;
        this._layer         = 0;
        this._motorElements = [];
        this.createWindow(
            'direct-control-dialog',
            'Direct control',
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
                    type:     Motors,
                    ui:       this._ui,
                    uiId:     this._uiId,
                    brick:    this._brick,
                    dialog:   this
                },
                {
                    type:     Piano,
                    ui:       this._ui,
                    uiId:     this._uiId,
                    brick:    this._brick,
                    dialog:   this
                },
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
                },
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
        dispatcher.on('Dialog.DirectControl.Show', this, this.onShow);
        this.initLayerState();
        this.initBrickEvents();
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

    initBrickEvents() {
        let brick = this._brick;
        for (let layer = 0; layer < 4; layer++) {
            for (let output = 0; output < 4; output++) {
                (function(layer, output) {
                    brick.on(
                        'Brick.Layer' + layer + 'Motor' + output + 'Assigned',
                        this,
                        function(assigned) {
                            /* eslint-disable no-invalid-this */
                            this.onOutputAssigned(layer, output, assigned);
                        }
                    );
                    brick.on(
                        'Brick.Layer' + layer + 'Motor' + output + 'Changed',
                        this,
                        function(value) {
                            /* eslint-disable no-invalid-this */
                            this.onOutputChanged(layer, output, value);
                        }
                    );
                }).call(this, layer, output);
            }
        }
    }

    addMotorElement(element) {
        this._motorElements.push(element);
    }

    getVolumeSliderElement() {
        return this._refs.volumeSlider;
    }

    getBrake() {
        return this._refs.brakeCheckbox.getChecked();
    }

    getLayer() {
        let tabToLayer = {
                'Layer 1': 0,
                'Layer 2': 1,
                'Layer 3': 2,
                'Layer 4': 3
            };
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
        refs.piano.className  = 'piano hidden';
        refs.volume.className = 'volume hidden';
        for (let i = 0; i < 4; i++) {
            let status = this._layerState[layer][i];
            this._motorElements[i]
                .clearAssignedTimeout()
                .setAssigned(status.assigned)
                .setPosition(status.position)
                .setSpeed(status.speed);
        }
    }

    onClickSound() {
        let refs = this._refs;
        refs.brake.className  = 'brake hidden';
        refs.motors.className = 'motors hidden';
        refs.piano.className  = 'piano';
        refs.volume.className = 'volume';
    }

    onShow(daisyChainMode) {
        this.show();
        let tabs = [];
        for (let i = 0; i <= daisyChainMode; i++) {
            (function(index) {
                tabs.push({
                    title: 'Layer ' + (i + 1),
                    onClick: (function() {
                        this.onSelectLayer(index);
                    }).bind(this)
                });
            }).call(this, i);
        }
        tabs.push({title: 'Sound', onClick: this.onClickSound.bind(this)});
        this._refs.tabs
            .setTabs(tabs)
            .setActiveTab('Layer 1', '')
            .focus();
        this.onSelectLayer(0);
    }
};
