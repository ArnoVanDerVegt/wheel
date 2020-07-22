/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentTextModuleConstants = require('../../../../../shared/vm/modules/components/componentTextModuleConstants');
const dispatcher                   = require('../../../../lib/dispatcher').dispatcher;
const VMModule                     = require('./../../VMModule').VMModule;

exports.ComponentTextModule = class extends VMModule {
    run(commandId) {
        let vmData       = this._vmData;
        let vm           = this._vm;
        let property     = '';
        let propertyType = 'number';
        let text         = null;
        let opts         = {};
        switch (commandId) {
            case componentTextModuleConstants.TEXT_SET_HIDDEN: property = 'hidden';                            break;
            case componentTextModuleConstants.TEXT_SET_X:      property = 'x';                                 break;
            case componentTextModuleConstants.TEXT_SET_Y:      property = 'y';                                 break;
            case componentTextModuleConstants.TEXT_SET_TEXT:   property = 'text';     propertyType = 'string'; break;
        }
        if (property !== '') {
            text = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            if (propertyType === 'string') {
                opts[property] = vmData.getStringList()[text[property]];
            } else {
                opts[property] = text[property];
            }
            dispatcher.dispatch(text.window + '_' + text.component, opts);
        }
    }
};
