/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentTextInputModuleConstants = require('../../../../../shared/vm/modules/components/componentTextInputModuleConstants');
const dispatcher                        = require('../../../../lib/dispatcher').dispatcher;
const VMIDEModule                       = require('./../../VMIDEModule').VMIDEModule;

exports.ComponentTextInputModule = class extends VMIDEModule {
    run(commandId) {
        let vmData       = this._vmData;
        let vm           = this._vm;
        let property     = '';
        let propertyType = 'number';
        let checkbox     = null;
        let opts         = {};
        let component;
        switch (commandId) {
            case componentTextInputModuleConstants.TEXT_INPUT_SET_HIDDEN:       property = 'hidden';                               break;
            case componentTextInputModuleConstants.TEXT_INPUT_SET_DISABLED:     property = 'disabled';                             break;
            case componentTextInputModuleConstants.TEXT_INPUT_SET_X:            property = 'x';                                    break;
            case componentTextInputModuleConstants.TEXT_INPUT_SET_Y:            property = 'y';                                    break;
            case componentTextInputModuleConstants.TEXT_INPUT_SET_TEXT_VALUE:   property = 'text';        propertyType = 'string'; break;
            case componentTextInputModuleConstants.TEXT_INPUT_SET_NUMBER_VALUE: property = 'number';                               break;
            case componentTextInputModuleConstants.TEXT_INPUT_SET_PLACE_HOLDER: property = 'placeHolder'; propertyType = 'string'; break;
            case componentTextInputModuleConstants.TEXT_INPUT_GET_TEXT_VALUE:
                opts      = vmData.getRecordFromSrcOffset(['window', 'component', 'text']);
                component = this.getComponent(opts.window, opts.component);
                if (component) {
                    vmData.getStringList()[opts.text] = component.getValue();
                }
                break;
            case componentTextInputModuleConstants.TEXT_INPUT_GET_NUMBER_VALUE:
                opts      = vmData.getRecordFromSrcOffset(['window', 'component']);
                component = this.getComponent(opts.window, opts.component);
                if (component) {
                    let n = parseInt(component.getValue(), 10);
                    if (!isNaN(n)) {
                        vmData.setNumberAtRet(n);
                    }
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
