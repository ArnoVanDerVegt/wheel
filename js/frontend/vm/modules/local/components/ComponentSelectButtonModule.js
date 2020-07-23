/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentSelectButtonModuleConstants = require('../../../../../shared/vm/modules/components/componentSelectButtonModuleConstants');
const dispatcher                           = require('../../../../lib/dispatcher').dispatcher;
const VMIDEModule                          = require('./../../VMIDEModule').VMIDEModule;

exports.ComponentSelectButtonModule = class extends VMIDEModule {
    run(commandId) {
        let vmData       = this._vmData;
        let vm           = this._vm;
        let property     = '';
        let selectButton = null;
        let opts         = {};
        let component;
        switch (commandId) {
            case componentSelectButtonModuleConstants.SELECT_BUTTON_SET_HIDDEN:    property = 'hidden';   break;
            case componentSelectButtonModuleConstants.SELECT_BUTTON_SET_DISABLED:  property = 'disabled'; break;
            case componentSelectButtonModuleConstants.SELECT_BUTTON_SET_X:         property = 'x';        break;
            case componentSelectButtonModuleConstants.SELECT_BUTTON_SET_Y:         property = 'y';        break;
            case componentSelectButtonModuleConstants.SELECT_BUTTON_SET_COLOR:     property = 'color';    break;
            case componentSelectButtonModuleConstants.SELECT_BUTTON_SET_ACTIVE:    property = 'active';   break;
            case componentSelectButtonModuleConstants.SELECT_BUTTON_GET_ACTIVE:
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
            selectButton   = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            opts[property] = selectButton[property];
            dispatcher.dispatch(selectButton.window + '_' + selectButton.component, opts);
        }
    }
};
