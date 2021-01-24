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
 *| record PoweredUpState
 *|     number          button
 *|     PoweredUpVector tilt
 *|     PoweredUpVector accel
 *| end
 *|
 *| PoweredUpState poweredUpState[4]
*/
const POWERED_UP_STATE_RECORD_SIZE   = 1 + 3 + 3;
const POWERED_UP_STATE_TILT_OFFSET   = 1;
const POWERED_UP_STATE_ACCELL_OFFSET = 1 + 3;

exports.PoweredUpModule = class extends LocalPoweredUpModule {
    constructor(opts) {
        super(opts);
        this._writeOffset = 0;
        this._subscribed  = false;
        this._events      = [];
    }

    subscribeToVectorChange(device, signal, layer, offset) {
        let vmData = this._vmData;
        this._events.push(device.on(
            signal,
            this,
            function(vector) {
                /* eslint-disable no-invalid-this */
                let o = this._writeOffset + layer * POWERED_UP_STATE_RECORD_SIZE + offset;
                vmData.setNumberAtOffset(vector.x, o);
                vmData.setNumberAtOffset(vector.y, o + 1);
                vmData.setNumberAtOffset(vector.z, o + 2);
            }
        ));
        return this;
    }

    subscribe(device) {
        if (this._subscribed) {
            return this;
        }
        for (let i = 0; i < poweredUpModuleConstants.POWERED_UP_LAYER_COUNT; i ++) {
            this
                .subscribeToVectorChange(device, 'PoweredUp.Layer' + i + '.Tilt',  i)
                .subscribeToVectorChange(device, 'PoweredUp.Layer' + i + '.Accel', i);
            for (let j = 0; j < POWERED_UP_STATE_RECORD_SIZE; j++) {
                vmData.setNumberAtOffset(0, this._writeOffset + i * POWERED_UP_STATE_RECORD_SIZE + j);
            }
        }
        this._subscribed = true;
        return this;
    }

    run(commandId) {
        let vmData = this._vmData;
        let vm     = this._vm;
        let device = this._device();
        switch (commandId) {
            case poweredUpModuleConstants.POWERED_UP_START:
                this._writeOffset = vmData.getRegSrc();
                this
                    .subscribe(device)
                    .emit('PoweredUp.Start', {});
                break;
        }
    }
};
