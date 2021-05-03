/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentCheckboxModuleConstants = require('../../../../../shared/vm/modules/components/componentCheckboxModuleConstants');
const dispatcher                       = require('../../../../lib/dispatcher').dispatcher;
const VMIDEModule                      = require('./../../VMIDEModule').VMIDEModule;

exports.ComponentCheckboxModule = class extends VMIDEModule {
    run(commandId) {
        let vmData       = this._vmData;
        let vm           = this._vm;
        let property     = '';
        let propertyType = 'number';
        let checkbox     = null;
        let opts         = {};
        let component;
        switch (commandId) {
            case componentCheckboxModuleConstants.CHECKBOX_SET_HIDDEN:    property = 'hidden';                             break;
            case componentCheckboxModuleConstants.CHECKBOX_SET_DISABLED:  property = 'disabled';                           break;
            case componentCheckboxModuleConstants.CHECKBOX_SET_X:         property = 'x';                                  break;
            case componentCheckboxModuleConstants.CHECKBOX_SET_Y:         property = 'y';                                  break;
            case componentCheckboxModuleConstants.CHECKBOX_SET_TEXT:      property = 'text';      propertyType = 'string'; break;
            case componentCheckboxModuleConstants.CHECKBOX_SET_HINT:      property = 'title';     propertyType = 'string'; break;
            case componentCheckboxModuleConstants.CHECKBOX_SET_CHECKED:   property = 'checked';                            break;
            case componentCheckboxModuleConstants.CHECKBOX_GET_VALUE:
                opts      = vmData.getRecordFromSrcOffset(['window', 'component']);
                component = this.getComponent(opts.window, opts.component);
                if (component) {
                    vmData.setNumberAtRet(component.getValue() ? 1 : 0);
                }
                break;
        }
        if (property !== '') {
            checkbox = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            if (propertyType === 'string') {
                opts[property] = vmData.getStringList()[checkbox[property]];
            } else {
                opts[property] = checkbox[property];
            }
            dispatcher.dispatch(checkbox.window + '_' + checkbox.component, opts);
        }
    }
};
