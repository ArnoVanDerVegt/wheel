/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentCircleModuleConstants = require('../../../../../shared/vm/modules/components/componentCircleModuleConstants');
const dispatcher                     = require('../../../../lib/dispatcher').dispatcher;
const VMModule                       = require('./../../VMModule').VMModule;

exports.ComponentCircleModule = class extends VMModule {
    run(commandId) {
        let vmData   = this._vmData;
        let vm       = this._vm;
        let property = '';
        let circle   = null;
        let opts     = {};
        switch (commandId) {
            case componentCircleModuleConstants.CIRCLE_SET_HIDDEN:        property = 'hidden';       break;
            case componentCircleModuleConstants.CIRCLE_SET_X:             property = 'x';            break;
            case componentCircleModuleConstants.CIRCLE_SET_Y:             property = 'y';            break;
            case componentCircleModuleConstants.CIRCLE_SET_RADIUS:        property = 'radius';       break;
            case componentCircleModuleConstants.CIRCLE_SET_FILL_COLOR:
                let fillColor = vmData.getRecordFromSrcOffset(['window', 'component', 'red', 'grn', 'blu']);
                let fillRgb   = {fillColor: {red: fillColor.red, grn: fillColor.grn, blu: fillColor.blu}};
                dispatcher.dispatch(fillColor.window + '_' + fillColor.component, fillRgb);
                break;
            case componentCircleModuleConstants.CIRCLE_SET_BORDER_COLOR:
                let borderColor = vmData.getRecordFromSrcOffset(['window', 'component', 'red', 'grn', 'blu']);
                let borderRgb   = {borderColor: {red: borderColor.red, grn: borderColor.grn, blu: borderColor.blu}};
                dispatcher.dispatch(borderColor.window + '_' + borderColor.component, borderRgb);
                break;
            case componentCircleModuleConstants.CIRCLE_SET_BORDER_WIDTH:  property = 'borderWidth';  break;
            case componentCircleModuleConstants.CIRCLE_SET_BORDER_RADIUS: property = 'borderRadius'; break;
        }
        if (property !== '') {
            circle      = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            opts[property] = circle[property];
            dispatcher.dispatch(circle.window + '_' + circle.component, opts);
        }
    }
};
