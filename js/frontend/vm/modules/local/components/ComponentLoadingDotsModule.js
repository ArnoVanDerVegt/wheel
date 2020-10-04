/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentLoadingDotsModuleConstants = require('../../../../../shared/vm/modules/components/componentLoadingDotsModuleConstants');
const dispatcher                          = require('../../../../lib/dispatcher').dispatcher;
const VMModule                            = require('./../../VMModule').VMModule;

exports.ComponentLoadingDotsModule = class extends VMModule {
    run(commandId) {
        let vmData       = this._vmData;
        let vm           = this._vm;
        let property     = '';
        let propertyType = 'number';
        let loadingDots  = null;
        let opts         = {};
        switch (commandId) {
            case componentLoadingDotsModuleConstants.LOADING_DOTS_SET_HIDDEN: property = 'hidden'; break;
            case componentLoadingDotsModuleConstants.LOADING_DOTS_SET_X:      property = 'x';      break;
            case componentLoadingDotsModuleConstants.LOADING_DOTS_SET_Y:      property = 'y';      break;
        }
        if (property !== '') {
            loadingDots = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            if (propertyType === 'string') {
                opts[property] = vmData.getStringList()[loadingDots[property]];
            } else {
                opts[property] = loadingDots[property];
            }
            dispatcher.dispatch(loadingDots.window + '_' + loadingDots.component, opts);
        }
    }
};
