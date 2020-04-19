/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentCheckboxModuleConstants = require('../../../../../shared/vm/modules/components/componentCheckboxModuleConstants');
const VMModule                         = require('./../../VMModule').VMModule;

exports.ComponentLabelModule = class extends VMModule {
    run(commandId) {
        let vmData = this._vmData;
        let vm     = this._vm;
        let form;
        switch (commandId) {
            case componentCheckboxModuleConstants.CHECKBOX_SET_TAB_INDEX:
                break;

            case componentCheckboxModuleConstants.CHECKBOX_SET_HIDDEN:
                break;

            case componentCheckboxModuleConstants.CHECKBOX_SET_DISABLED:
                break;

            case componentCheckboxModuleConstants.CHECKBOX_SET_X:
                break;

            case componentCheckboxModuleConstants.CHECKBOX_SET_Y:
                break;

            case componentCheckboxModuleConstants.CHECKBOX_SET_TITLE:
                break;

            case componentCheckboxModuleConstants.CHECKBOX_SET_CHECKED:
                break;
        }
    }
};
