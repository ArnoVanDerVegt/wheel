/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentProgressBarModuleConstants = require('../../../../../shared/vm/modules/components/componentProgressBarModuleConstants');
const dispatcher                          = require('../../../../lib/dispatcher').dispatcher;
const VMModule                            = require('./../../VMModule').VMModule;

exports.ComponentProgressBarModule = class extends VMModule {
    run(commandId) {
        let vmData      = this._vmData;
        let vm          = this._vm;
        let property    = '';
        let progressBar = null;
        let opts        = {};
        switch (commandId) {
            case componentProgressBarModuleConstants.PROGRESS_BAR_SET_HIDDEN: property = 'hidden'; break;
            case componentProgressBarModuleConstants.PROGRESS_BAR_SET_X:      property = 'x';      break;
            case componentProgressBarModuleConstants.PROGRESS_BAR_SET_Y:      property = 'y';      break;
            case componentProgressBarModuleConstants.PROGRESS_BAR_SET_WIDTH:  property = 'width';  break;
            case componentProgressBarModuleConstants.PROGRESS_BAR_SET_VALUE:  property = 'value';  break;
        }
        if (property !== '') {
            progressBar    = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            opts[property] = progressBar[property];
            dispatcher.dispatch(progressBar.window + '_' + progressBar.component, opts);
        }
    }
};
