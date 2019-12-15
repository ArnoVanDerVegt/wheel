/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../../shared/vm/modules/sensorModuleConstants');
const VMModule              = require('./../VMModule').VMModule;

exports.SensorModule = class extends VMModule {
    run(commandId) {
        let vm     = this._vm;
        let vmData = this._vmData;
        let sensor;
        switch (commandId) {
            case sensorModuleConstants.SENSOR_SET_TYPE:
                this.emit('Sensor.SetType', vmData.getRecordFromAtOffset(['layer', 'id', 'type']));
                break;
            case sensorModuleConstants.SENSOR_GET_TYPE:
                sensor = vmData.getRecordFromAtOffset(['layer', 'id']);
                sensor.callback = function(value) { vmData.setNumberAtRet(value); };
                this.emit('Sensor.GetType', sensor);
                break;
            case sensorModuleConstants.SENSOR_SET_MODE:
                this.emit('Sensor.SetMode', vmData.getRecordFromAtOffset(['layer', 'id', 'mode']));
                break;
            case sensorModuleConstants.SENSOR_RESET:
                this.emit('Sensor.Reset', vmData.getRecordFromAtOffset(['layer', 'id']));
                break;
            case sensorModuleConstants.SENSOR_READ:
                sensor = vmData.getRecordFromAtOffset(['layer', 'id']);
                sensor.callback = function(value) { vmData.setNumberAtRet(value); };
                this.emit('Sensor.Read', sensor);
                break;
        }
    }
};
