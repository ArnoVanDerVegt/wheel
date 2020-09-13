/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentPUDeviceModuleConstants = require('../../../../../shared/vm/modules/components/componentPUDeviceModuleConstants');
const dispatcher                       = require('../../../../lib/dispatcher').dispatcher;
const VMModule                         = require('./../../VMModule').VMModule;

exports.ComponentPUDeviceModule = class extends VMModule {
    run(commandId) {
        let vmData   = this._vmData;
        let vm       = this._vm;
        let property = '';
        let puDevice = null;
        let opts     = {};
        switch (commandId) {
            case componentPUDeviceModuleConstants.PU_DEVICE_SET_TYPE:       property = 'device';    break;
            case componentPUDeviceModuleConstants.PU_DEVICE_SET_PORT:       property = 'port';      break;
            case componentPUDeviceModuleConstants.PU_DEVICE_SET_SPEED:      property = 'speed';     break;
            case componentPUDeviceModuleConstants.PU_DEVICE_SET_VALUE:      property = 'value';     break;
            case componentPUDeviceModuleConstants.PU_DEVICE_SET_READY:      property = 'ready';     break;
            case componentPUDeviceModuleConstants.PU_DEVICE_SET_COLOR_MODE: property = 'colorMode'; break;
        }
        if (property !== '') {
            puDevice       = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            opts[property] = puDevice[property];
            dispatcher.dispatch(puDevice.window + '_' + puDevice.component, opts);
        }
    }
};
