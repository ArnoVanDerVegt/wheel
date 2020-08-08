/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentIconModuleConstants = require('../../../../../shared/vm/modules/components/componentIconModuleConstants');
const dispatcher                   = require('../../../../lib/dispatcher').dispatcher;
const VMModule                     = require('./../../VMModule').VMModule;

exports.ComponentIconModule = class extends VMModule {
    run(commandId) {
        let vmData       = this._vmData;
        let vm           = this._vm;
        let property     = '';
        let propertyType = 'number';
        let image        = null;
        let opts         = {};
        switch (commandId) {
            case componentIconModuleConstants.ICON_SET_HIDDEN: property = 'hidden'; break;
            case componentIconModuleConstants.ICON_SET_X:      property = 'x';      break;
            case componentIconModuleConstants.ICON_SET_Y:      property = 'y';      break;
        }
        if (property !== '') {
            image = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            if (propertyType === 'string') {
                opts[property] = vmData.getStringList()[image[property]];
            } else {
                opts[property] = image[property];
            }
            dispatcher.dispatch(image.window + '_' + image.component, opts);
        }
    }
};
