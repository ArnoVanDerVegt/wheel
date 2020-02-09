/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const lightModuleConstants = require('../../../../shared/vm/modules/lightModuleConstants');
const VMModule             = require('./../VMModule').VMModule;

exports.LightModule = class extends VMModule {
    run(commandId) {
        let vmData = this._vmData;
        let vm     = this._vm;
        switch (commandId) {
            case lightModuleConstants.LIGHT_UPDATE:
                this.emit('Light.Light', vmData.getRecordFromAtOffset(['layer', 'color']));
                break;
        }
    }
};
