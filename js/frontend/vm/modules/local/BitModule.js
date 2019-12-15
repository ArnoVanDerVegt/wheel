/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const bitModuleConstants = require('../../../../shared/vm/modules/bitModuleConstants');
const VMModule           = require('./../VMModule').VMModule;

exports.BitModule = class extends VMModule {
    run(commandId) {
        let vmData = this._vmData;
        switch (commandId) {
            case bitModuleConstants.BIT_BIT_OR:
                let bitOr = vmData.getRecordFromAtOffset(['value1', 'value2']);
                vmData.setNumberAtRet(~~bitOr.value1 | ~~bitOr.value2);
                break;
            case bitModuleConstants.BIT_BIT_AND:
                let bitAnd = vmData.getRecordFromAtOffset(['value1', 'value2']);
                vmData.setNumberAtRet(~~bitAnd.value1 & ~~bitAnd.value2);
                break;
            case bitModuleConstants.BIT_TO_BIT:
                let toBit = vmData.getRecordFromAtOffset(['value']);
                vmData.setNumberAtRet((toBit.value !== 0) ? 1 : 0);
                break;
            case bitModuleConstants.BIT_TO_BIT_NOT:
                let toBitNot = vmData.getRecordFromAtOffset(['value']);
                vmData.setNumberAtRet((toBitNot.value !== 0) ? 0 : 1);
                break;
            case bitModuleConstants.BIT_SHL:
                let bitShl = vmData.getRecordFromAtOffset(['value1', 'value2']);
                vmData.setNumberAtRet(bitShl.value1 << bitShl.value2);
                break;
            case bitModuleConstants.BIT_SHR:
                let bitShr = vmData.getRecordFromAtOffset(['value1', 'value2']);
                vmData.setNumberAtRet(bitShr.value1 >> bitShr.value2);
                break;
        }
    }
};
