/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const spikeModuleConstants = require('../../../../shared/vm/modules/spikeModuleConstants');
const VMModule             = require('./../VMModule').VMModule;

exports.SpikeModule = class extends VMModule {
    run(commandId) {
        let vmData = this._vmData;
        let vm     = this._vm;
        switch (commandId) {
            case spikeModuleConstants.SPIKE_UP_START:
                this.emit('Spike.Start', vmData.getRegSrc());
                let offset = vmData.getRegSrc();
                // Button:        1
                // Tilt vector:   3
                // Accell vector: 3
                for (let i = 0; i < spikeModuleConstants.SPIKE_LAYER_COUNT * (3 + 3 + 1); i++) {
                    vmData.setGlobalNumber(offset + i, 0);
                }
                break;
            case spikeModuleConstants.SPIKE_CLEAR_LEDS:
                this.emit('Spike.ClearLeds', vmData.getRecordFromSrcOffset(['layer']));
                break;
            case spikeModuleConstants.SPIKE_SET_LED:
                this.emit('Spike.SetLed', vmData.getRecordFromSrcOffset(['layer', 'x', 'y', 'brightness']));
                break;
        }
    }
};
