/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentLabelModuleConstants = require('../../../../../shared/vm/modules/components/componentLabelModuleConstants');
const VMModule                      = require('./../../VMModule').VMModule;

exports.ComponentLabelModule = class extends VMModule {
    run(commandId) {
        let vmData = this._vmData;
        let vm     = this._vm;
        let form;
        switch (commandId) {
            case componentLabelModuleConstants.LABEL_SET_TAB_INDEX:
                break;

            case componentLabelModuleConstants.LABEL_SET_HIDDEN:
                break;

            case componentLabelModuleConstants.LABEL_SET_X:
                break;

            case componentLabelModuleConstants.LABEL_SET_Y:
                break;

            case componentLabelModuleConstants.LABEL_SET_TEXT:
                break;
        }
    }
};
