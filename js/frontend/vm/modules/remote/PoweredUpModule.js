/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const poweredUpModuleConstants = require('../../../../shared/vm/modules/poweredUpModuleConstants');
const LocalPoweredUpModule     = require('../local/PoweredUpModule').PoweredUpModule;

/*|
 *| record PoweredUpVector
 *|     number x, y, z
 *| end
 *|
 *| record PoweredUpStatus
 *|     number          button
 *|     PoweredUpVector tilt
 *|     PoweredUpVector accel
 *| end
 *|
 *| PoweredUpStatus poweredUpStatus[4]
*/

exports.PoweredUpModule = class extends LocalPoweredUpModule {
    constructor(opts) {
        super(opts);
        this._writeOffset = 0;
        this._subscribed  = false;
    }

    subscribeToTilt(device, signal, layer) {
        let vmData = this._vmData;
        device.on(
            signal,
            this,
            function(tilt) {
                /* eslint-disable no-invalid-this */
                let offset = this._writeOffset + layer * 7 + 1;
                vmData.setNumberAtOffset(tilt.x, offset);
                vmData.setNumberAtOffset(tilt.y, offset + 1);
                vmData.setNumberAtOffset(tilt.z, offset + 2);
            }
        );
    }

    subscribeToAccel(device, signal, layer) {
        let vmData = this._vmData;
        device.on(
            signal,
            this,
            function(accel) {
                /* eslint-disable no-invalid-this */
                let offset = this._writeOffset + layer * 7 + 4;
                vmData.setNumberAtOffset(accel.x, offset);
                vmData.setNumberAtOffset(accel.y, offset + 1);
                vmData.setNumberAtOffset(accel.z, offset + 2);
            }
        );
    }

    subscribe(device) {
        if (this._subscribed) {
            return;
        }
        this._subscribed = true;
    }

    run(commandId) {
        let vmData = this._vmData;
        let vm     = this._vm;
        let device = this._device();
        switch (commandId) {
            case poweredUpModuleConstants.POWERED_UP_START:
                this._writeOffset = vmData.getRegSrc();
                this.emit('PoweredUp.Start', {});
                for (let i = 0; i < 4; i ++) {
                    this.subscribeToTilt(device,  'PoweredUp.Layer' + i + 'Tilt',  i);
                    this.subscribeToAccel(device, 'PoweredUp.Layer' + i + 'Accel', i);
                    for (let j = 0; j < 7; j++) {
                        vmData.setNumberAtOffset(0, this._writeOffset + i * 7 + j);
                    }
                }
                break;
        }
    }
};
