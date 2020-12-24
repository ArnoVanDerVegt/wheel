/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const spikeModuleConstants = require('../../../../../shared/vm/modules/spikeModuleConstants');
const platform             = require('../../../../lib/platform');
const dispatcher           = require('../../../../lib/dispatcher').dispatcher;
const SimulatorPlugin      = require('../lib/SimulatorPlugin').SimulatorPlugin;
const Hub                  = require('./components/Hub').Hub;

exports.Plugin = class extends SimulatorPlugin {
    constructor(opts) {
        opts.device = opts.spike;
        super(opts);
        this._spike         = opts.spike;
        this._hubs          = [];
        this._baseClassName = 'spike';
        this._settings.on('Settings.Plugin', this, this.onPluginSettings);
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        let children = [];
        for (let i = 0; i < spikeModuleConstants.SPIKE_LAYER_COUNT; i++) {
            children.push({
                type:    Hub,
                visible: (i === 0),
                layer:   i,
                plugin:  this,
                spike:   this._spike
            });
        }
        this.create(
            parentNode,
            {
                ref:       this.setRef('spike'),
                className: this.getClassName(),
                children:  children
            }
        );
    }

    addHub(hub) {
        this._hubs.push(hub);
    }

    showLayer(layer) {
        this._hubs.forEach((hub, index) => {
            hub.setVisible(index === layer);
        });
    }

    onPluginSettings() {
        this._refs.spike.className = this.getClassName();
    }

    clearLeds(led) {
        if (this._hubs[led.layer]) {
            this._hubs[led.layer].matrixClear();
        }
    }

    setLed(led) {
        if (this._hubs[led.layer]) {
            this._hubs[led.layer].matrixSetLed(led.x, led.y, led.brightness);
        }
    }

    setText(led) {
        if (this._hubs[led.layer]) {
            this._hubs[led.layer].matrixSetText(led.text);
        }
    }
};
