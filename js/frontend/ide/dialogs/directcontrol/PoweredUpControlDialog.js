/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const poweredUpModuleConstants = require('../../../../shared/vm/modules/poweredUpModuleConstants');
const dispatcher               = require('../../../lib/dispatcher').dispatcher;
const DirectControlDialog      = require('./DirectControlDialog').DirectControlDialog;

const SHOW_SIGNAL = 'Dialog.PoweredUpControl.Show';

exports.PoweredUpControlDialog = class extends DirectControlDialog {
    constructor(opts) {
        const validDevices = [
                poweredUpModuleConstants.POWERED_UP_DEVICE_BASIC_MOTOR,
                poweredUpModuleConstants.POWERED_UP_DEVICE_TRAIN_MOTOR,
                poweredUpModuleConstants.POWERED_UP_DEVICE_LED_LIGHTS,
                poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_TACHO_MOTOR,
                poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_MOVE_HUB_MOTOR,
                poweredUpModuleConstants.POWERED_UP_DEVICE_DUPLO_TRAIN_BASE_MOTOR,
                poweredUpModuleConstants.POWERED_UP_DEVICE_CONTROL_PLUS_LARGE_MOTOR,
                poweredUpModuleConstants.POWERED_UP_DEVICE_CONTROL_PLUS_XLARGE_MOTOR,
                poweredUpModuleConstants.POWERED_UP_DEVICE_TECHNIC_MEDIUM_ANGULAR_MOTOR
            ];
        const positionDevices = [
                poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_TACHO_MOTOR,
                poweredUpModuleConstants.POWERED_UP_DEVICE_BOOST_MOVE_HUB_MOTOR,
                poweredUpModuleConstants.POWERED_UP_DEVICE_CONTROL_PLUS_LARGE_MOTOR,
                poweredUpModuleConstants.POWERED_UP_DEVICE_CONTROL_PLUS_XLARGE_MOTOR,
                poweredUpModuleConstants.POWERED_UP_DEVICE_TECHNIC_MEDIUM_ANGULAR_MOTOR
            ];
        opts.layerCount     = poweredUpModuleConstants.POWERED_UP_LAYER_COUNT;
        opts.portsPerLayer  = 4;
        opts.withAlias      = true;
        opts.hasSound       = false;
        opts.hasVolume      = false;
        opts.hasBrake       = true;
        opts.title          = 'Powered Up Direct control';
        opts.motorValidator = {
            valid:       function(assigned) { return (assigned !== null) && (validDevices.indexOf(assigned) !== -1); },
            hasPosition: function(assigned) { return (assigned !== null) && (positionDevices.indexOf(assigned) !== -1); },
            waiting:     function(assigned) { return false; }
        };
        super(opts);
        dispatcher.on(SHOW_SIGNAL, this, this.onShow);
    }

    initEvents() {
        let device = this._device;
        for (let layer = 0; layer < poweredUpModuleConstants.POWERED_UP_LAYER_COUNT; layer++) {
            for (let output = 0; output < 4; output++) {
                (function(layer, output) {
                    device.on(
                        'PoweredUp.Layer' + layer + '.Assigned' + output,
                        this,
                        function(assigned) {
                            /* eslint-disable no-invalid-this */
                            this.onOutputAssigned(layer, output, assigned);
                        }
                    );
                    device.on(
                        'PoweredUp.Layer' + layer + '.Changed' + output,
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

exports.PoweredUpControlDialog.SHOW_SIGNAL = SHOW_SIGNAL;
