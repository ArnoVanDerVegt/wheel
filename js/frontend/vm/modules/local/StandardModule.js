/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const standardModuleConstants = require('../../../../shared/vm/modules/standardModuleConstants');
const dispatcher              = require('./../../../lib/dispatcher').dispatcher;
const SettingsState           = require('./../../../ide/settings/SettingsState');
const $                       = require('../../../program/commands');
const VMModule                = require('./../VMModule').VMModule;

const sanitizeString = function(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    };

exports.StandardModule = class extends VMModule {
    run(commandId) {
        let vm     = this._vm;
        let vmData = this._vmData;
        let id;
        switch (commandId) {
            case standardModuleConstants.STANDARD_RANGE_CHECK:
                let regRange0 = vmData.getGlobalNumber($.REG_RANGE0);
                let regRange1 = vmData.getGlobalNumber($.REG_RANGE1);
                if ((regRange1 < 0) || (regRange1 >= regRange0)) {
                    dispatcher.dispatch('VM.Error.Range', vm.getLastCommand(), regRange0, regRange1);
                    vm.stop();
                }
                break;
            case standardModuleConstants.STANDARD_PRINT_NUMBER:
                let printNumber = vmData.getRecordFromSrcOffset(['n']);
                this.emit(
                    'Console.Log',
                    {
                        type:    SettingsState.CONSOLE_MESSAGE_TYPE_INFO,
                        message: printNumber.n, pos: {lineNumber: 0, filename: ''}
                    }
                );
                break;
            case standardModuleConstants.STANDARD_PRINT_STRING:
                let printString = vmData.getRecordFromSrcOffset(['s']);
                this.emit(
                    'Console.Log',
                    {
                        type:    SettingsState.CONSOLE_MESSAGE_TYPE_INFO,
                        message: sanitizeString(vmData.getStringList()[printString.s]),
                        pos:     {lineNumber: 0, filename: ''}
                    }
                );
                break;
            case standardModuleConstants.STANDARD_CLEAR_CONSOLE:
                this.emit('Console.Clear');
                break;
            case standardModuleConstants.STANDARD_SLEEP:
                vm.sleep(vmData.getRecordFromSrcOffset(['time']).time);
                break;
            case standardModuleConstants.STANDARD_STOP_VM:
                vm.stop();
                break;
            case standardModuleConstants.STANDARD_STOP_PROGRAM:
                vm.stop();
                break;
            case standardModuleConstants.STANDARD_GET_TIME:
                vmData.setNumberAtRet(Date.now());
                break;
        }
    }
};
