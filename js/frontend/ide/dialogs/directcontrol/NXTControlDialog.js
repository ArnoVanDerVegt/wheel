/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher          = require('../../../lib/dispatcher').dispatcher;
const DirectControlDialog = require('./DirectControlDialog').DirectControlDialog;
const nxtModuleConstants  = require('../../../../shared/vm/modules/nxtModuleConstants');

exports.NXTControlDialog = class extends DirectControlDialog {
    constructor(opts) {
        opts.layerCount     = 4;
        opts.portsPerLayer  = 3;
        opts.hasSound       = true;
        opts.hasVolume      = false;
        opts.hasBrake       = false;
        opts.title          = 'NXT Direct control';
        opts.speed          = 100;
        opts.motorValidator = {
            valid: function(assigned) {
                return true;
            },
            hasPosition: function(assigned) {
                return true;
            },
            waiting: function(assigned) {
                return ([0, -1].indexOf(assigned) !== -1);
            }
        };
        super(opts);
        dispatcher.on('Dialog.NXTControl.Show', this, this.onShow);
    }

    initEvents() {
        let device = this._device;
        for (let layer = 0; layer < 4; layer++) {
            for (let output = 0; output < 3; output++) {
                (function(layer, output) {
                    device.on(
                        'NXT.Layer' + layer + '.Motor.Changed' + output,
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
};
