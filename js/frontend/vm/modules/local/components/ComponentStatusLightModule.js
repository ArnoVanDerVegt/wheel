/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentStatusLightModuleConstants = require('../../../../../shared/vm/modules/components/componentStatusLightModuleConstants');
const VMModule                            = require('./../../VMModule').VMModule;
const dispatcher                          = require('../../../../lib/dispatcher').dispatcher;

exports.ComponentStatusLightModule = class extends VMModule {
    run(commandId) {
        let vmData      = this._vmData;
        let vm          = this._vm;
        let property    = '';
        let statusLight = null;
        let opts        = {};
        switch (commandId) {
            case componentStatusLightModuleConstants.STATUS_LIGHT_SET_HIDDEN:    property = 'hidden';    break;
            case componentStatusLightModuleConstants.STATUS_LIGHT_SET_X:         property = 'x';         break;
            case componentStatusLightModuleConstants.STATUS_LIGHT_SET_Y:         property = 'y';         break;
            case componentStatusLightModuleConstants.STATUS_LIGHT_SET_COLOR:     property = 'color';     break;
            case componentStatusLightModuleConstants.STATUS_LIGHT_SET_RGB_COLOR: property = 'rgbColor';  break;
            case componentStatusLightModuleConstants.STATUS_LIGHT_SET_RGB:
                statusLight = vmData.getRecordFromSrcOffset(['window', 'component', 'red', 'grn', 'blu']);
                let rgb = {red: statusLight.red, grn: statusLight.grn, blu: statusLight.blu};
                dispatcher.dispatch(statusLight.window + '_' + statusLight.component, rgb);
                break;
        }
        if (property !== '') {
            statusLight    = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            opts[property] = statusLight[property];
            dispatcher.dispatch(statusLight.window + '_' + statusLight.component, opts);
        }
    }
};
