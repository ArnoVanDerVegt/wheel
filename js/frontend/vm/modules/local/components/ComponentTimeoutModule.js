/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentTimeoutModuleConstants = require('../../../../../shared/vm/modules/components/componentTimeoutModuleConstants');
const dispatcher                      = require('../../../../lib/dispatcher').dispatcher;
const VMModule                        = require('./../../VMModule').VMModule;

exports.ComponentTimeoutModule = class extends VMModule {
    run(commandId) {
        let vmData   = this._vmData;
        let vm       = this._vm;
        let property = '';
        let timeout  = null;
        let opts     = {};
        switch (commandId) {
            case componentIntervalModuleConstants.TIMEOUT_SET_TIME: property = 'time';   break;
            case componentIntervalModuleConstants.TIMEOUT_PAUSE:    property = 'start';  break;
            case componentIntervalModuleConstants.TIMEOUT_RESUME:   property = 'cancel'; break;
        }
        if (property !== '') {
            timeout        = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            opts[property] = timeout[property];
            dispatcher.dispatch(timeout.window + '_' + timeout.component, opts);
        }
    }
};
