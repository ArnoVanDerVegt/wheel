/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentButtonModuleConstants = require('../../../../../shared/vm/modules/components/componentButtonModuleConstants');
const VMModule                       = require('./../../VMModule').VMModule;

exports.ComponentButtonModule = class extends VMModule {
    run(commandId) {
        let vmData = this._vmData;
        let vm     = this._vm;
        let form;
        switch (commandId) {
            case componentButtonModuleConstants.BUTTON_SET_TAB_INDEX:
                break;

            case componentButtonModuleConstants.BUTTON_SET_HIDDEN:
                break;

            case componentButtonModuleConstants.BUTTON_SET_DISABLED:
                break;

            case componentButtonModuleConstants.BUTTON_SET_X:
                break;

            case componentButtonModuleConstants.BUTTON_SET_Y:
                break;

            case componentButtonModuleConstants.BUTTON_SET_COLOR:
                break;

            case componentButtonModuleConstants.BUTTON_SET_VALUE:
                break;

            case componentButtonModuleConstants.BUTTON_SET_TITLE:
                break;
        }
    }
};
