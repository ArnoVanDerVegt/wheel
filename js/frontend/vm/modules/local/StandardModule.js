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
    constructor(opts) {
        super(opts);
        this._format       = null;
        this._formatValues = [];
    }

    setFormatString(formatString) {
        this._format = {
            parts:  [],
            values: []
        };
        let format = {parts: [], values: []};
        let part   = '';
        let i      = 0;
        while (i < formatString.length) {
            let c = formatString[i++];
            if (c === '%') {
                if (part !== '') {
                    format.parts.push(part);
                    part = '';
                }
                c = formatString[i++];
                let value = {type: '', align: false, value: ''};
                switch (c) {
                    case 'n':
                        value.type = 'number';
                        break;
                    case 'N':
                        value.type  = 'number';
                        value.align = 'true';
                        break;
                    case 's':
                        value.type = 'string';
                        break;
                    default:
                        value.type = '?';
                        break;
                }
                format.parts.push(value);
                format.values.push(value);
            } else {
                part += c;
            }
        }
        if (part !== '') {
            format.parts.push(part);
        }
        this._formatValues.length = 0;
        this._format              = format;
    }

    printFormattedString() {
        this._formatValues.forEach((value, index) => {
            this._format.values[index].value = value;
        });
        let s = '';
        this._format.parts.forEach((part, index) => {
            if (typeof part === 'string') {
                s += part;
            } else {
                if (part.align) {
                    let n = part.value + '';
                    s += ('_______' + n).substr(-7);
                } else {
                    s += part.value;
                }
            }
        });
        this.emit(
            'Console.Log',
            {
                type:    SettingsState.CONSOLE_MESSAGE_TYPE_INFO,
                message: s, pos: {lineNumber: 0, filename: ''}
            }
        );
    }

    printN(n) {
        let format       = this._format;
        let formatValues = this._formatValues;
        if (format) {
            if (format.values[formatValues.length].type === 'number') {
                formatValues.push(n);
            } else {
                formatValues.push('?');
            }
            if (formatValues.length === format.values.length) {
                this.printFormattedString();
                formatValues.length = 0;
            }
        } else {
            this.emit(
                'Console.Log',
                {
                    type:    SettingsState.CONSOLE_MESSAGE_TYPE_INFO,
                    message: n, pos: {lineNumber: 0, filename: ''}
                }
            );
        }
    }

    printS(s) {
        let format       = this._format;
        let formatValues = this._formatValues;
        if (format) {
            if (format.values[formatValues.length].type === 'string') {
                formatValues.push(s);
            } else {
                formatValues.push('?');
            }
            if (formatValues.length === format.values.length) {
                this.printFormattedString();
                formatValues.length = 0;
            }
        } else {
            this.emit(
                'Console.Log',
                {
                    type:    SettingsState.CONSOLE_MESSAGE_TYPE_INFO,
                    message: sanitizeString(s),
                    pos:     {lineNumber: 0, filename: ''}
                }
            );
        }
    }

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
                this.printN(vmData.getRecordFromSrcOffset(['n']).n);
                break;
            case standardModuleConstants.STANDARD_PRINT_STRING:
                this.printS(vmData.getStringList()[vmData.getRecordFromSrcOffset(['s']).s]);
                break;
            case standardModuleConstants.STANDARD_PRINT_FORMAT:
                this.setFormatString(vmData.getStringList()[vmData.getRecordFromSrcOffset(['format']).format]);
                break;
            case standardModuleConstants.STANDARD_END_FORMAT:
                this._format = null;
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
