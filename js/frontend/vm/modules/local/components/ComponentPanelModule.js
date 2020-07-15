/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentPanelModuleConstants = require('../../../../../shared/vm/modules/components/componentPanelModuleConstants');
const dispatcher                    = require('../../../../lib/dispatcher').dispatcher;
const VMModule                      = require('./../../VMModule').VMModule;

exports.ComponentPanelModule = class extends VMModule {
    run(commandId) {
        let vmData   = this._vmData;
        let vm       = this._vm;
        let property = '';
        let panel    = null;
        let opts     = {};
        switch (commandId) {
            case componentPanelModuleConstants.PANEL_SET_HIDDEN: property = 'hidden'; break;
            case componentPanelModuleConstants.PANEL_SET_X:      property = 'x';      break;
            case componentPanelModuleConstants.PANEL_SET_Y:      property = 'y';      break;
            case componentPanelModuleConstants.PANEL_SET_WIDTH:  property = 'width';  break;
            case componentPanelModuleConstants.PANEL_SET_HEIGHT: property = 'height'; break;
        }
        if (property !== '') {
            panel          = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            opts[property] = panel[property];
            dispatcher.dispatch(panel.window + '_' + panel.component, opts);
        }
    }
};
