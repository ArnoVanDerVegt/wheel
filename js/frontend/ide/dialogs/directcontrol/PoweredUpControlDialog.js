/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher          = require('../../../lib/dispatcher').dispatcher;
const DirectControlDialog = require('./DirectControlDialog').DirectControlDialog;

exports.PoweredUpControlDialog = class extends DirectControlDialog {
    constructor(opts) {
        const validDevices = [
                 1, // SIMPLE_MEDIUM_LINEAR_MOTOR
                 2, // TRAIN_MOTOR
                38, // MEDIUM_LINEAR_MOTOR
                39, // MOVE_HUB_MEDIUM_LINEAR_MOTOR
                41, // DUPLO_TRAIN_BASE_MOTOR
                46, // TECHNIC_LARGE_LINEAR_MOTOR
                47, // TECHNIC_XLARGE_LINEAR_MOTOR
                48  // TECHNIC_MEDIUM_ANGULAR_MOTOR
            ];
        const positionDevices = [
                39, // MOVE_HUB_MEDIUM_LINEAR_MOTOR
                46, // TECHNIC_LARGE_LINEAR_MOTOR
                47, // TECHNIC_XLARGE_LINEAR_MOTOR
                48  // TECHNIC_MEDIUM_ANGULAR_MOTOR
            ];
        opts.hasSound       = false;
        opts.title          = 'Powered Up Direct control';
        opts.motorValidator = {
            valid:       function(assigned) { return (assigned !== null) && (validDevices.indexOf(assigned) !== -1); },
            hasPosition: function(assigned) { return (assigned !== null) && (positionDevices.indexOf(assigned) !== -1); },
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
