/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentLabelModuleConstants = require('../../../../../shared/vm/modules/components/componentLabelModuleConstants');
const dispatcher                    = require('../../../../lib/dispatcher').dispatcher;
const VMModule                      = require('./../../VMModule').VMModule;

exports.ComponentLabelModule = class extends VMModule {
    run(commandId) {
        let vmData       = this._vmData;
        let vm           = this._vm;
        let property     = '';
        let propertyType = 'number';
        let label        = null;
        let opts         = {};
        switch (commandId) {
            case componentLabelModuleConstants.LABEL_SET_HIDDEN:       property = 'hidden';                            break;
            case componentLabelModuleConstants.LABEL_SET_X:            property = 'x';                                 break;
            case componentLabelModuleConstants.LABEL_SET_Y:            property = 'y';                                 break;
            case componentLabelModuleConstants.LABEL_SET_FONT_SIZE:    property = 'fontSize';                          break;
            case componentLabelModuleConstants.LABEL_SET_TEXT:         property = 'text';     propertyType = 'string'; break;
            case componentLabelModuleConstants.LABEL_SET_VALUE_NUMBER: property = 'value';                             break;
            case componentLabelModuleConstants.LABEL_SET_VALUE_STRING: property = 'value';    propertyType = 'string'; break;
        }
        if (property !== '') {
            label = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            if (propertyType === 'string') {
                opts[property] = vmData.getStringList()[label[property]];
            } else {
                opts[property] = label[property];
            }
            dispatcher.dispatch(label.window + '_' + label.component, opts);
        }
    }
};
