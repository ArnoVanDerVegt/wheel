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
        let value    = false;
        switch (commandId) {
            case componentTimeoutModuleConstants.TIMEOUT_SET_TIME: property = 'time';                 break;
            case componentTimeoutModuleConstants.TIMEOUT_START:    property = 'start';  value = true; break;
            case componentTimeoutModuleConstants.TIMEOUT_CANCEL:   property = 'cancel'; value = true; break;
        }
        if (property !== '') {
            timeout = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            if (value) {
                opts[property] = componentTimeoutModuleConstants.TIMEOUT_TEST_VALUE;
            } else {
                opts[property] = timeout[property];
            }
            dispatcher.dispatch(timeout.window + '_' + timeout.component, opts);
        }
    }
};
