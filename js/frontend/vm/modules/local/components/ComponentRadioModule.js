/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentRadioModuleConstants = require('../../../../../shared/vm/modules/components/componentRadioModuleConstants');
const dispatcher                    = require('../../../../lib/dispatcher').dispatcher;
const VMModule                      = require('./../../VMModule').VMModule;

exports.ComponentRadioModule = class extends VMModule {
    run(commandId) {
        let vmData   = this._vmData;
        let vm       = this._vm;
        let property = '';
        let radio    = null;
        let opts     = {};
        switch (commandId) {
            case componentRadioModuleConstants.RADIO_SET_HIDDEN:   property = 'hidden';   break;
            case componentRadioModuleConstants.RADIO_SET_DISABLED: property = 'disabled'; break;
            case componentRadioModuleConstants.RADIO_SET_X:        property = 'x';        break;
            case componentRadioModuleConstants.RADIO_SET_Y:        property = 'y';        break;
            case componentRadioModuleConstants.RADIO_SET_VALUE:    property = 'value';    break;
        }
        if (property !== '') {
            radio          = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            opts[property] = radio[property];
            dispatcher.dispatch(radio.window + '_' + radio.component, opts);
        }
    }
};
