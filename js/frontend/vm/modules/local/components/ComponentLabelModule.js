/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentLabelModuleConstants = require('../../../../../shared/vm/modules/components/componentLabelModuleConstants');
const VMModule                      = require('./../../VMModule').VMModule;
const dispatcher                    = require('../../../../lib/dispatcher').dispatcher;

exports.ComponentLabelModule = class extends VMModule {
    run(commandId) {
        let vmData   = this._vmData;
        let vm       = this._vm;
        let property = '';
        let label    = null;
        let opts     = {};
        switch (commandId) {
            case componentLabelModuleConstants.LABEL_SET_TAB_INDEX: property = 'tabIndex'; break;
            case componentLabelModuleConstants.LABEL_SET_HIDDEN:    property = 'hidden';   break;
            case componentLabelModuleConstants.LABEL_SET_X:         property = 'x';        break;
            case componentLabelModuleConstants.LABEL_SET_Y:         property = 'y';        break;
            case componentLabelModuleConstants.LABEL_SET_TEXT:      property = 'text';     break;
            case componentLabelModuleConstants.LABEL_SET_NUMBER:    property = 'number';   break;
        }
        if (property !== '') {
            label          = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            opts[property] = label[property];
            dispatcher.dispatch(label.window + '_' + label.component, opts);
        }
    }
};
