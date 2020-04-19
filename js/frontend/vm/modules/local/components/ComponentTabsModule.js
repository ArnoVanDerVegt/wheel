/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentTabsModuleConstants = require('../../../../../shared/vm/modules/components/componentTabsModuleConstants');
const VMModule                     = require('./../../VMModule').VMModule;

exports.ComponentTabsModule = class extends VMModule {
    run(commandId) {
        let vmData = this._vmData;
        let vm     = this._vm;
        let form;
        switch (commandId) {
            case componentTabsModuleConstants.TABS_SET_TAB_INDEX:
                break;

            case componentTabsModuleConstants.TABS_SET_HIDDEN:
                break;

            case componentTabsModuleConstants.TABS_SET_DISABLED:
                break;

            case componentTabsModuleConstants.TABS_SET_X:
                break;

            case componentTabsModuleConstants.TABS_SET_Y:
                break;

            case componentTabsModuleConstants.TABS_SET_ACTIVE:
                break;
        }
    }
};
