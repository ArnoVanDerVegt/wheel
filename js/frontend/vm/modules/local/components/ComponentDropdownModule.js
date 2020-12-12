/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentDropdownModuleConstants = require('../../../../../shared/vm/modules/components/componentDropdownModuleConstants');
const dispatcher                       = require('../../../../lib/dispatcher').dispatcher;
const VMIDEModule                      = require('./../../VMIDEModule').VMIDEModule;

exports.ComponentDropdownModule = class extends VMIDEModule {
    run(commandId) {
        let vmData   = this._vmData;
        let vm       = this._vm;
        let property = '';
        let dropdown = null;
        let opts     = {};
        let component;
        switch (commandId) {
            case componentDropdownModuleConstants.DROPDOWN_SET_HIDDEN:    property = 'hidden';   break;
            case componentDropdownModuleConstants.DROPDOWN_SET_DISABLED:  property = 'disabled'; break;
            case componentDropdownModuleConstants.DROPDOWN_SET_X:         property = 'x';        break;
            case componentDropdownModuleConstants.DROPDOWN_SET_Y:         property = 'y';        break;
            case componentDropdownModuleConstants.DROPDOWN_SET_VALUE:     property = 'value';    break;
            case componentDropdownModuleConstants.DROPDOWN_GET_VALUE:
                opts      = vmData.getRecordFromSrcOffset(['window', 'component']);
                component = this.getComponent(opts.window, opts.component);
                if (component) {
                    let n = parseInt(component.getValue(), 10);
                    if (!isNaN(n)) {
                        vmData.setNumberAtRet(n);
                    }
                }
                break;
            case componentDropdownModuleConstants.DROPDOWN_ADD_ITEM:
                dropdown = vmData.getRecordFromSrcOffset(['window', 'component', 'value', 'text']);
                dispatcher.dispatch(dropdown.window + '_' + dropdown.component, {value: dropdown.value, text: vmData.getStringList()[dropdown.text]});
            case componentDropdownModuleConstants.DROPDOWN_CLEAR:
                dropdown   = vmData.getRecordFromSrcOffset(['window', 'component']);
                opts.clear = true;
                dispatcher.dispatch(dropdown.window + '_' + dropdown.component, opts);
                break;
        }
        if (property !== '') {
            dropdown       = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            opts[property] = dropdown[property];
            dispatcher.dispatch(dropdown.window + '_' + dropdown.component, opts);
        }
    }
};
