/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentTitleModuleConstants = require('../../../../../shared/vm/modules/components/componentTitleModuleConstants');
const dispatcher                    = require('../../../../lib/dispatcher').dispatcher;
const VMModule                      = require('./../../VMModule').VMModule;

exports.ComponentTitleModule = class extends VMModule {
    run(commandId) {
        let vmData       = this._vmData;
        let vm           = this._vm;
        let property     = '';
        let propertyType = 'number';
        let title        = null;
        let opts         = {};
        switch (commandId) {
            case componentTitleModuleConstants.TITLE_SET_HIDDEN: property = 'hidden';                            break;
            case componentTitleModuleConstants.TITLE_SET_X:      property = 'x';                                 break;
            case componentTitleModuleConstants.TITLE_SET_Y:      property = 'y';                                 break;
            case componentTitleModuleConstants.TITLE_SET_TEXT:   property = 'text';     propertyType = 'string'; break;
        }
        if (property !== '') {
            title = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            if (propertyType === 'string') {
                opts[property] = vmData.getStringList()[title[property]];
            } else {
                opts[property] = title[property];
            }
            dispatcher.dispatch(title.window + '_' + title.component, opts);
        }
    }
};
