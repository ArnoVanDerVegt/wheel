/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentIntervalModuleConstants = require('../../../../../shared/vm/modules/components/componentIntervalModuleConstants');
const dispatcher                       = require('../../../../lib/dispatcher').dispatcher;
const VMModule                         = require('./../../VMModule').VMModule;

exports.ComponentIntervalModule = class extends VMModule {
    run(commandId) {
        let vmData   = this._vmData;
        let vm       = this._vm;
        let property = '';
        let interval = null;
        let opts     = {};
        let value    = false;
        switch (commandId) {
            case componentIntervalModuleConstants.INTERVAL_SET_TIME: property = 'time';                 break;
            case componentIntervalModuleConstants.INTERVAL_PAUSE:    property = 'pause';  value = true; break;
            case componentIntervalModuleConstants.INTERVAL_RESUME:   property = 'resume'; value = true; break;
        }
        if (property !== '') {
            interval = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            if (value) {
                opts[property] = componentIntervalModuleConstants.INTERVAL_TEST_VALUE;
            } else {
                opts[property] = interval[property];
            }
            dispatcher.dispatch(interval.window + '_' + interval.component, opts);
        }
    }
};
