/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentTabsModuleConstants = require('../../../../../shared/vm/modules/components/componentTabsModuleConstants');
const VMModule                     = require('./../../VMModule').VMModule;
const dispatcher                   = require('../../../../lib/dispatcher').dispatcher;

exports.ComponentTabsModule = class extends VMModule {
    run(commandId) {
        let vmData   = this._vmData;
        let vm       = this._vm;
        let property = '';
        let tabs     = null;
        let opts     = {};
        switch (commandId) {
            case componentTabsModuleConstants.TABS_SET_TAB_INDEX: property = 'tabIndex'; break;
            case componentTabsModuleConstants.TABS_SET_HIDDEN:    property = 'hidden';   break;
            case componentTabsModuleConstants.TABS_SET_DISABLED:  property = 'disabled'; break;
            case componentTabsModuleConstants.TABS_SET_X:         property = 'x';        break;
            case componentTabsModuleConstants.TABS_SET_Y:         property = 'y';        break;
            case componentTabsModuleConstants.TABS_SET_WIDTH:     property = 'width';    break;
            case componentTabsModuleConstants.TABS_SET_HEIGHT:    property = 'height';   break;
            case componentTabsModuleConstants.TABS_SET_ACTIVE:    property = 'active';   break;
        }
        if (property !== '') {
            tabs           = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            opts[property] = tabs[property];
            dispatcher.dispatch(tabs.window + '_' + tabs.component, opts);
        }
    }
};
