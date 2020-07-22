/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentListItemsModuleConstants = require('../../../../../shared/vm/modules/components/componentListItemsModuleConstants');
const dispatcher                        = require('../../../../lib/dispatcher').dispatcher;
const VMModule                          = require('./../../VMModule').VMModule;

exports.ComponentListItemsModule = class extends VMModule {
    run(commandId) {
        let vmData    = this._vmData;
        let vm        = this._vm;
        let property  = '';
        let listItems = null;
        let opts      = {};
        switch (commandId) {
            case componentListItemsModuleConstants.LIST_ITEMS_SET_HIDDEN: property = 'hidden'; break;
            case componentListItemsModuleConstants.LIST_ITEMS_SET_X:      property = 'x';      break;
            case componentListItemsModuleConstants.LIST_ITEMS_SET_Y:      property = 'y';      break;
        }
        if (property !== '') {
            listItems      = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            opts[property] = listItems[property];
            dispatcher.dispatch(listItems.window + '_' + listItems.component, opts);
        }
    }
};
