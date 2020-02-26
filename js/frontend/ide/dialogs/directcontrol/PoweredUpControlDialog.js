/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher          = require('../../../lib/dispatcher').dispatcher;
const DirectControlDialog = require('./DirectControlDialog').DirectControlDialog;

exports.PoweredUpControlDialog = class extends DirectControlDialog {
    constructor(opts) {
        opts.hasSound       = false;
        opts.title          = 'Powered Up Direct control';
        opts.motorValidator = {
            valid:       function(assigned) { return (assigned !== null) && ([1, 38, 8].indexOf(assigned) !== -1); },
            hasPosition: function(assigned) { return (assigned !== null) && ([38].indexOf(assigned) !== -1); },
            waiting:     function(assigned) { return false; }
        };
        super(opts);
        dispatcher.on('Dialog.PoweredUpControl.Show', this, this.onShow);
    }

    initEvents() {
        let device = this._device;
        for (let layer = 0; layer < 4; layer++) {
            for (let output = 0; output < 4; output++) {
                (function(layer, output) {
                    device.on(
                        'PoweredUp.Layer' + layer + 'Sensor' + output + 'Assigned',
                        this,
                        function(assigned) {
                            /* eslint-disable no-invalid-this */
                            this.onOutputAssigned(layer, output, assigned);
                        }
                    );
                    device.on(
                        'PoweredUp.Layer' + layer + 'Sensor' + output + 'Changed',
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
