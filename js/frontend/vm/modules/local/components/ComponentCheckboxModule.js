/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentCheckboxModuleConstants = require('../../../../../shared/vm/modules/components/componentCheckboxModuleConstants');
const VMModule                         = require('./../../VMModule').VMModule;
const dispatcher                       = require('../../../../lib/dispatcher').dispatcher;

exports.ComponentCheckboxModule = class extends VMModule {
    run(commandId) {
        let vmData   = this._vmData;
        let vm       = this._vm;
        let property = '';
        let checkbox = null;
        let opts     = {};
        switch (commandId) {
            case componentCheckboxModuleConstants.CHECKBOX_SET_TAB_INDEX: property = 'tabIndex';  break;
            case componentCheckboxModuleConstants.CHECKBOX_SET_HIDDEN:    property = 'hidden';    break;
            case componentCheckboxModuleConstants.CHECKBOX_SET_DISABLED:  property = 'disabled';  break;
            case componentCheckboxModuleConstants.CHECKBOX_SET_X:         property = 'x';         break;
            case componentCheckboxModuleConstants.CHECKBOX_SET_Y:         property = 'y';         break;
            case componentCheckboxModuleConstants.CHECKBOX_SET_TEXT:      property = 'text';      break;
            case componentCheckboxModuleConstants.CHECKBOX_SET_HINT:      property = 'title';     break;
            case componentCheckboxModuleConstants.CHECKBOX_SET_CHECKED:   property = 'checked';   break;
        }
        if (property !== '') {
            checkbox       = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            opts[property] = checkbox[property];
            dispatcher.dispatch(checkbox.window + '_' + checkbox.component, opts);
        }
    }
};
