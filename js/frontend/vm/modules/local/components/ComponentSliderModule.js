/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentSliderModuleConstants = require('../../../../../shared/vm/modules/components/componentSliderModuleConstants');
const dispatcher                     = require('../../../../lib/dispatcher').dispatcher;
const VMIDEModule                    = require('./../../VMIDEModule').VMIDEModule;

exports.ComponentSliderModule = class extends VMIDEModule {
    run(commandId) {
        let vmData       = this._vmData;
        let vm           = this._vm;
        let property     = '';
        let propertyType = 'number';
        let checkbox     = null;
        let opts         = {};
        let component;
        switch (commandId) {
            case componentSliderModuleConstants.SLIDER_SET_HIDDEN:   property = 'hidden';   break;
            case componentSliderModuleConstants.SLIDER_SET_DISABLED: property = 'disabled'; break;
            case componentSliderModuleConstants.SLIDER_SET_X:        property = 'x';        break;
            case componentSliderModuleConstants.SLIDER_SET_Y:        property = 'y';        break;
            case componentSliderModuleConstants.SLIDER_SET_VALUE:    property = 'value';    break;
            case componentSliderModuleConstants.SLIDER_GET_VALUE:
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
            checkbox       = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            opts[property] = checkbox[property];
            dispatcher.dispatch(checkbox.window + '_' + checkbox.component, opts);
        }
    }
};
