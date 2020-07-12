/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const componentEV3MotorModuleConstants = require('../../../../../shared/vm/modules/components/componentEV3MotorModuleConstants');
const VMModule                         = require('./../../VMModule').VMModule;
const dispatcher                       = require('../../../../lib/dispatcher').dispatcher;

exports.ComponentEV3MotorModule = class extends VMModule {
    run(commandId) {
        let vmData   = this._vmData;
        let vm       = this._vm;
        let property = '';
        let ev3Motor = null;
        let opts     = {};
        switch (commandId) {
            case componentEV3MotorModuleConstants.EV3_MOTOR_SET_TYPE:  property = 'type';  break;
            case componentEV3MotorModuleConstants.EV3_MOTOR_SET_PORT:  property = 'port';  break;
            case componentEV3MotorModuleConstants.EV3_MOTOR_SET_SPEED: property = 'speed'; break;
            case componentEV3MotorModuleConstants.EV3_MOTOR_SET_VALUE: property = 'value'; break;
            case componentEV3MotorModuleConstants.EV3_MOTOR_SET_READY: property = 'ready'; break;
        }
        if (property !== '') {
            ev3Motor       = vmData.getRecordFromSrcOffset(['window', 'component', property]);
            opts[property] = ev3Motor[property];
            dispatcher.dispatch(ev3Motor.window + '_' + ev3Motor.component, opts);
        }
    }
};
