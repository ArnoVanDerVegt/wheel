/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentRadioModuleConstants = require('../../../../../shared/vm/modules/components/componentRadioModuleConstants');
const dispatcher                    = require('../../../../lib/dispatcher').dispatcher;
const VMIDEModule                   = require('./../../VMIDEModule').VMIDEModule;

exports.ComponentRadioModule = class extends VMIDEModule {
    run(commandId) {
        let vmData   = this._vmData;
        let vm       = this._vm;
        let property = '';
        let radio    = null;
        let opts     = {};
        let component;
        switch (commandId) {
            case componentRadioModuleConstants.RADIO_SET_HIDDEN:   property = 'hidden';   break;
            case componentRadioModuleConstants.RADIO_SET_DISABLED: property = 'disabled'; break;
            case componentRadioModuleConstants.RADIO_SET_X:        property = 'x';        break;
            case componentRadioModuleConstants.RADIO_SET_Y:        property = 'y';        break;
            case componentRadioModuleConstants.RADIO_SET_VALUE:    property = 'value';    break;
            case componentRadioModuleConstants.RADIO_GET_VALUE:
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
            radio          = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            opts[property] = radio[property];
            dispatcher.dispatch(radio.window + '_' + radio.component, opts);
        }
    }
};
