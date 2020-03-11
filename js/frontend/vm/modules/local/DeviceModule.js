/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const deviceModuleConstants = require('../../../../shared/vm/modules/deviceModuleConstants');
const VMModule              = require('./../VMModule').VMModule;

exports.DeviceModule = class extends VMModule {
    run(commandId) {
        let vmData = this._vmData;
        let vm     = this._vm;
        switch (commandId) {
            case deviceModuleConstants.DEVICE_SELECT:
                this.emit('Device.Select', vmData.getRecordFromSrcOffset(['device']));
                break;
        }
    }
};
