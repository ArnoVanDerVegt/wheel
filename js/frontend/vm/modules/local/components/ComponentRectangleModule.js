/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentRectangleModuleConstants = require('../../../../../shared/vm/modules/components/componentRectangleModuleConstants');
const VMModule                          = require('./../../VMModule').VMModule;
const dispatcher                        = require('../../../../lib/dispatcher').dispatcher;

exports.ComponentRectangleModule = class extends VMModule {
    run(commandId) {
        let vmData    = this._vmData;
        let vm        = this._vm;
        let property  = '';
        let rectangle = null;
        let opts      = {};
        switch (commandId) {
            case componentRectangleModuleConstants.RECTANGLE_SET_HIDDEN:        property = 'hidden';       break;
            case componentRectangleModuleConstants.RECTANGLE_SET_X:             property = 'x';            break;
            case componentRectangleModuleConstants.RECTANGLE_SET_Y:             property = 'y';            break;
            case componentRectangleModuleConstants.RECTANGLE_SET_WIDTH:         property = 'width';        break;
            case componentRectangleModuleConstants.RECTANGLE_SET_HEIGHT:        property = 'height';       break;
            case componentRectangleModuleConstants.RECTANGLE_SET_FILL_COLOR:
                let fillColor = vmData.getRecordFromSrcOffset(['window', 'component', 'red', 'grn', 'blu']);
                let fillRgb   = {red: fillColor.red, grn: fillColor.grn, blu: fillColor.blu};
                dispatcher.dispatch(fillColor.window + '_' + fillColor.component, fillRgb);
                break;
            case componentRectangleModuleConstants.RECTANGLE_SET_BORDER_COLOR:
                let borderColor = vmData.getRecordFromSrcOffset(['window', 'component', 'red', 'grn', 'blu']);
                let borderRgb   = {red: borderColor.red, grn: borderColor.grn, blu: borderColor.blu};
                dispatcher.dispatch(borderColor.window + '_' + borderColor.component, borderRgb);
                break;
            case componentRectangleModuleConstants.RECTANGLE_SET_BORDER_WIDTH:  property = 'borderWidth';  break;
            case componentRectangleModuleConstants.RECTANGLE_SET_BORDER_RADIUS: property = 'borderRadius'; break;
        }
        if (property !== '') {
            rectangle      = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            opts[property] = rectangle[property];
            dispatcher.dispatch(rectangle.window + '_' + rectangle.component, opts);
        }
    }
};
