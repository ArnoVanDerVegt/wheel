/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentEV3SensorModuleConstants = require('../../../../../shared/vm/modules/components/componentEV3SensorModuleConstants');
const dispatcher                        = require('../../../../lib/dispatcher').dispatcher;
const VMModule                          = require('./../../VMModule').VMModule;

exports.ComponentEV3SensorModule = class extends VMModule {
    run(commandId) {
        let vmData    = this._vmData;
        let vm        = this._vm;
        let property  = '';
        let ev3Sensor = null;
        let opts      = {};
        switch (commandId) {
            case componentEV3SensorModuleConstants.EV3_SENSOR_SET_TYPE:  property = 'type';  break;
            case componentEV3SensorModuleConstants.EV3_SENSOR_SET_PORT:  property = 'port';  break;
            case componentEV3SensorModuleConstants.EV3_SENSOR_SET_VALUE: property = 'value'; break;
        }
        if (property !== '') {
            ev3Sensor      = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            opts[property] = ev3Sensor[property];
            dispatcher.dispatch(ev3Sensor.window + '_' + ev3Sensor.component, opts);
        }
    }
};
