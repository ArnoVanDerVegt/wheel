/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const soundModuleConstants = require('../../vm/modules/soundModuleConstants');
const BrickModule          = require('./BrickModule').BrickModule;

exports.SoundModule = class extends BrickModule {
    run(commandId, data) {
        switch (commandId) {
            case soundModuleConstants.SOUND_PLAY_TONE:
                this._brick.playtone(data.frequency, data.duration, data.volume);
                break;
        }
    }
};
