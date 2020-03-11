/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const soundModuleConstants = require('../../../../shared/vm/modules/soundModuleConstants');
const VMModule             = require('./../VMModule').VMModule;

exports.SoundModule = class extends VMModule {
    run(commandId) {
        let vmData = this._vmData;
        let vm     = this._vm;
        switch (commandId) {
            case soundModuleConstants.SOUND_PLAY_TONE:
                let playTone = vmData.getRecordFromSrcOffset(['frequency', 'duration', 'volume']);
                this._device().module(soundModuleConstants.MODULE_SOUND, soundModuleConstants.SOUND_PLAY_TONE, playTone);
                vm.sleep(playTone.duration);
                this.emit('Sound.PlayTone', playTone);
                break;
        }
    }
};
