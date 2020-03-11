/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const stringModuleConstants = require('../../../../shared/vm/modules/stringModuleConstants');
const $                     = require('../../../program/commands');
const VMModule              = require('./../VMModule').VMModule;

exports.StringModule = class extends VMModule {
    run(commandId) {
        let vmData   = this._vmData;
        let vm       = this._vm;
        let offset   = 0;
        let regStack = vmData.getGlobalNumber($.REG_STACK);
        let regSrc;
        let regDest;
        let regPtr;
        let s1;
        let s2;
        switch (commandId) {
            case stringModuleConstants.STRING_ALLOCATE_STRING:
                offset = regStack;
            case stringModuleConstants.STRING_ALLOCATE_GLOBAL_STRING:
                regSrc = vmData.getGlobalNumber($.REG_SRC);          // Number of strings to allocate
                regPtr = vmData.getGlobalNumber($.REG_PTR) + offset; // Location of the actual string pointer
                for (let i = 0; i < regSrc; i++) {
                    vmData.setGlobalNumber(regPtr + i, vmData.allocateString());
                }
                break;
            case stringModuleConstants.STRING_RELEASE_STRING:
                regSrc = vmData.getGlobalNumber($.REG_SRC); // Number of strings to release
                for (let i = 0; i < regSrc; i++) {
                    vmData.releaseString();
                }
                break;
            case stringModuleConstants.STRING_NUMBER_TO_STRING:
                let numberToString = vmData.getRecordFromSrcOffset(['n', 's']);
                vmData.getStringList()[numberToString.s] = numberToString.n + '';
                break;
            case stringModuleConstants.STRING_STRING_TO_NUMBER:
                let stringToNumber = vmData.getRecordFromSrcOffset(['s']);
                vmData.setNumberAtRet(parseFloat(vmData.getStringList()[stringToNumber.s], 10));
                break;
            case stringModuleConstants.STRING_INDEX_OF:
                let indexOf  = vmData.getRecordFromSrcOffset(['haystack', 'needle', 'startIndex']);
                let haystack = vmData.getStringList()[indexOf.haystack];
                let needle   = vmData.getStringList()[indexOf.needle];
                vmData.setNumberAtRet(haystack.indexOf(needle, indexOf.startIndex));
                break;
            case stringModuleConstants.STRING_SUB_STRING:
                let subString  = vmData.getRecordFromSrcOffset(['s', 'start', 'length', 'result']);
                s1 = vmData.getStringList()[subString.s];
                vmData.getStringList()[subString.result] = s1.substr(subString.start, subString.length);
                break;
            case stringModuleConstants.STRING_LENGTH:
                let stringLength = vmData.getRecordFromSrcOffset(['s']);
                vmData.setNumberAtRet(vmData.getStringList()[stringLength.s].length, 1);
                break;
            case stringModuleConstants.STRING_EQUAL:
                let stringEqual = vmData.getRecordFromSrcOffset(['s1', 's2']);
                s1 = vmData.getStringList()[stringEqual.s1];
                s2 = vmData.getStringList()[stringEqual.s2];
                vmData.setNumberAtRet(s1 === s2 ? 1 : 0, 2);
                break;
            case stringModuleConstants.STRING_TO_UPPER_CASE:
                let toUpperCase = vmData.getRecordFromSrcOffset(['s']);
                vmData.getStringList()[toUpperCase.s] = (vmData.getStringList()[toUpperCase.s] || '').toUpperCase();
                break;
            case stringModuleConstants.STRING_TO_LOWER_CASE:
                let toLowerCase = vmData.getRecordFromSrcOffset(['s']);
                vmData.getStringList()[toLowerCase.s] = (vmData.getStringList()[toLowerCase.s] || '').toLowerCase();
                break;
            case stringModuleConstants.STRING_GET_CHAR_CODE_AT:
                let getCharCodeAt = vmData.getRecordFromSrcOffset(['s', 'index']);
                vmData.setNumberAtRet(vmData.getStringList()[getCharCodeAt.s].charCodeAt(getCharCodeAt.index), 2);
                break;
            case stringModuleConstants.STRING_SET_CHAR_CODE_AT:
                let setCharCodeAt = vmData.getRecordFromSrcOffset(['s', 'index', 'charCode']);
                s2 = vmData.getStringList()[setCharCodeAt.s].split('');
                if ((setCharCodeAt.index >= 0) && (setCharCodeAt.index < s2.length)) {
                    s2[setCharCodeAt.index]                 = String.fromCharCode(setCharCodeAt.charCode);
                    vmData.getStringList()[setCharCodeAt.s] = s2.join('');
                }
                break;
        }
    }
};
