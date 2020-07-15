/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentSliderModuleConstants = require('../../../../../shared/vm/modules/components/componentSliderModuleConstants');
const dispatcher                     = require('../../../../lib/dispatcher').dispatcher;
const VMModule                       = require('./../../VMModule').VMModule;

exports.ComponentSliderModule = class extends VMModule {
    run(commandId) {
        let vmData       = this._vmData;
        let vm           = this._vm;
        let property     = '';
        let propertyType = 'number';
        let checkbox     = null;
        let opts         = {};
        switch (commandId) {
            case componentSliderModuleConstants.SLIDER_SET_HIDDEN:   property = 'hidden';   break;
            case componentSliderModuleConstants.SLIDER_SET_DISABLED: property = 'disabled'; break;
            case componentSliderModuleConstants.SLIDER_SET_X:        property = 'x';        break;
            case componentSliderModuleConstants.SLIDER_SET_Y:        property = 'y';        break;
            case componentSliderModuleConstants.SLIDER_SET_VALUE:    property = 'value';    break;
        }
        if (property !== '') {
            checkbox       = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            opts[property] = checkbox[property];
            dispatcher.dispatch(checkbox.window + '_' + checkbox.component, opts);
        }
    }
};
