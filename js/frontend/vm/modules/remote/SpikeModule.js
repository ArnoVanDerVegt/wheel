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
 *|     SpikepVector gyro
 *|     SpikeVector  accell
 *|     SpikeVector  pos
 *| end
 *|
 *| SpikeState spikeState[4]
**/
const SPIKE_STATE_RECORD_SIZE   = 1 + 3 + 3 + 3;
const SPIKE_STATE_GYRO_OFFSET   = 1;
const SPIKE_STATE_ACCELL_OFFSET = 1 + 3;
const SPIKE_STATE_POS_OFFSET    = 1 + 3 + 3;

exports.SpikeModule = class extends LocalSpikeModule {
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
                let o = this._writeOffset + layer * SPIKE_STATE_RECORD_SIZE + offset;
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
        for (let i = 0; i < spikeModuleConstants.SPIKE_LAYER_COUNT; i ++) {
            this.
                subscribeToVectorChange(device, 'Spike.Layer' + i + '.Gyro',   i, SPIKE_STATE_GYRO_OFFSET)
                subscribeToVectorChange(device, 'Spike.Layer' + i + '.Accell', i, SPIKE_STATE_ACCELL_OFFSET)
                subscribeToVectorChange(device, 'Spike.Layer' + i + '.Pos',    i, SPIKE_STATE_POS_OFFSET);
            for (let j = 0; j < SPIKE_STATE_RECORD_SIZE; j++) {
                vmData.setNumberAtOffset(0, this._writeOffset + i * SPIKE_STATE_RECORD_SIZE + j);
            }
        }
        this._subscribed = true;
        return this;
    }

    run(commandId) {
        let vmData = this._vmData;
        let vm     = this._vm;
        let device = this._device();
        let led;
        switch (commandId) {
            case spikeModuleConstants.SPIKE_LAYER_START:
                this._writeOffset = vmData.getRegSrc();
                this
                    .subscribe(device)
                    .emit('Spike.Start', {});
                break;
            case spikeModuleConstants.SPIKE_LAYER_CLEAR_LEDS:
                led = vmData.getRecordFromSrcOffset(['layer']);
                this._device().module(spikeModuleConstants.MODULE_SPIKE, commandId, led);
                this.emit('Spike.MatrixClearLeds', led);
                break;
            case spikeModuleConstants.SPIKE_LAYER_SET_LED:
                led = vmData.getRecordFromSrcOffset(['layer', 'x', 'y', 'brightness']);
                this._device().module(spikeModuleConstants.MODULE_SPIKE, commandId, led);
                this.emit('Spike.MatrixSetLed', led);
                break;
            case spikeModuleConstants.SPIKE_LAYER_SET_TEXT:
                led      = vmData.getRecordFromSrcOffset(['layer', 'text']);
                led.text = vmData.getStringList()[led.text];
                this._device().module(spikeModuleConstants.MODULE_SPIKE, commandId, led);
                this.emit('Spike.MatrixSetText', led);
                break;
        }
    }
};
