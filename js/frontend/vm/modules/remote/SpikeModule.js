/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const spikeModuleConstants = require('../../../../shared/vm/modules/spikeModuleConstants');
const LocalSpikeModule     = require('../local/SpikeModule').SpikeModule;

/*|
 *| record SpikeVector
 *|     number x, y, z
 *| end
 *|
 *| record SpikeState
 *|     number       button
 *|     SpikepVector tilt
 *|     SpikeVector accel
 *| end
 *|
 *| SpikeState spikeState[4]
*/

exports.SpikeModule = class extends LocalSpikeModule {
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
            case spikeModuleConstants.SPIKE_START:
                this._writeOffset = vmData.getRegSrc();
                this.emit('Spike.Start', {});
                for (let i = 0; i < spikeModuleConstants.SPIKE_LAYER_COUNT; i ++) {
                    this.subscribeToTilt(device,  'Spike.Layer' + i + 'Tilt',  i);
                    this.subscribeToAccel(device, 'Spike.Layer' + i + 'Accel', i);
                    for (let j = 0; j < 7; j++) {
                        vmData.setNumberAtOffset(0, this._writeOffset + i * 7 + j);
                    }
                }
                break;
            case spikeModuleConstants.SPIKE_CLEAR_LEDS:
                this.emit('Spike.ClearLeds', vmData.getRecordFromSrcOffset(['layer']));
                break;
            case spikeModuleConstants.SPIKE_SET_LED:
                let led = vmData.getRecordFromSrcOffset(['layer', 'x', 'y', 'brightness']);
                this.emit('Spike.SetLed', led);
                this._device().module(spikeModuleConstants.MODULE_SPIKE, commandId, led);
                break;
        }
    }
};
