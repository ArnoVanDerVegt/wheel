/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentButtonModuleConstants = require('../../../../../shared/vm/modules/components/componentButtonModuleConstants');
const VMModule                       = require('./../../VMModule').VMModule;
const dispatcher                     = require('../../../../lib/dispatcher').dispatcher;

exports.ComponentButtonModule = class extends VMModule {
    run(commandId) {
        let vmData   = this._vmData;
        let vm       = this._vm;
        let property = '';
        let button   = null;
        let opts     = {};
        switch (commandId) {
            case componentButtonModuleConstants.BUTTON_SET_TAB_INDEX: property = 'tabIndex'; break;
            case componentButtonModuleConstants.BUTTON_SET_HIDDEN:    property = 'hidden';   break;
            case componentButtonModuleConstants.BUTTON_SET_DISABLED:  property = 'disabled'; break;
            case componentButtonModuleConstants.BUTTON_SET_X:         property = 'x';        break;
            case componentButtonModuleConstants.BUTTON_SET_Y:         property = 'y';        break;
            case componentButtonModuleConstants.BUTTON_SET_COLOR:     property = 'color';    break;
            case componentButtonModuleConstants.BUTTON_SET_VALUE:     property = 'value';    break;
            case componentButtonModuleConstants.BUTTON_SET_TITLE:     property = 'title';    break;
        }
        if (property !== '') {
            button         = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            opts[property] = button[property];
            dispatcher.dispatch(button.window + '_' + button.component, opts);
        }
    }
};
