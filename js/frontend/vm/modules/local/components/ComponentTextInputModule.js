/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentTextInputModuleConstants = require('../../../../../shared/vm/modules/components/componentTextInputModuleConstants');
const dispatcher                        = require('../../../../lib/dispatcher').dispatcher;
const VMModule                          = require('./../../VMModule').VMModule;

exports.ComponentTextInputModule = class extends VMModule {
    run(commandId) {
        let vmData       = this._vmData;
        let vm           = this._vm;
        let property     = '';
        let propertyType = 'number';
        let checkbox     = null;
        let opts         = {};
        switch (commandId) {
            case componentTextInputModuleConstants.TEXT_INPUT_SET_HIDDEN:       property = 'hidden';                               break;
            case componentTextInputModuleConstants.TEXT_INPUT_SET_DISABLED:     property = 'disabled';                             break;
            case componentTextInputModuleConstants.TEXT_INPUT_SET_X:            property = 'x';                                    break;
            case componentTextInputModuleConstants.TEXT_INPUT_SET_Y:            property = 'y';                                    break;
            case componentTextInputModuleConstants.TEXT_INPUT_SET_TEXT_VALUE:   property = 'text';        propertyType = 'string'; break;
            case componentTextInputModuleConstants.TEXT_INPUT_SET_NUMBER_VALUE: property = 'number';                               break;
            case componentTextInputModuleConstants.TEXT_INPUT_SET_PLACE_HOLDER: property = 'placeHolder'; propertyType = 'string'; break;
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
